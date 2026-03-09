import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Player,
  Level,
  Location,
  GameLogEntry,
  TerminalState,
  LintMood,
  Effect,
  Challenge,
  Condition,
  InventoryItem,
} from '../types';
import { levelRegistry } from '../engine/levelRegistry';

interface GameStore {
  // State
  player: Player;
  currentLevel: Level | null;
  currentLevelId: string | null;
  locations: Map<string, Location>;
  gameLog: GameLogEntry[];
  terminalState: TerminalState;
  isDead: boolean;
  isLevelComplete: boolean;
  lintMood: LintMood;
  currentLintMessage: string | null;

  // Actions
  initGame: (level: Level) => void;
  startLevel: (levelId: string) => void;
  checkLevelCompletion: () => boolean;
  moveToLocation: (locationId: string) => void;
  getCurrentLocation: () => Location | null;

  // Player actions
  modifyHp: (amount: number) => void;
  modifyFocus: (amount: number) => void;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  setFlag: (flag: string, value?: boolean) => void;
  hasFlag: (flag: string) => boolean;

  // Terminal actions
  openTerminal: (challenge: Challenge) => void;
  closeTerminal: () => void;
  setTerminalInput: (input: string) => void;
  executeCode: (code: string) => { success: boolean; message: string };

  // Death & Respawn
  die: (message: string, lintComment: string) => void;
  respawn: () => void;
  saveCheckpoint: () => void;

  // Log & Lint
  addLog: (type: GameLogEntry['type'], message: string) => void;
  setLintMood: (mood: LintMood) => void;
  lintSay: (message: string, mood?: LintMood) => void;

  // Effects
  applyEffect: (effect: Effect) => void;
  applyEffects: (effects: Effect[]) => void;
  checkCondition: (condition: Condition) => boolean;

  // Level completion
  completeLevel: () => void;

  // Reset
  resetGame: () => void;
}

const initialPlayer: Player = {
  hp: 100,
  maxHp: 100,
  focus: 50,
  maxFocus: 50,
  inventory: [],
  flags: {},
  currentLocation: '',
  checkpoint: '',
};

