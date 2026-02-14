import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

const FATAL_ASCII = `
███████╗ █████╗ ████████╗ █████╗ ██╗
██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║
█████╗  ███████║   ██║   ███████║██║
██╔══╝  ██╔══██║   ██║   ██╔══██║██║
██║     ██║  ██║   ██║   ██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

        ███████╗██████╗ ██████╗  ██████╗ ██████╗
        ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
        █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
        ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
        ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
        ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`;

export function DeathScreen() {
  const { isDead, respawn, gameLog } = useGameStore();
  const [showRevert, setShowRevert] = useState(false);
  const [revertProgress, setRevertProgress] = useState(0);

  // Find last death-related log entry
  const lastLintMessage = gameLog
    .filter(log => log.type === 'lint')
    .pop()?.message || 'System failure detected.';

  useEffect(() => {
    if (isDead) {
      const timer = setTimeout(() => setShowRevert(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isDead]);

  useEffect(() => {
    if (showRevert && revertProgress < 100) {
      const timer = setTimeout(() => {
        setRevertProgress(prev => Math.min(100, prev + 10));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showRevert, revertProgress]);

  if (!isDead) return null;

  return (
    <div className="fixed inset-0 bg-space-900/95 z-50 flex items-center justify-center">
      <div className="text-center space-y-8 p-8 max-w-2xl">
        {/* ASCII Art */}
        <pre className="ascii-art text-cyber-red glow-red text-xs animate-pulse">
          {FATAL_ASCII}
        </pre>

        {/* Error message */}
        <div className="space-y-2">
          <p className="text-cyber-red text-lg">
            Process terminated unexpectedly
          </p>
          <p className="text-gray-400 text-sm">
            Exit code: 0xDEAD
          </p>
        </div>

        {/* L.I.N.T. comment */}
        <div className="bg-space-700 border-l-4 border-cyber-orange p-4 rounded-r-lg text-left">
          <div className="text-xs text-gray-500 mb-1">L.I.N.T.</div>
          <p className="text-cyber-orange">
            {lastLintMessage}
          </p>
        </div>

        {/* Git revert animation */}
        {showRevert && (
          <div className="space-y-4">
            <div className="text-cyber-green text-sm font-mono">
              $ git revert HEAD --no-edit
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-cyber-green transition-all duration-100"
                style={{ width: `${revertProgress}%` }}
              />
            </div>

            <p className="text-gray-400 text-sm">
              {revertProgress < 100
                ? 'Откатываем к последнему стабильному состоянию...'
                : 'Готово!'}
            </p>

            {/* Respawn button */}
            {revertProgress >= 100 && (
              <button
                onClick={() => {
                  setShowRevert(false);
                  setRevertProgress(0);
                  respawn();
                }}
                className="mt-4 px-8 py-3 bg-cyber-green/20 text-cyber-green border border-cyber-green
                           hover:bg-cyber-green/30 rounded-lg transition-all text-lg font-bold
                           hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
              >
                [ENTER] Продолжить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
