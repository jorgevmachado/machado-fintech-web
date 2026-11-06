export const oBadgeVariant = [
  'solid',
  'soft',
  'outline',
] as const;

export type TBadgeVariant = (typeof oBadgeVariant)[number];