const initialTerminalState: TerminalState = {
  isActive: false,
  currentChallenge: null,
  input: '',
  output: [],
  history: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      player: { ...initialPlayer },
      currentLevel: null,
      currentLevelId: null,
      locations: new Map(),
      gameLog: [],
      terminalState: { ...initialTerminalState },
      isDead: false,
      isLevelComplete: false,
      lintMood: 'neutral',
      currentLintMessage: null,

      // Initialize game with level
      initGame: (level: Level) => {
        const locationsMap = new Map<string, Location>();
        level.locations.forEach(loc => locationsMap.set(loc.id, loc));

        set({
          currentLevel: level,
          currentLevelId: level.id,
          locations: locationsMap,
          player: {
            ...initialPlayer,
            hp: level.initialHp ?? initialPlayer.hp,
            maxHp: level.initialMaxHp ?? initialPlayer.maxHp,
            focus: level.initialFocus ?? initialPlayer.focus,
            maxFocus: level.initialMaxFocus ?? initialPlayer.maxFocus,
            currentLocation: level.startLocation,
            checkpoint: level.startLocation,
          },
          gameLog: [],
          terminalState: { ...initialTerminalState },
          isDead: false,
          isLevelComplete: false,
          lintMood: 'neutral',
        });
      },

      // Start level from registry
      startLevel: (levelId: string) => {
        const manifest = levelRegistry.get(levelId);
        if (!manifest) {
          console.error(`Level ${levelId} not found in registry`);
          return;
        }
        get().initGame(manifest.load());
      },

      // Check if current level is complete (generic)
      checkLevelCompletion: () => {
        const { currentLevel, checkCondition } = get();
        if (!currentLevel?.completionCondition) return false;
        return checkCondition(currentLevel.completionCondition);
      },

      // Get current location
      getCurrentLocation: () => {
        const { player, locations } = get();
        return locations.get(player.currentLocation) || null;
      },

      // Move to location
      moveToLocation: (locationId: string) => {
        const { locations, applyEffects, lintSay, saveCheckpoint } = get();
        const location = locations.get(locationId);

        if (!location) {
          console.error(`Location ${locationId} not found`);
          return;
        }

        set(state => ({
          player: { ...state.player, currentLocation: locationId },
        }));

        // Apply onEnter effects
        if (location.onEnter) {
          applyEffects(location.onEnter);
        }

        // Save checkpoint if needed
        if (location.isCheckpoint) {
          saveCheckpoint();
        }

        // L.I.N.T. comments on new location
        if (location.lintComment) {
          lintSay(location.lintComment);
        }
      },

      // HP modification
      modifyHp: (amount: number) => {
        const { die } = get();

        set(state => {
          const newHp = Math.max(0, Math.min(state.player.maxHp, state.player.hp + amount));

          if (newHp <= 0) {
            // Will trigger death
            return { player: { ...state.player, hp: 0 } };
          }

          return { player: { ...state.player, hp: newHp } };
        });

        // Check for death after update
        const { player } = get();
        if (player.hp <= 0) {
          die('System failure. Process terminated.', 'Ну вот, опять ты всё сломал. Откатываемся...');
        }
      },

      // Focus modification
      modifyFocus: (amount: number) => {
        set(state => ({
          player: {
            ...state.player,
            focus: Math.max(0, Math.min(state.player.maxFocus, state.player.focus + amount)),
          },
        }));
      },

      // Inventory management
      addToInventory: (item: InventoryItem) => {
        set(state => ({
          player: {
            ...state.player,
            inventory: [...state.player.inventory, item],
          },
        }));
        get().addLog('system', `Получено: ${item.name}`);
      },

      removeFromInventory: (itemId: string) => {
        set(state => ({
          player: {
            ...state.player,
            inventory: state.player.inventory.filter(i => i.id !== itemId),
          },
        }));
      },

      hasItem: (itemId: string) => {
        return get().player.inventory.some(i => i.id === itemId);
      },

      // Flags
      setFlag: (flag: string, value = true) => {
        set(state => ({
          player: {
            ...state.player,
            flags: { ...state.player.flags, [flag]: value },
          },
        }));
      },

      hasFlag: (flag: string) => {
        return get().player.flags[flag] === true;
      },

      // Terminal
      openTerminal: (challenge: Challenge) => {
        set({
          terminalState: {
            isActive: true,
            currentChallenge: challenge,
            input: '',
            output: [
              { type: 'output', content: challenge.setup },
              { type: 'output', content: `\n// ${challenge.instruction}` },
            ],
            history: [],
          },
        });
        get().lintSay(challenge.lintHint, 'sarcastic');
      },

      closeTerminal: () => {
        set({
          terminalState: { ...initialTerminalState },
        });
      },

      setTerminalInput: (input: string) => {
        set(state => ({
          terminalState: { ...state.terminalState, input },
        }));
      },

      executeCode: (code: string) => {
        const { terminalState, applyEffects, lintSay, setFlag } = get();
        const challenge = terminalState.currentChallenge;

        if (!challenge) {
          return { success: false, message: 'No active challenge' };
        }

        // Add input to output
        set(state => ({
          terminalState: {
            ...state.terminalState,
            output: [...state.terminalState.output, { type: 'input', content: `> ${code}` }],
            history: [...state.terminalState.history, code],
          },
        }));

        // Check solutions
        for (const solution of challenge.solutions) {
          const matches = solution.isRegex
            ? new RegExp(solution.pattern).test(code)
            : code.trim() === solution.pattern.trim();

          if (matches) {
            if (solution.isCorrect) {
              // Success!
              set(state => ({
                terminalState: {
                  ...state.terminalState,
                  output: [
                    ...state.terminalState.output,
                    { type: 'success', content: '✓ Code executed successfully' },
                  ],
                },
              }));

              lintSay(solution.lintReaction, 'impressed');

              // Mark challenge as completed
              setFlag(`challenge_${challenge.id}_completed`);

              // Apply completion effects
              applyEffects(challenge.onComplete);

              // Update location to mark challenge as done
              const currentLocation = get().getCurrentLocation();
              if (currentLocation && currentLocation.challenge) {
                const updatedLocation = {
                  ...currentLocation,
                  challenge: { ...currentLocation.challenge, isCompleted: true },
                };
                const newLocations = new Map(get().locations);
                newLocations.set(currentLocation.id, updatedLocation);
                set({ locations: newLocations });
              }

              // Close terminal
              setTimeout(() => get().closeTerminal(), 1500);

              return { success: true, message: solution.lintReaction };
            } else {
              // Wrong answer
              set(state => ({
                terminalState: {
                  ...state.terminalState,
                  output: [
                    ...state.terminalState.output,
                    { type: 'error', content: `✗ ${solution.errorType || 'Error'}: ${solution.lintReaction}` },
                  ],
                },
              }));

              lintSay(solution.lintReaction, 'annoyed');

              if (solution.effects) {
                applyEffects(solution.effects);
              }

              return { success: false, message: solution.lintReaction };
            }
          }
        }

        // No matching solution - generic error
        const genericError = 'Синтаксическая ошибка. Попробуй ещё раз.';
        set(state => ({
          terminalState: {
            ...state.terminalState,
            output: [
              ...state.terminalState.output,
              { type: 'error', content: `✗ ${genericError}` },
            ],
          },
        }));

        lintSay('Это даже не похоже на код. Ты уверен, что умеешь программировать?', 'annoyed');

        return { success: false, message: genericError };
      },

      // Death & Respawn
      die: (message: string, lintComment: string) => {
        set({ isDead: true });
        get().addLog('error', message);
        get().lintSay(lintComment, 'angry');
      },

      respawn: () => {
        const { player, currentLevel } = get();

        set({
          isDead: false,
          player: {
            ...player,
            hp: player.maxHp,
            currentLocation: player.checkpoint || currentLevel?.startLocation || '',
          },
          terminalState: { ...initialTerminalState },
        });

        get().lintSay('Git revert завершён. Ты снова жив. Постарайся не умереть в ближайшие пять минут.', 'sarcastic');
      },

      saveCheckpoint: () => {
        set(state => ({
          player: { ...state.player, checkpoint: state.player.currentLocation },
        }));
        get().addLog('system', 'Контрольная точка сохранена');
      },

      // Logging
      addLog: (type: GameLogEntry['type'], message: string) => {
        const entry: GameLogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          message,
          timestamp: Date.now(),
        };

        set(state => ({
          gameLog: [...state.gameLog.slice(-50), entry], // Keep last 50 entries
        }));
      },

      // L.I.N.T.
      setLintMood: (mood: LintMood) => {
        set({ lintMood: mood });
      },

      lintSay: (message: string, mood: LintMood = 'neutral') => {
        set({ currentLintMessage: message, lintMood: mood });
        get().addLog('lint', message);
      },

      // Apply single effect
      applyEffect: (effect: Effect) => {
        const {
          modifyHp,
          modifyFocus,
          addToInventory,
          removeFromInventory,
          setFlag,
          moveToLocation,
          lintSay,
          addLog,
        } = get();

        switch (effect.type) {
          case 'modifyHp':
            modifyHp(effect.value as number);
            break;
          case 'modifyFocus':
            modifyFocus(effect.value as number);
            break;
          case 'setMaxHp':
            set(state => ({
              player: { ...state.player, maxHp: effect.value as number },
            }));
            break;
          case 'setMaxFocus':
            set(state => ({
              player: { ...state.player, maxFocus: effect.value as number },
            }));
            break;
          case 'addItem':
            addToInventory({
              id: effect.target,
              name: effect.value as string,
              description: '',
            });
            break;
          case 'removeItem':
            removeFromInventory(effect.target);
            break;
          case 'setFlag':
            setFlag(effect.target, effect.value as boolean ?? true);
            break;
          case 'removeFlag':
            setFlag(effect.target, false);
            break;
          case 'teleport':
            moveToLocation(effect.target);
            break;
          case 'showMessage':
            addLog('system', effect.value as string);
            break;
          case 'lintSay':
            lintSay(effect.value as string);
            break;
          case 'completeChallenge':
            setFlag(`challenge_${effect.target}_completed`);
            break;
        }
      },

      // Apply multiple effects
      applyEffects: (effects: Effect[]) => {
        effects.forEach(effect => get().applyEffect(effect));
      },

      // Check condition
      checkCondition: (condition: Condition) => {
        const { hasItem, hasFlag, player } = get();

        if (condition.hasItem && !hasItem(condition.hasItem)) return false;
        if (condition.notHasItem && hasItem(condition.notHasItem)) return false;
        if (condition.hasFlag && !hasFlag(condition.hasFlag)) return false;
        if (condition.notHasFlag && hasFlag(condition.notHasFlag)) return false;
        if (condition.minHp && player.hp < condition.minHp) return false;
        if (condition.maxHp && player.hp > condition.maxHp) return false;
        if (condition.minFocus && player.focus < condition.minFocus) return false;
        if (condition.challengeCompleted && !hasFlag(`challenge_${condition.challengeCompleted}_completed`)) return false;

        return true;
      },

      // Level completion
      completeLevel: () => {
        set({ isLevelComplete: true });
        get().lintSay('Невероятно. Ты действительно справился. Хотя, наверное, это был баг в матрице.', 'impressed');
        get().addLog('success', 'УРОВЕНЬ ПРОЙДЕН!');
      },

      // Reset
      resetGame: () => {
        set({
          player: { ...initialPlayer },
          currentLevel: null,
          currentLevelId: null,
          locations: new Map(),
          gameLog: [],
          terminalState: { ...initialTerminalState },
          isDead: false,
          isLevelComplete: false,
          lintMood: 'neutral',
          currentLintMessage: null,
        });
      },
    }),
    {
      name: 'space-rangers-quest-save',
      partialize: (state) => ({
        player: state.player,
        gameLog: state.gameLog,
        currentLevelId: state.currentLevelId,
      }),
    }
  )
);
