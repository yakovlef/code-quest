interface ActionButtonProps {
  index: number;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success';
}

export function ActionButton({
  index,
  text,
  onClick,
  disabled = false,
  variant = 'default',
}: ActionButtonProps) {
  const variantStyles = {
    default: 'hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]',
    danger: 'border-cyber-red/50 hover:border-cyber-red hover:shadow-[0_0_15px_rgba(255,51,102,0.3)] text-cyber-red',
    success: 'border-cyber-green/50 hover:border-cyber-green hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-cyber-green',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        action-btn flex items-start gap-3
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span className="text-cyber-cyan font-bold shrink-0">[{index}]</span>
      <span className="text-left">{text}</span>
    </button>
  );
}
