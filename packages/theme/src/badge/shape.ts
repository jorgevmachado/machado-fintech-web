export const OBadgeShape = ['rounded', 'pill'] as const;

export type TBadgeShape = (typeof OBadgeShape)[number];

export const BADGE_SHAPE_CLASS_MAP: Record<TBadgeShape ,string> = {
  rounded: 'rounded-md' ,
  pill: 'rounded-full' ,
};