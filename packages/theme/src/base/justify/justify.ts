export const OJustify = ['start', 'end', 'center', 'between', 'around', 'evenly'] as const;

export const OAlignJustify = ['left', 'right', 'center'] as const;

export type TJustify = (typeof OJustify)[number];

export type TAlignJustify = (typeof OAlignJustify)[number];

export const JUSTIFY_CLASS_MAP: Record<TJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const ALIGN_JUSTIFY_CLASS_MAP: Record<TAlignJustify, string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
};