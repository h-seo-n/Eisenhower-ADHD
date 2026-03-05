import { useTranslation } from 'react-i18next';
import type { DeadlineType } from '@/types/task';

export function useDeadlineLabels(): Record<DeadlineType, string> {
  const { t } = useTranslation();
  return {
    Today: t('deadline.today'),
    Tomorrow: t('deadline.tomorrow'),
    'Specific Date': t('deadline.specificDate'),
    'No Deadline': t('deadline.noDeadline'),
  };
}
