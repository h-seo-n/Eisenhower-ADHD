interface IconButtonProps {
  onClick: () => void;
  className: string;
  icon: React.ReactNode;
}

function IconButton({ onClick, className, icon }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${className}`}
    >
      {icon}
    </button>
  );
}

export default IconButton;