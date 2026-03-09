import type { Level } from '../types';
import { validateLevel, type ValidationResult } from './levelSchema';
import { levelRegistry } from './levelRegistry';

const STORAGE_KEY = 'space-rangers-community-levels';

// ===========================================
// LOADING
// ===========================================

export function loadBuiltinLevel(id: string): Level {
  const manifest = levelRegistry.get(id);
  if (!manifest) {
    throw new Error(`Level "${id}" not found in registry`);
  }
  return manifest.load();
}

export function loadLevelFromJSON(jsonString: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return {
      success: false,
      errors: [`Невалидный JSON: ${(e as Error).message}`],
    };
  }
  return validateLevel(parsed);
}

export async function loadLevelFromFile(file: File): Promise<ValidationResult> {
  const text = await file.text();
  return loadLevelFromJSON(text);
}

// ===========================================
// COMMUNITY LEVEL REGISTRATION
// ===========================================

export function registerCommunityLevel(level: Level): void {
  levelRegistry.register({
    id: level.id,
    name: level.name,
    description: level.description,
    author: level.author,
    version: level.version,
    difficulty: level.difficulty,
    tags: level.tags,
    order: level.order ?? 900,
    source: 'community',
    load: () => level,
  });
}

// ===========================================
// LOCALSTORAGE PERSISTENCE
// ===========================================

function getStoredLevels(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function setStoredLevels(levels: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
}

export function saveCommunityLevel(level: Level): void {
  const stored = getStoredLevels();
  stored[level.id] = JSON.stringify(level);
  setStoredLevels(stored);
}

export function removeCommunityLevel(id: string): void {
  levelRegistry.unregister(id);
  const stored = getStoredLevels();
  delete stored[id];
  setStoredLevels(stored);
}

export function loadCommunityLevelsFromStorage(): void {
  const stored = getStoredLevels();

  for (const [id, jsonString] of Object.entries(stored)) {
    const result = loadLevelFromJSON(jsonString);
    if (result.success) {
      registerCommunityLevel(result.level);
    } else {
      console.warn(`Community level "${id}" failed validation, removing from storage:`, result.errors);
      delete stored[id];
    }
  }

  // Update storage to remove invalid levels
  setStoredLevels(stored);
}
