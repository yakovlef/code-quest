import { useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { VisualPanel } from './components/VisualPanel/VisualPanel';
import { QuestPanel } from './components/QuestPanel/QuestPanel';
import { DeathScreen } from './components/DeathScreen/DeathScreen';
import { useGameStore } from './stores/gameStore';
import { level1 } from './data/levels/level-1-hello-world';

function LevelCompleteScreen() {
  const { resetGame } = useGameStore();

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
            Ты восстановил систему питания корабля "Синтаксис-7".
          </p>
          <p className="text-gray-400 text-sm">
            Level 1: Hello World — пройден
          </p>
        </div>

        <div className="bg-space-700 border-l-4 border-cyber-cyan p-4 rounded-r-lg text-left">
          <div className="text-xs text-gray-500 mb-1">L.I.N.T.</div>
          <p className="text-cyber-cyan">
            Невероятно. Ты действительно справился. Хотя, наверное, это был баг в матрице.
            Ладно, признаю — неплохо для белкового организма. До встречи на следующем уровне.
          </p>
        </div>

        <div className="text-gray-500 text-sm">
          <p>Изучено:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ Переменные и присваивание</li>
            <li>✓ Строковые значения и кавычки</li>
            <li>✓ Строгое сравнение (===)</li>
            <li>✓ Конкатенация строк</li>
            <li>✓ Функции и return</li>
          </ul>
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-3 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan
                     hover:bg-cyber-cyan/30 rounded-lg transition-all text-lg font-bold
                     hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        >
          Начать заново
        </button>
      </div>
    </div>
  );
}

function App() {
  const { initGame, currentLevel, hasFlag } = useGameStore();

  useEffect(() => {
    // Initialize game with Level 1
    if (!currentLevel) {
      initGame(level1);
    }
  }, [currentLevel, initGame]);

  const isLevelComplete = hasFlag('power_restored');

  return (
    <>
      <Layout
        leftPanel={<VisualPanel />}
        rightPanel={<QuestPanel />}
      />
      <DeathScreen />
      {isLevelComplete && <LevelCompleteScreen />}
    </>
  );
}

export default App;
