import type { TReducedSize ,TTone } from '../base';
import { BADGE_TONE_CLASS_MAP ,getBadgeRandomTone } from './tone';
import { BADGE_SHAPE_CLASS_MAP ,TBadgeShape } from './shape';
import type { TBadgeVariant } from './variant';
import { BADGE_SIZE_CLASS_MAP } from './size';

type BadgeThemeParams = {
  size?: TReducedSize;
  tone?: TTone;
  shape?: TBadgeShape;
  random?: boolean;
  variant?: TBadgeVariant;
  className?: string;
}

export const buildBadgeTheme = ({
  size = 'md' ,
  tone = 'primary' ,
  shape = 'pill' ,
  random = false ,
  variant = 'soft' ,
  className,
}: BadgeThemeParams) => {
  const resolvedTone = random ? getBadgeRandomTone() : tone;
  return [
    'inline-flex items-center justify-center gap-1 font-semibold leading-none' ,
    BADGE_SIZE_CLASS_MAP[size] ,
    BADGE_SHAPE_CLASS_MAP[shape] ,
    BADGE_TONE_CLASS_MAP[variant][resolvedTone] ,
    className
  ].filter(Boolean).join(' ');
}