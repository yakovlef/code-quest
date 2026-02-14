import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LINT_AVATARS } from '../../types';

interface LintDialogueProps {
  typingSpeed?: number;
}

export function LintDialogue({ typingSpeed = 30 }: LintDialogueProps) {
  const { currentLintMessage, lintMood } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const previousMessage = useRef<string | null>(null);

  useEffect(() => {
    if (!currentLintMessage || currentLintMessage === previousMessage.current) {
      return;
    }

    previousMessage.current = currentLintMessage;
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < currentLintMessage.length) {
        setDisplayedText(currentLintMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentLintMessage, typingSpeed]);

  if (!currentLintMessage) {
    return null;
  }

  const moodColors: Record<string, string> = {
    neutral: 'border-cyber-cyan text-cyber-cyan',
    annoyed: 'border-cyber-orange text-cyber-orange',
    impressed: 'border-cyber-green text-cyber-green',
    angry: 'border-cyber-red text-cyber-red',
    sarcastic: 'border-cyber-purple text-cyber-purple',
  };

  return (
    <div className={`bg-space-700 border-l-4 ${moodColors[lintMood]} p-4 rounded-r-lg`}>
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold shrink-0">
          {LINT_AVATARS[lintMood]}
        </span>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">L.I.N.T.</div>
          <p className="text-gray-200">
            {displayedText}
            {isTyping && <span className="cursor" />}
          </p>
        </div>
      </div>
    </div>
  );
}
