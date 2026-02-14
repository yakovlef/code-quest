import { useGameStore } from '../../stores/gameStore';
import { LintDialogue } from '../LintDialogue/LintDialogue';
import { Terminal } from '../Terminal/Terminal';
import { ActionButton } from './ActionButton';

export function QuestPanel() {
  const {
    getCurrentLocation,
    moveToLocation,
    checkCondition,
    applyEffects,
    openTerminal,
    terminalState,
    modifyHp,
    die,
    lintSay,
    hasFlag,
  } = useGameStore();

  const location = getCurrentLocation();

  if (!location) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading location...
      </div>
    );
  }

  const handleExit = (exit: typeof location.exits[0]) => {
    if (exit.requires && !checkCondition(exit.requires)) {
      lintSay(exit.lockedMessage || 'Путь заблокирован.', 'annoyed');
      return;
    }
    moveToLocation(exit.targetLocation);
  };

  const handleObjectAction = (action: NonNullable<typeof location.objects>[0]['actions'][0]) => {
    if (action.requires && !checkCondition(action.requires)) {
      lintSay(action.failMessage || 'Не можешь это сделать.', 'annoyed');
      return;
    }

    if (action.lintComment) {
      lintSay(action.lintComment, 'sarcastic');
    }

    if (action.successMessage) {
      lintSay(action.successMessage, 'neutral');
    }

    applyEffects(action.effects);
  };

  const handleDangerAction = (danger: NonNullable<typeof location.dangerAction>) => {
    modifyHp(-danger.damage);
    if (danger.damage >= 100) {
      die(danger.deathMessage, danger.lintDeathComment);
    }
  };

  const handleOpenTerminal = () => {
    if (location.challenge && !location.challenge.isCompleted) {
      openTerminal(location.challenge);
    }
  };

  const isChallengeCompleted = location.challenge?.id
    ? hasFlag(`challenge_${location.challenge.id}_completed`)
    : false;

  // Build action list
  let actionIndex = 1;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Location Header */}
      <div className="border-b border-gray-700 pb-3">
        <h2 className="text-xl font-bold text-cyber-cyan">{location.name}</h2>
      </div>

      {/* Description */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {location.description}
        </p>

        {/* L.I.N.T. Dialogue */}
        <LintDialogue />

        {/* Terminal (if active) */}
        {terminalState.isActive && (
          <div className="mt-4">
            <Terminal />
          </div>
        )}
      </div>

      {/* Actions */}
      {!terminalState.isActive && (
        <div className="space-y-2 border-t border-gray-700 pt-4">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Доступные действия
          </h3>

          {/* Interactive Objects */}
          {location.objects?.map(obj => (
            obj.actions
              .filter(action => !action.requires || checkCondition(action.requires))
              .map(action => (
                <ActionButton
                  key={`${obj.id}-${action.id}`}
                  index={actionIndex++}
                  text={action.text}
                  onClick={() => handleObjectAction(action)}
                />
              ))
          ))}

          {/* Challenge / Terminal */}
          {location.challenge && !isChallengeCompleted && (
            <ActionButton
              index={actionIndex++}
              text="Открыть терминал"
              onClick={handleOpenTerminal}
              variant="success"
            />
          )}

          {isChallengeCompleted && location.challenge && (
            <div className="text-cyber-green text-sm p-2 border border-cyber-green/30 rounded-lg">
              ✓ Задача выполнена
            </div>
          )}

          {/* Danger Action */}
          {location.dangerAction && (
            <ActionButton
              index={actionIndex++}
              text={location.dangerAction.text}
              onClick={() => handleDangerAction(location.dangerAction!)}
              variant="danger"
            />
          )}

          {/* Exits */}
          {location.exits.map(exit => {
            const isLocked = exit.requires && !checkCondition(exit.requires);
            return (
              <ActionButton
                key={exit.targetLocation}
                index={actionIndex++}
                text={`${exit.description}${isLocked ? ' [ЗАБЛОКИРОВАНО]' : ''}`}
                onClick={() => handleExit(exit)}
                disabled={isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
