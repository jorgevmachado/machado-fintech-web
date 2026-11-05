import {
  LOADING_BAR_SIZE_CLASS_MAP ,
  TEXT_TONE_CLASS_MAP ,
} from '@fintech/theme';

import type { LoadingVariantProps } from '../../types';

type LoadingBarProps = LoadingVariantProps & {
  progress?: boolean;
  complete?: boolean;
};

export default function LoadingBar({
  size = 'md' ,
  tone = 'primary' ,
  complete = false ,
  progress = false ,
}: LoadingBarProps) {
  const sizeClass = LOADING_BAR_SIZE_CLASS_MAP[size];
  const toneClass = TEXT_TONE_CLASS_MAP[tone];

  const animationClass = complete
    ? ''
    : progress
      ? 'animate-loading-progress'
      : 'animate-loading-bar';

  const completeClass = complete
    ? 'w-full transition-[width] duration-500 ease-out'
    : '';

  return (
    <span
      aria-label="Carregando"
      className={ `
        relative
        block
        w-full
        overflow-hidden
        ${ sizeClass }
      ` }
      role="status"
    >
      <span
        className={`
            absolute
            inset-y-0
            left-0
            ${ toneClass }
            bg-current
            ${ animationClass }
            ${ completeClass }
       `}
      />
    </span>
  );
}