import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export function Terminal() {
  const {
    terminalState,
    executeCode,
    closeTerminal,
  } = useGameStore();

  const [localInput, setLocalInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalState.output]);

  const handleSubmit = () => {
    if (!localInput.trim()) return;

    executeCode(localInput.trim());
    setLocalInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }

    if (e.key === 'Escape') {
      closeTerminal();
    }
  };

  const getOutputClass = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-cyber-red';
      case 'success':
        return 'text-cyber-green';
      case 'input':
        return 'text-cyber-cyan';
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div className="terminal p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-cyber-green">●</span>
          <span className="text-sm font-bold text-gray-400">
            SHIP TERMINAL v2.1.0
          </span>
        </div>
        <button
          onClick={closeTerminal}
          className="text-gray-500 hover:text-cyber-red text-xs"
        >
          [ESC] Закрыть
        </button>
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className="h-48 overflow-y-auto font-mono text-sm space-y-1 bg-space-900 p-3 rounded"
      >
        {terminalState.output.map((line, i) => (
          <div key={i} className={getOutputClass(line.type)}>
            <pre className="whitespace-pre-wrap">{line.content}</pre>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-start gap-2 bg-space-900 p-3 rounded">
        <span className="text-cyber-cyan font-bold">&gt;</span>
        <textarea
          ref={inputRef}
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введи код здесь..."
          className="terminal-input flex-1 resize-none h-20 bg-transparent"
          spellCheck={false}
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={closeTerminal}
          className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          disabled={!localInput.trim()}
          className="px-4 py-2 text-sm bg-cyber-green/20 text-cyber-green border border-cyber-green/50
                     hover:bg-cyber-green/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Выполнить [Enter]
        </button>
      </div>
    </div>
  );
}
