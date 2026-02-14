import { useGameStore } from '../../stores/gameStore';
import type { LintMood } from '../../types';

const LINT_ASCII: Record<LintMood, string> = {
  neutral: `
    ┌─────────────┐
    │  L.I.N.T.   │
    │   [¬_¬]     │
    │  ╭─────╮    │
    │  │ CPU │    │
    │  ╰─────╯    │
    └─────────────┘
  `,
  annoyed: `
    ┌─────────────┐
    │  L.I.N.T.   │
    │   [>_<]     │
    │  ╭─────╮    │
    │  │ !!! │    │
    │  ╰─────╯    │
    └─────────────┘
  `,
  impressed: `
    ┌─────────────┐
    │  L.I.N.T.   │
    │   [o_o]     │
    │  ╭─────╮    │
    │  │ ... │    │
    │  ╰─────╯    │
    └─────────────┘
  `,
  angry: `
    ┌─────────────┐
    │  L.I.N.T.   │
    │   [X_X]     │
    │  ╭─────╮    │
    │  │ ERR │    │
    │  ╰─────╯    │
    └─────────────┘
  `,
  sarcastic: `
    ┌─────────────┐
    │  L.I.N.T.   │
    │   [-_-]     │
    │  ╭─────╮    │
    │  │ ... │    │
    │  ╰─────╯    │
    └─────────────┘
  `,
};

const MOOD_COLORS: Record<LintMood, string> = {
  neutral: 'text-cyber-cyan',
  annoyed: 'text-cyber-orange',
  impressed: 'text-cyber-green',
  angry: 'text-cyber-red',
  sarcastic: 'text-cyber-purple',
};

export function LintAvatar() {
  const { lintMood } = useGameStore();

  return (
    <div className="flex flex-col items-center">
      <pre className={`ascii-art ${MOOD_COLORS[lintMood]} text-center`}>
        {LINT_ASCII[lintMood]}
      </pre>
      <div className="mt-2 text-xs text-gray-500">
        Mood: <span className={MOOD_COLORS[lintMood]}>{lintMood}</span>
      </div>
    </div>
  );
}
