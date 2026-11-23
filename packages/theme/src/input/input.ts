import { type TInputSize, INPUT_SIZE_CLASS_MAP } from './size';
import { type TInputVariant, INPUT_FOCUS_RING_CLASS_MAP, INPUT_VARIANT_CLASS_MAP } from './variant';

type BuildInputThemeParams = {
  size: TInputSize;
  variant: TInputVariant;
  disabled: boolean;
  isInvalid: boolean;
  fullWidth: boolean;
  className?: string;
}

export const buildInputTheme = ({
  size,
  variant,
  isInvalid,
  disabled,
  fullWidth,
  className,
}: BuildInputThemeParams) => {
  const classNames: Array<string> = [
    'flex items-center gap-2 rounded-xl px-3 transition'
  ];

  classNames.push(INPUT_SIZE_CLASS_MAP[size]);
  classNames.push(INPUT_VARIANT_CLASS_MAP[variant]);
  // Um ponto só decide o halo: válido → acento, inválido → negativo.
  classNames.push(isInvalid ? INPUT_FOCUS_RING_CLASS_MAP.invalid : INPUT_FOCUS_RING_CLASS_MAP.valid);

  if(disabled) {
    classNames.push('cursor-not-allowed bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-muted,#64748b)] opacity-70');
  }

  if(fullWidth) {
    classNames.push('w-full');
  }

  if(className) {
    classNames.push(className);
  }

  return classNames;
}