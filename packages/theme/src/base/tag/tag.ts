export const OTag = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'em',
  'div',
  'span',
  'code',
  'mark',
  'small',
  'label',
  'strong',
  'legend',
  'blockquote',
  'figcaption',
] as const;

export type TTag = (typeof OTag[number]);