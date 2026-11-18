import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/src/shared/temp-class-name';

/** Same visual language as the soft primary badge: blue on the current surface. */
const FILTER_PILL_ACTIVE_CLASS =
  'border-[color:var(--app-accent-border,#3b82f6)] bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)]';
const FILTER_PILL_INACTIVE_CLASS =
  'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-subtle,#475569)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] hover:text-[color:var(--app-text,#0f172a)]';

export type FilterPillProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'aria-pressed'> & {
  /** Selected state, announced through `aria-pressed`. */
  active?: boolean;
  /** Optional counter shown on the right. */
  count?: number;
};

/** Rounded selectable pill for filter groups. Presentation only. */
export default function FilterPill({ active = false, count, className, children, ...props }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn([
        'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:pointer-events-none disabled:opacity-50',
        active ? FILTER_PILL_ACTIVE_CLASS : FILTER_PILL_INACTIVE_CLASS,
        className ?? '',
        ])}
      {...props}
    >
      {children}
      {typeof count === 'number' ? (
        <span
          className={cn([
            'min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums',
            active
              ? 'bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)]'
              : 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-muted,#64748b)]',
          ])}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}