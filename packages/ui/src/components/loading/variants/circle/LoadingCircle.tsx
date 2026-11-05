import { TEXT_TONE_CLASS_MAP, LOADING_CIRCLE_SIZE_CLASS_MAP } from '@fintech/theme';

import type { LoadingVariantProps } from '../../types';

export default function LoadingCircle({
  size = 'md',
  tone = 'primary',
}: LoadingVariantProps) {
  return (
    <span
      aria-label="Carregando"
      className={`
        inline-block
        rounded-full
        border-current
        border-t-transparent
        animate-spin
        ${LOADING_CIRCLE_SIZE_CLASS_MAP[size]}
         ${TEXT_TONE_CLASS_MAP[tone]}
      `}
      role="status"
    />
  );
};