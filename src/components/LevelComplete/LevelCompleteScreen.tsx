import { useGameStore } from '../../stores/gameStore';

interface LevelCompleteScreenProps {
  onBackToMenu: () => void;
  onNextLevel?: () => void;
}

export function LevelCompleteScreen({ onBackToMenu, onNextLevel }: LevelCompleteScreenProps) {
  const currentLevel = useGameStore(state => state.currentLevel);

  return (
    <div className="fixed inset-0 bg-space-900/95 z-50 flex items-center justify-center">
      <div className="text-center space-y-8 p-8 max-w-2xl">
        <pre className="ascii-art text-cyber-green glow-green text-xs">
{`
██╗     ███████╗██╗   ██╗███████╗██╗
██║     ██╔════╝██║   ██║██╔════╝██║
██║     █████╗  ██║   ██║█████╗  ██║
██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║
███████╗███████╗ ╚████╔╝ ███████╗███████╗
╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝

 ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ███████╗████████╗███████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██╔════╝╚══██╔══╝██╔════╝
██║     ██║   ██║██╔████╔██║██████╔╝██║     █████╗     ██║   █████╗
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝     ██║   ██╔══╝
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗███████╗   ██║   ███████╗
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝   ╚═╝   ╚══════╝
`}
        </pre>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyber-green">
            Поздравляем!
          </h2>
          <p className="text-gray-300">
            {currentLevel?.completionMessage ?? 'Уровень пройден!'}
          </p>
          <p className="text-gray-400 text-sm">
            {currentLevel?.name ?? 'Unknown Level'} — пройден
          </p>
        </div>

        <div className="bg-space-700 border-l-4 border-cyber-cyan p-4 rounded-r-lg text-left">
          <div className="text-xs text-gray-500 mb-1">L.I.N.T.</div>
          <p className="text-cyber-cyan">
            Невероятно. Ты действительно справился. Хотя, наверное, это был баг в матрице.
            Ладно, признаю — неплохо для белкового организма. До встречи на следующем уровне.
          </p>
        </div>

        {currentLevel?.completionSummary && currentLevel.completionSummary.length > 0 && (
          <div className="text-gray-500 text-sm">
            <p>Изучено:</p>
            <ul className="mt-2 space-y-1">
              {currentLevel.completionSummary.map((item, i) => (
                <li key={i}>✓ {item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {onNextLevel && (
            <button
              onClick={onNextLevel}
              className="px-8 py-3 bg-cyber-green/20 text-cyber-green border border-cyber-green
                         hover:bg-cyber-green/30 rounded-lg transition-all text-lg font-bold
                         hover:shadow-[0_0_20px_rgba(0,255,100,0.4)]"
            >
              Следующий уровень
            </button>
          )}
          <button
            onClick={onBackToMenu}
            className="px-8 py-3 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan
                       hover:bg-cyber-cyan/30 rounded-lg transition-all text-lg font-bold
                       hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
          >
            К списку уровней
          </button>
        </div>
      </div>
    </div>
  );
}
