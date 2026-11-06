'use client';

import { Icon } from '@fintech/ui';

import { pickSmartIconColor } from '@/src/shared/temp-colors';

type ColorIconProps = {
  icon?: string;
  color?: string;
  label: string;
}

const FALLBACK_COLOR = '#6366f1';

export default function ColorIcon({ icon, color, label }: ColorIconProps) {
  const backgroundColor = color || FALLBACK_COLOR;

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor }}>
      {icon ? (
        <Icon icon={icon} className="size-4" style={{ backgroundColor }} />
      ) : (
        <span className="text-xs font-bold" style={{ color: pickSmartIconColor(backgroundColor) }}>
          {label[0]?.toUpperCase()}
        </span>
      )}
    </div>
  )
}