export const OTableAlign = ['left', 'center', 'right'] as const;

export type TTableAlign = (typeof OTableAlign)[number];

export const TABLE_TEXT_ALIGN_CLASS_MAP: Record<TTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const TABLE_CONTENT_ALIGN_CLASS_MAP: Record<TTableAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};
