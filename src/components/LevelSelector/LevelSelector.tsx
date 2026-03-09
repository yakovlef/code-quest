import { useState, useRef, type ChangeEvent } from 'react';
import type { LevelManifest } from '../../types';
import { levelRegistry } from '../../engine/levelRegistry';
import {
  loadLevelFromFile,
  registerCommunityLevel,
  saveCommunityLevel,
  removeCommunityLevel,
} from '../../engine/levelLoader';
import { useGameStore } from '../../stores/gameStore';

interface LevelSelectorProps {
  onSelectLevel: (levelId: string) => void;
  onContinue?: () => void;
}

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Начинающий', color: 'text-cyber-green border-cyber-green' },
  intermediate: { label: 'Средний', color: 'text-cyber-orange border-cyber-orange' },
  advanced: { label: 'Продвинутый', color: 'text-cyber-red border-cyber-red' },
} as const;

export function LevelSelector({ onSelectLevel, onContinue }: LevelSelectorProps) {
  const [levels, setLevels] = useState<LevelManifest[]>(() => levelRegistry.getAll());
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentLevelId = useGameStore(state => state.currentLevelId);

  const refreshLevels = () => setLevels(levelRegistry.getAll());

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    setImportSuccess(null);

    const result = await loadLevelFromFile(file);

    if (result.success) {
      if (levelRegistry.has(result.level.id)) {
        setImportErrors([`Уровень с id "${result.level.id}" уже существует`]);
      } else {
        registerCommunityLevel(result.level);
        saveCommunityLevel(result.level);
        refreshLevels();
        setImportSuccess(`Уровень "${result.level.name}" успешно импортирован!`);
      }
    } else {
      setImportErrors(result.errors);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    removeCommunityLevel(id);
    refreshLevels();
    setImportSuccess(null);
  };

  return (
    <div className="min-h-screen bg-space-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-space-800 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wider text-center">
          <span className="text-cyber-cyan glow-cyan">SPACE</span>
          <span className="text-gray-400 mx-2">//</span>
          <span className="text-cyber-green glow-green">RANGERS</span>
          <span className="text-gray-400 mx-2">//</span>
          <span className="text-cyber-orange">QUEST</span>
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1">
          Выбери уровень для прохождения
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* Continue button */}
        {currentLevelId && onContinue && (
          <button
            onClick={onContinue}
            className="w-full mb-6 p-4 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-lg
                       hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all
                       hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
          >
            <div className="text-cyber-cyan font-bold text-lg">▶ Продолжить игру</div>
            <div className="text-gray-400 text-sm mt-1">
              {levels.find(l => l.id === currentLevelId)?.name ?? currentLevelId}
            </div>
          </button>
        )}

        {/* Level cards */}
        <div className="space-y-4">
          {levels.map(level => (
            <div
              key={level.id}
              className="bg-space-800 border border-gray-700 rounded-lg p-5 hover:border-cyber-cyan/50
                         transition-all hover:shadow-[0_0_10px_rgba(0,255,255,0.1)] group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-cyber-cyan transition-colors">
                      {level.name}
                    </h3>
                    {level.difficulty && (
                      <span className={`text-xs px-2 py-0.5 border rounded ${DIFFICULTY_CONFIG[level.difficulty].color}`}>
                        {DIFFICULTY_CONFIG[level.difficulty].label}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      level.source === 'builtin'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50'
                    }`}>
                      {level.source === 'builtin' ? 'Встроенный' : 'Community'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mt-2">{level.description}</p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {level.author && <span>Автор: {level.author}</span>}
                    {level.version && <span>v{level.version}</span>}
                  </div>

                  {/* Tags */}
                  {level.tags && level.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {level.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-space-700 text-gray-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => onSelectLevel(level.id)}
                    className="px-5 py-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan
                               hover:bg-cyber-cyan/30 rounded transition-all text-sm font-bold
                               hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                  >
                    Играть
                  </button>
                  {level.source === 'community' && (
                    <button
                      onClick={() => handleDelete(level.id)}
                      className="px-5 py-2 bg-cyber-red/10 text-cyber-red/70 border border-cyber-red/30
                                 hover:bg-cyber-red/20 hover:text-cyber-red rounded transition-all text-xs"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Import section */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-gray-700 rounded-lg
                       hover:border-cyber-cyan/50 hover:bg-space-800 transition-all
                       text-gray-400 hover:text-cyber-cyan"
          >
            <div className="text-sm font-bold">+ Импорт уровня (JSON)</div>
            <div className="text-xs mt-1 text-gray-500">
              Загрузите .json файл с описанием квеста
            </div>
          </button>

          {/* Import success */}
          {importSuccess && (
            <div className="mt-4 p-3 bg-cyber-green/10 border border-cyber-green/30 rounded-lg text-cyber-green text-sm">
              {importSuccess}
            </div>
          )}

          {/* Import errors */}
          {importErrors.length > 0 && (
            <div className="mt-4 p-4 bg-cyber-red/10 border border-cyber-red/30 rounded-lg">
              <div className="text-cyber-red font-bold text-sm mb-2">Ошибки валидации:</div>
              <ul className="space-y-1">
                {importErrors.map((error, i) => (
                  <li key={i} className="text-cyber-red/80 text-xs font-mono">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-space-800 px-6 py-2 text-xs text-gray-500">
        <div className="flex justify-between max-w-4xl mx-auto w-full">
          <span>v0.1.0 // Phase 0</span>
          <span>{levels.length} уровней доступно</span>
        </div>
      </footer>
    </div>
  );
}
