import { useGameStore } from '../../stores/gameStore';

export function PlayerStats() {
  const { player } = useGameStore();

  const hpPercentage = (player.hp / player.maxHp) * 100;
  const focusPercentage = (player.focus / player.maxFocus) * 100;

  const getHpColor = () => {
    if (hpPercentage > 60) return 'bg-cyber-green';
    if (hpPercentage > 30) return 'bg-cyber-orange';
    return 'bg-cyber-red';
  };

  return (
    <div className="space-y-4 p-3 bg-space-700 rounded-lg border border-gray-700">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        System Status
      </h3>

      {/* HP Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">HP</span>
          <span className={hpPercentage > 30 ? 'text-gray-300' : 'text-cyber-red'}>
            {player.hp}/{player.maxHp}
          </span>
        </div>
        <div className="stat-bar">
          <div
            className={`stat-bar-fill ${getHpColor()}`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Focus Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Focus</span>
          <span className="text-gray-300">{player.focus}/{player.maxFocus}</span>
        </div>
        <div className="stat-bar">
          <div
            className="stat-bar-fill bg-cyber-purple"
            style={{ width: `${focusPercentage}%` }}
          />
        </div>
      </div>

      {/* Inventory */}
      {player.inventory.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <h4 className="text-xs font-bold text-gray-400 uppercase">Inventory</h4>
          <ul className="space-y-1">
            {player.inventory.map(item => (
              <li
                key={item.id}
                className="text-xs text-gray-300 flex items-center gap-2"
              >
                <span className="text-cyber-cyan">◆</span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
