import { z } from 'zod';
import type { Level } from '../types';

// ===========================================
// ZOD SCHEMAS
// ===========================================

const EffectTypeSchema = z.enum([
  'addItem',
  'removeItem',
  'modifyHp',
  'modifyFocus',
  'setMaxHp',
  'setMaxFocus',
  'setFlag',
  'removeFlag',
  'teleport',
  'showMessage',
  'lintSay',
  'completeChallenge',
]);

const EffectSchema = z.object({
  type: EffectTypeSchema,
  target: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

const ConditionSchema = z.object({
  hasItem: z.string().optional(),
  notHasItem: z.string().optional(),
  hasFlag: z.string().optional(),
  notHasFlag: z.string().optional(),
  minHp: z.number().optional(),
  maxHp: z.number().optional(),
  minFocus: z.number().optional(),
  challengeCompleted: z.string().optional(),
});

const SolutionSchema = z.object({
  pattern: z.string(),
  isRegex: z.boolean(),
  isCorrect: z.boolean(),
  lintReaction: z.string(),
  effects: z.array(EffectSchema).optional(),
  errorType: z.enum(['syntax', 'logic', 'runtime']).optional(),
});

const ChallengeSchema = z.object({
  id: z.string(),
  setup: z.string(),
  instruction: z.string(),
  lintHint: z.string(),
  solutions: z.array(SolutionSchema).min(1),
  onComplete: z.array(EffectSchema),
  isCompleted: z.boolean().optional(),
});

const DangerActionSchema = z.object({
  id: z.string(),
  text: z.string(),
  damage: z.number(),
  deathMessage: z.string(),
  lintDeathComment: z.string(),
});

const ObjectActionSchema = z.object({
  id: z.string(),
  text: z.string(),
  lintComment: z.string().optional(),
  effects: z.array(EffectSchema),
  requires: ConditionSchema.optional(),
  failMessage: z.string().optional(),
  successMessage: z.string().optional(),
});

const InteractiveObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  actions: z.array(ObjectActionSchema),
  isHidden: z.boolean().optional(),
  appearsWhen: ConditionSchema.optional(),
});

const ExitSchema = z.object({
  direction: z.string(),
  targetLocation: z.string(),
  description: z.string(),
  requires: ConditionSchema.optional(),
  lockedMessage: z.string().optional(),
});

const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  asciiArt: z.string().optional(),
  lintComment: z.string(),
  objects: z.array(InteractiveObjectSchema).optional(),
  challenge: ChallengeSchema.optional(),
  exits: z.array(ExitSchema),
  isDangerous: z.boolean().optional(),
  dangerAction: DangerActionSchema.optional(),
  onEnter: z.array(EffectSchema).optional(),
  isCheckpoint: z.boolean().optional(),
});

const LevelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  locations: z.array(LocationSchema).min(1),
  startLocation: z.string().min(1),
  completionCondition: ConditionSchema,
  author: z.string().optional(),
  version: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
  order: z.number().optional(),
  completionMessage: z.string().optional(),
  completionSummary: z.array(z.string()).optional(),
  nextLevelId: z.string().optional(),
  initialHp: z.number().positive().optional(),
  initialMaxHp: z.number().positive().optional(),
  initialFocus: z.number().min(0).optional(),
  initialMaxFocus: z.number().positive().optional(),
});

// ===========================================
// VALIDATION
// ===========================================

export type ValidationResult =
  | { success: true; level: Level }
  | { success: false; errors: string[] };

export function validateLevel(data: unknown): ValidationResult {
  // Step 1: Structural validation via Zod
  const parsed = LevelSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => {
      const path = issue.path.join('.');
      return `[${path}] ${issue.message}`;
    });
    return { success: false, errors };
  }

  const level = parsed.data;
  const errors: string[] = [];

  // Step 2: Referential integrity
  const locationIds = new Set(level.locations.map(l => l.id));

  // startLocation must exist
  if (!locationIds.has(level.startLocation)) {
    errors.push(`startLocation "${level.startLocation}" не найден среди локаций`);
  }

  // Check for duplicate location IDs
  const seenLocationIds = new Set<string>();
  for (const loc of level.locations) {
    if (seenLocationIds.has(loc.id)) {
      errors.push(`Дублирующийся id локации: "${loc.id}"`);
    }
    seenLocationIds.add(loc.id);
  }

  // Check for duplicate challenge IDs
  const seenChallengeIds = new Set<string>();
  for (const loc of level.locations) {
    if (loc.challenge) {
      if (seenChallengeIds.has(loc.challenge.id)) {
        errors.push(`Дублирующийся id задачи: "${loc.challenge.id}"`);
      }
      seenChallengeIds.add(loc.challenge.id);
    }
  }

  // All exit.targetLocation must reference existing locations
  for (const loc of level.locations) {
    for (const exit of loc.exits) {
      if (!locationIds.has(exit.targetLocation)) {
        errors.push(
          `Локация "${loc.id}": выход "${exit.direction}" ведёт в несуществующую локацию "${exit.targetLocation}"`
        );
      }
    }
  }

  // All teleport effects must reference existing locations
  for (const loc of level.locations) {
    const allEffects = collectEffects(loc);
    for (const effect of allEffects) {
      if (effect.type === 'teleport' && !locationIds.has(effect.target)) {
        errors.push(
          `Локация "${loc.id}": эффект teleport ведёт в несуществующую локацию "${effect.target}"`
        );
      }
    }
  }

  // Step 3: Regex validation
  for (const loc of level.locations) {
    if (loc.challenge) {
      for (let i = 0; i < loc.challenge.solutions.length; i++) {
        const solution = loc.challenge.solutions[i];
        if (solution.isRegex) {
          try {
            new RegExp(solution.pattern);
          } catch {
            errors.push(
              `Локация "${loc.id}", задача "${loc.challenge.id}", решение #${i + 1}: невалидный regex "${solution.pattern}"`
            );
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, level: level as Level };
}

// Helper: collect all effects from a location (challenge onComplete, object actions, onEnter)
function collectEffects(loc: z.infer<typeof LocationSchema>) {
  const effects: z.infer<typeof EffectSchema>[] = [];

  if (loc.onEnter) effects.push(...loc.onEnter);
  if (loc.challenge) effects.push(...loc.challenge.onComplete);

  if (loc.objects) {
    for (const obj of loc.objects) {
      for (const action of obj.actions) {
        effects.push(...action.effects);
      }
    }
  }

  return effects;
}
