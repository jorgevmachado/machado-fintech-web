export const OLineClamp = [1, 2, 3, 4, 5, 6, 'none'] as const;

export type TLineClamp = (typeof OLineClamp[number]);

export const LINE_CLAMP_CLASS_MAP: Record<TLineClamp, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
  none: 'line-clamp-none',
};