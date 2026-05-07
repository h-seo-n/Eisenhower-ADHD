import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './FloatingButton.module.css';

interface FloatingButtonProps {
    onClick: () => void;
    className?: string;
}

export default function FloatingButton({ onClick, className }: FloatingButtonProps) {
    const { t } = useTranslation();
    return (
        <button
            onClick={onClick}
            className={`${styles.button} ${className ?? ''}`}
            aria-label={t('common.addNewTask')}
            type='button'
        >
            <Plus className={styles.icon} />
        </button>
    )
}
