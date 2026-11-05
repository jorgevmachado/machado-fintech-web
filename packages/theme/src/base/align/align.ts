export const OAlign = ['left', 'center', 'right', 'justify', 'start', 'end'] as const;

export const OBasicAlign = ['left', 'center', 'right'] as const;

export type TAlign = (typeof OAlign)[number];

export type TBasicAlign = (typeof OBasicAlign)[number];

export const TEXT_ALIGN_CLASS_MAP: Record<TAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  start: 'text-start',
  end: 'text-end',
};

export const TEXT_ALIGN_BASIC_CLASS_MAP: Record<TBasicAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};