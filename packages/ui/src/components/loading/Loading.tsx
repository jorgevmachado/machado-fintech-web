import type { LoadingProps } from './types';
import {
  LoadingBar ,
  LoadingCircle ,
  LoadingDot,
} from './variants';

const loadingVariants = {
  bar: LoadingBar,
  circle: LoadingCircle,
  dot: LoadingDot,
} as const;

export default function Loading({
  size = 'md',
  tone = 'primary',
  variant = 'circle',
  complete = false,
  progress = false,
}: LoadingProps) {
  const LoadingComponent = loadingVariants[variant];
  return <LoadingComponent size={size} tone={tone} {...(variant === 'bar' ? { complete, progress } : {})} />
}