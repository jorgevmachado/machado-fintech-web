import type { ReactNode } from 'react';

import { cn } from '@/src/shared/temp-class-name';

type FormSectionProps = {
  title: string;
  description?: string;
  /** The last section of a form drops the divider that separates it from the next one. */
  showDivider?: boolean;
  className?: string;
  children: ReactNode;
};

/** Titled block of a long form: heading, short explanation and the fields underneath. */
export default function FormSection({
  title,
  description,
  showDivider = true,
  className,
  children,
}: FormSectionProps) {
  return (
    <section
      className={cn([
        'space-y-4',
        showDivider ? 'border-b border-[color:var(--app-border,#e2e8f0)] pb-8' : '',
        className ?? '',
      ])}
    >
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-[color:var(--app-text,#0f172a)]">{title}</h2>
        {description ? <p className="text-sm text-[color:var(--app-text-muted,#64748b)]">{description}</p> : null}
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}