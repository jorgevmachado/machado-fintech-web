import type { ReactNode } from 'react';

import { Badge } from '@fintech/ui';

import { cn } from '@/src/shared/temp-class-name';

type PageSectionHeaderProps = {
  badge: ReactNode;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function PageSectionHeader({
  badge,
  title,
  subtitle,
  aside,
  className,
  contentClassName,
  titleClassName,
  subtitleClassName,
}: PageSectionHeaderProps) {
  return (
    <header className={cn(['space-y-2', className ?? ''])}>
      <Badge variant="solid" className="px-2.5 py-1 text-[13px] font-semibold">
        {badge}
      </Badge>

      <div
        className={cn([
          aside ? 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' : 'space-y-1',
          contentClassName ?? '',
        ])}
      >
        <div className="space-y-1 flex flex-col">
          <h2
            className={cn([
              'inline-block w-fit self-start text-2xl font-bold tracking-tight text-[color:var(--app-text,#0f172a)]',
              titleClassName ?? '',
            ])}
          >
            {title}
          </h2>

          {subtitle ? <p className={cn(['text-[color:var(--app-text-muted,#64748b)] text-sm', subtitleClassName ?? ''])}>{subtitle}</p> : null}
        </div>

        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </header>
  );
}
