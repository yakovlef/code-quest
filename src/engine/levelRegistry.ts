import type { LevelManifest } from '../types';
import { level1 } from '../data/levels/level-1-hello-world';
import { levelReference } from '../data/levels/level-reference';

class LevelRegistry {
  private levels = new Map<string, LevelManifest>();

  register(manifest: LevelManifest): void {
    this.levels.set(manifest.id, manifest);
  }

  unregister(id: string): void {
    this.levels.delete(id);
  }

  get(id: string): LevelManifest | undefined {
    return this.levels.get(id);
  }

  getAll(): LevelManifest[] {
    return Array.from(this.levels.values())
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  getBuiltin(): LevelManifest[] {
    return this.getAll().filter(m => m.source === 'builtin');
  }

  getCommunity(): LevelManifest[] {
    return this.getAll().filter(m => m.source === 'community');
  }

  has(id: string): boolean {
    return this.levels.has(id);
  }
}

export const levelRegistry = new LevelRegistry();

// Register built-in levels
levelRegistry.register({
  id: level1.id,
  name: level1.name,
  description: level1.description,
  author: level1.author,
  version: level1.version,
  difficulty: level1.difficulty,
  tags: level1.tags,
  order: level1.order,
  source: 'builtin',
  load: () => level1,
});

levelRegistry.register({
  id: levelReference.id,
  name: levelReference.name,
  description: levelReference.description,
  author: levelReference.author,
  version: levelReference.version,
  difficulty: levelReference.difficulty,
  tags: levelReference.tags,
  order: levelReference.order,
  source: 'builtin',
  load: () => levelReference,
});
