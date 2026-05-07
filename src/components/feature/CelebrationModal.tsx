import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './CelebrationModal.module.css';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.backdrop}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className={styles.dialog}
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.7 }}
          className={styles.trophyWrap}
        >
          <Trophy className={styles.trophy} />
        </motion.div>
        <h2 className={styles.title}>{t('celebration.title')}</h2>
        <p className={styles.message}>{t('celebration.message')}</p>
      </motion.div>
    </motion.div>
  );
}
