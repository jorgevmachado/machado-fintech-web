export const OButtonSize = ['sm', 'md', 'lg'] as const;

export type TButtonSize = typeof OButtonSize[number];

type TSizeRecord = {
  default: string;
  iconOnly: string;
}

export const BUTTON_SIZE_CLASS_MAP : Record<TButtonSize, TSizeRecord> = {
  sm: {
    default: 'h-9 px-3 text-sm',
    iconOnly: 'h-9 w-9',
  },
  md: {
    default: 'h-10 px-4 text-sm',
    iconOnly: 'h-10 w-10',
  },
  lg: {
    default: 'h-11 px-5 text-base',
    iconOnly: 'h-11 w-11',
  }
};