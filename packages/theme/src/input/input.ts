import { type TInputSize, INPUT_SIZE_CLASS_MAP } from './size';
import { type TInputVariant, INPUT_VARIANT_CLASS_MAP } from './variant';

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

  if(isInvalid) {
    classNames.push('border-red-400 focus-within:border-red-400 focus-within:ring-red-100');
  }

  if(disabled) {
    classNames.push('cursor-not-allowed bg-slate-100 text-slate-400 opacity-70');
  }

  if(fullWidth) {
    classNames.push('w-full');
  }

  if(className) {
    classNames.push(className);
  }

  return classNames;
}