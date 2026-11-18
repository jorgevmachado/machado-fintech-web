import { Icon } from '@fintech/ui';

import { Statement } from '@/src/features/transactions/statement';
import { TransactionStatusMap } from '@/src/features/transactions/transaction';
import { cn } from '@/src/shared/temp-class-name';

type SettleToggleButtonProps = {
  entry: Statement;
  isToggling: boolean;
  onToggle: (entry: Statement) => void;
};

/**
 * Checkbox that settles (`SETTLED`) or unsettles (`PENDING`) the entry: an empty
 * circle while pending, filled with a check once settled. It never opens the form —
 * click and key events stop at the button.
 */
export default function SettleToggleButton({ entry, isToggling, onToggle }: SettleToggleButtonProps) {
  const isSettled = entry.status === TransactionStatusMap.SETTLED;
  const isCanceled = entry.status === TransactionStatusMap.CANCELED;

  const button = (
    <button
      type="button"
      disabled={isCanceled || isToggling}
      aria-pressed={isSettled}
      aria-label={`Marcar "${entry.name}" como ${isSettled ? 'pendente' : 'efetivada'}`}
      className={cn([
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300',
        'disabled:cursor-not-allowed disabled:opacity-60',
        isToggling ? 'animate-pulse' : '',
        isCanceled ? '' : 'hover:bg-[color:var(--app-surface-muted,#f1f5f9)]',
      ])}
      onClick={(event) => {
        event.stopPropagation();
        onToggle(entry);
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <span
        aria-hidden="true"
        className={cn([
          'flex size-5 items-center justify-center rounded-full border-2 transition-colors',
          isSettled
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-400 text-transparent',
        ])}
      >
        <Icon icon="check" className="inline-flex size-3" />
      </span>
    </button>
  );

  if (!isCanceled) return button;

  // A disabled button fires no pointer events, so the wrapper keeps the click from opening the form.
  return (
    <span
      tabIndex={0}
      className="inline-flex shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {button}
    </span>
  );
}