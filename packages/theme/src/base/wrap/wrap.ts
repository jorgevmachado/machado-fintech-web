export const OWrap = ['wrap', 'nowrap', 'balance', 'pretty'] as const;
export type TWrap = (typeof OWrap[number]);

export const WRAP_CLASS_MAP: Record<TWrap, string> = {
  wrap: 'text-wrap',
  nowrap: 'text-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
};