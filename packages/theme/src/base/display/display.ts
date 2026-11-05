export const ODisplay = ['block', 'inline', 'inlineBlock'] as const;
export type TDisplay = (typeof ODisplay[number]);

export const DISPLAY_CLASS_MAP: Record<TDisplay, string> = {
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
};