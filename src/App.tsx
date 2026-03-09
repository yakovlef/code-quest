import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout/Layout';
import { VisualPanel } from './components/VisualPanel/VisualPanel';
import { QuestPanel } from './components/QuestPanel/QuestPanel';
import { DeathScreen } from './components/DeathScreen/DeathScreen';
import { LevelSelector } from './components/LevelSelector/LevelSelector';
import { LevelCompleteScreen } from './components/LevelComplete/LevelCompleteScreen';
import { useGameStore } from './stores/gameStore';
import { loadCommunityLevelsFromStorage } from './engine/levelLoader';
import { levelRegistry } from './engine/levelRegistry';
import type { AppScreen } from './types';

function App() {
  const {
    currentLevel,
    currentLevelId,
    startLevel,
    checkLevelCompletion,
  } = useGameStore();

  const [screen, setScreen] = useState<AppScreen>(() => {
    return currentLevelId && currentLevel ? 'game' : 'menu';
  });

  // Load community levels from localStorage on mount
  useEffect(() => {
    loadCommunityLevelsFromStorage();
  }, []);

  // Restore saved game if level exists in registry
  useEffect(() => {
    if (currentLevelId && !currentLevel && levelRegistry.has(currentLevelId)) {
      startLevel(currentLevelId);
      setScreen('game');
    }
  }, [currentLevelId, currentLevel, startLevel]);

  // Check level completion reactively
  const player = useGameStore(state => state.player);
  useEffect(() => {
    if (screen === 'game' && currentLevel && checkLevelCompletion()) {
      setScreen('levelComplete');
    }
  }, [screen, currentLevel, checkLevelCompletion, player.flags]);

  const handleSelectLevel = useCallback((levelId: string) => {
    startLevel(levelId);
    setScreen('game');
  }, [startLevel]);

  const handleBackToMenu = useCallback(() => {
    useGameStore.getState().resetGame();
    setScreen('menu');
  }, []);

  const handleContinue = useCallback(() => {
    setScreen('game');
  }, []);

  const handleNextLevel = currentLevel?.nextLevelId
    ? () => handleSelectLevel(currentLevel.nextLevelId!)
    : undefined;

  switch (screen) {
    case 'menu':
      return (
        <LevelSelector
          onSelectLevel={handleSelectLevel}
          onContinue={currentLevelId && currentLevel ? handleContinue : undefined}
        />
      );
    case 'game':
      return (
        <>
          <Layout
            leftPanel={<VisualPanel />}
            rightPanel={<QuestPanel />}
          />
          <DeathScreen />
        </>
      );
    case 'levelComplete':
      return (
        <LevelCompleteScreen
          onBackToMenu={handleBackToMenu}
          onNextLevel={handleNextLevel}
        />
      );
  }
}

export default App;
