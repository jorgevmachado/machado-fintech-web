import type { TReducedSize } from '../base';

export const LOADING_CIRCLE_SIZE_CLASS_MAP: Record<TReducedSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-4',
}

export const LOADING_DOTS_SIZE_CLASS_MAP: Record<TReducedSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-3',
}

export const LOADING_BAR_SIZE_CLASS_MAP: Record<TReducedSize, string> = {
  sm: 'h-0.5',
  md: 'h-1',
  lg: 'h-2',
}