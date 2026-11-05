export const OFontFamily = [
    'sans',
    'serif',
    'mono'
] as const;

export type TFontFamily = (typeof OFontFamily)[number];

export const FONT_FAMILY_CLASS_MAP: Record<TFontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};