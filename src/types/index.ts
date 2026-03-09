// ===========================================
// PLAYER TYPES
// ===========================================

export interface Player {
  hp: number;
  maxHp: number;
  focus: number;
  maxFocus: number;
  inventory: InventoryItem[];
  flags: Record<string, boolean>;
  currentLocation: string;
  checkpoint: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  effect?: Effect;
}

// ===========================================
// LOCATION TYPES
// ===========================================

export interface Location {
  id: string;
  name: string;
  description: string;
  descriptionUpdates?: { condition: Condition; description: string }[];
  asciiArt?: string;
  asciiArtUpdates?: { condition: Condition; asciiArt: string }[];
  lintComment: string;
  objects?: InteractiveObject[];
  challenge?: Challenge;
  exits: Exit[];
  isDangerous?: boolean;
  dangerAction?: DangerAction;
  onEnter?: Effect[];
  isCheckpoint?: boolean;
}

export interface Exit {
  direction: string;
  targetLocation: string;
  description: string;
  requires?: Condition;
  lockedMessage?: string;
}

// ===========================================
// INTERACTIVE OBJECTS
// ===========================================

export interface InteractiveObject {
  id: string;
  name: string;
  description: string;
  actions: ObjectAction[];
  isHidden?: boolean;
  appearsWhen?: Condition;
}

export interface ObjectAction {
  id: string;
  text: string;
  lintComment?: string;
  effects: Effect[];
  requires?: Condition;
  failMessage?: string;
  successMessage?: string;
}

// ===========================================
// CHALLENGE (CODING TASKS)
// ===========================================

export interface Challenge {
  id: string;
  setup: string;           // Initial code shown
  instruction: string;     // What player needs to do
  lintHint: string;        // L.I.N.T.'s sarcastic hint
  solutions: Solution[];
  onComplete: Effect[];
  isCompleted?: boolean;

  /** Sandbox mode: execute user code in QuickJS instead of regex matching */
  sandbox?: SandboxChallenge;
}

/** Configuration for sandbox-based code execution */
export interface SandboxChallenge {
  /** Objects injected as globals into sandbox (e.g. { powerSystem: {} }) */
  context: Record<string, unknown>;
  /** JS expression evaluated after user code; must return true */
  validate: string;
  /** Timeout in ms (default 3000) */
  timeout?: number;
  /** L.I.N.T. reaction on success */
  successReaction: string;
  /** L.I.N.T. reaction on validation failure (code ran but result wrong) */
  failReaction: string;
}

export interface Solution {
  pattern: string;         // Regex pattern or exact match
  isRegex: boolean;
  isCorrect: boolean;
  lintReaction: string;
  effects?: Effect[];
  errorType?: 'syntax' | 'logic' | 'runtime';
}

// ===========================================
// DANGER / DEATH
// ===========================================

export interface DangerAction {
  id: string;
  text: string;
  damage: number;
  deathMessage: string;
  lintDeathComment: string;
  showWhen?: Condition;
}

// ===========================================
// CONDITIONS & EFFECTS
// ===========================================

export interface Condition {
  hasItem?: string;
  notHasItem?: string;
  hasFlag?: string;
  notHasFlag?: string;
  minHp?: number;
  maxHp?: number;
  minFocus?: number;
  challengeCompleted?: string;
}

export interface Effect {
  type: EffectType;
  target: string;
  value?: string | number | boolean;
}

export type EffectType =
  | 'addItem'
  | 'removeItem'
  | 'modifyHp'
  | 'modifyFocus'
  | 'setMaxHp'
  | 'setMaxFocus'
  | 'setFlag'
  | 'removeFlag'
  | 'teleport'
  | 'showMessage'
  | 'lintSay'
  | 'completeChallenge';

// ===========================================
// GAME STATE
// ===========================================

export interface GameState {
  player: Player;
  currentLevel: Level;
  gameLog: GameLogEntry[];
  terminalState: TerminalState;
  isDead: boolean;
  isLevelComplete: boolean;
  lintMood: LintMood;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  locations: Location[];
  startLocation: string;

  // Plugin system fields
  completionCondition: Condition;
  author?: string;
  version?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  order?: number;
  completionMessage?: string;
  completionSummary?: string[];
  nextLevelId?: string;
  initialHp?: number;
  initialMaxHp?: number;
  initialFocus?: number;
  initialMaxFocus?: number;
}

export interface LevelManifest {
  id: string;
  name: string;
  description: string;
  author?: string;
  version?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  order?: number;
  source: 'builtin' | 'community';
  load: () => Level;
}

export type AppScreen = 'menu' | 'game' | 'levelComplete';

export interface GameLogEntry {
  id: string;
  type: 'lint' | 'system' | 'player' | 'error' | 'success';
  message: string;
  timestamp: number;
}

export interface TerminalState {
  isActive: boolean;
  currentChallenge: Challenge | null;
  input: string;
  output: TerminalOutput[];
  history: string[];
}

export interface TerminalOutput {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

export type LintMood = 'neutral' | 'annoyed' | 'impressed' | 'angry' | 'sarcastic';

// ===========================================
// L.I.N.T. CHARACTER
// ===========================================

export interface LintDialogue {
  mood: LintMood;
  text: string;
  isTyping?: boolean;
}

export const LINT_AVATARS: Record<LintMood, string> = {
  neutral: '[¬_¬]',
  annoyed: '[>_<]',
  impressed: '[o_o]',
  angry: '[X_X]',
  sarcastic: '[-_-]',
};
