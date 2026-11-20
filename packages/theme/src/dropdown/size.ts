export const ODropdownSize = ['sm', 'md', 'lg'] as const;

export type TDropdownSize = typeof ODropdownSize[number];

type TDropdownSizeRecord = {
  trigger: string;
  item: string;
  icon: string;
};

export const DROPDOWN_SIZE_CLASS_MAP: Record<TDropdownSize, TDropdownSizeRecord> = {
  sm: {
    trigger: 'h-9 px-3 text-sm',
    item: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
  },
  md: {
    trigger: 'h-10 px-4 text-sm',
    item: 'px-4 py-2 text-sm',
    icon: 'h-5 w-5',
  },
  lg: {
    trigger: 'h-11 px-5 text-base',
    item: 'px-5 py-2.5 text-base',
    icon: 'h-6 w-6',
  },
};