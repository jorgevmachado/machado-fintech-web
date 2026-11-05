import {
  LOADING_DOT_CLASS_MAP ,
  LOADING_DOTS_SIZE_CLASS_MAP ,
  TEXT_TONE_CLASS_MAP ,
} from '@fintech/theme';

import type { LoadingVariantProps } from '../../types';

export default function LoadingDot({
  size = 'md' ,
  tone = 'primary' ,
}: LoadingVariantProps) {
  const sizeClass = LOADING_DOTS_SIZE_CLASS_MAP[size];
  const toneClass = TEXT_TONE_CLASS_MAP[tone];

  return (
    <span
      aria-label="Carregando"
      className="inline-flex items-center gap-1"
      role="status"
    >
      <span
        className={ `${ sizeClass } ${ toneClass } ${ LOADING_DOT_CLASS_MAP }` }/>

      <span
        className={ `${ sizeClass } ${ toneClass } ${ LOADING_DOT_CLASS_MAP } [animation-delay:150ms]` }
      />

      <span
        className={ `${ sizeClass } ${ toneClass } ${ LOADING_DOT_CLASS_MAP } [animation-delay:300ms]` }
      />
    </span>
  );
}