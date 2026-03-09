import { ReactNode } from 'react';
import { useGameStore } from '../../stores/gameStore';

interface LayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function Layout({ leftPanel, rightPanel }: LayoutProps) {
  const currentLevel = useGameStore(state => state.currentLevel);

  return (
    <div className="min-h-screen bg-space-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-space-800 px-6 py-3">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="text-cyber-cyan glow-cyan">SPACE</span>
          <span className="text-gray-400 mx-2">//</span>
          <span className="text-cyber-green glow-green">RANGERS</span>
          <span className="text-gray-400 mx-2">//</span>
          <span className="text-cyber-orange">QUEST</span>
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex">
        {/* Left Panel - Visual */}
        <div className="w-1/3 border-r border-gray-800 bg-space-800 p-4 flex flex-col">
          {leftPanel}
        </div>

        {/* Right Panel - Quest */}
        <div className="w-2/3 bg-space-900 p-4 flex flex-col overflow-y-auto">
          {rightPanel}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-space-800 px-6 py-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>v0.1.0 // Phase 0</span>
          <span>{currentLevel?.name ?? 'No level loaded'}</span>
        </div>
      </footer>
    </div>
  );
}
