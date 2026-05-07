import styles from './IconButton.module.css';

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
      className={`${styles.button} ${className}`}
    >
      {icon}
    </button>
  );
}

export default IconButton;
