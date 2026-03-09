import { useGameStore } from '../../stores/gameStore';
import { LintAvatar } from './LintAvatar';
import { PlayerStats } from './PlayerStats';

export function VisualPanel() {
  const { getCurrentLocation, checkCondition } = useGameStore();
  const location = getCurrentLocation();

  // Resolve dynamic ASCII art (last matching override wins)
  let resolvedAsciiArt = location?.asciiArt;
  if (location?.asciiArtUpdates) {
    for (const update of location.asciiArtUpdates) {
      if (checkCondition(update.condition)) {
        resolvedAsciiArt = update.asciiArt;
      }
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ASCII Art for location */}
      <div className="flex-1 flex items-center justify-center bg-space-700 rounded-lg border border-gray-700 p-4 overflow-hidden">
        {resolvedAsciiArt ? (
          <pre className="ascii-art text-center whitespace-pre text-xs leading-tight">
            {resolvedAsciiArt}
          </pre>
        ) : (
          <div className="text-gray-600 text-center">
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-xs">{location?.name || 'Loading...'}</div>
          </div>
        )}
      </div>

      {/* L.I.N.T. Avatar */}
      <div className="bg-space-700 rounded-lg border border-gray-700 p-4">
        <LintAvatar />
      </div>

      {/* Player Stats */}
      <PlayerStats />
    </div>
  );
}
