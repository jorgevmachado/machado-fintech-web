'use client';

import React ,{ useCallback ,useEffect ,useRef ,useState } from 'react';
import type { TIcon } from '@fintech/icons';

import { Icon } from '../../primitives';

type OptionsDropdownIconPosition = 'left' | 'right';

type OptionsDropdownItem = {
  icon?: React.ReactNode | TIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  iconPosition?: OptionsDropdownIconPosition;
};

type OptionsDropdownProps = {
  icon?: React.ReactNode | TIcon;
  items: Array<OptionsDropdownItem>;
  align?: OptionsDropdownIconPosition;
}

const OptionsDropdown = ({ icon = 'dots', items, align = 'right' }: OptionsDropdownProps) => {

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleToggle}
        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-2 text-[color:var(--app-text-subtle,#475569)] shadow-sm transition-colors hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        <Icon icon={icon}/>
      </button>

      {open && (
        <div
          role="menu"
          className={`
           absolute
           z-50
           mt-1 
           min-w-[160px]
           rounded-xl
           border
           border-[color:var(--app-border,#e2e8f0)] 
           bg-[color:var(--app-surface,#ffffff)] 
           py-1 
           shadow-lg
           ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item) => {
            const iconPosition = item.icon ? (item.iconPosition ?? 'left') : undefined;
            return (
              <button
                key={item.label}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-[color:var(--app-text,#0f172a)] transition-colors hover:bg-[color:var(--app-surface-muted,#f1f5f9)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {iconPosition === 'left' && (
                  <span aria-hidden="true" className="inline-flex shrink-0">
                    <Icon icon={item.icon} />
                  </span>
                )}
                <span>{item.label}</span>
                {iconPosition === 'right' && (
                  <span aria-hidden="true" className="ml-auto inline-flex shrink-0">
                    <Icon icon={item.icon} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(OptionsDropdown);
