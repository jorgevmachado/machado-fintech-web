'use client';
import { Button } from '@fintech/ui';

type DeleteProps = {
  identifier: string;
  onClose: () => void;
  onSubmit: (identifier: string) => void;
  /** Optional confirmation context; without it the dialog stays a plain yes/no. */
  title?: string;
  description?: string;
  itemLabel?: string;
  itemValue?: string;
  /** Label of the destructive action, for flows that are not a deletion (e.g. reverting). */
  confirmLabel?: string;
  isConfirming?: boolean;
};

export default function Delete({
  onClose,
  onSubmit,
  identifier,
  title,
  description,
  itemLabel,
  itemValue,
  confirmLabel = 'Excluir',
  isConfirming = false,
}: DeleteProps) {
  return (
    <div className="space-y-4">
      {title || description ? (
        <div className="space-y-1">
          {title ? <p className="text-sm font-semibold text-[color:var(--app-text-strong,#020617)]">{title}</p> : null}
          {description ? <p className="text-sm text-[color:var(--app-text-muted,#64748b)]">{description}</p> : null}
        </div>
      ) : null}

      {itemLabel || itemValue ? (
        <dl className="rounded-md border border-[color:var(--app-border,#e2e8f0)] px-3 py-2 text-sm">
          <dt className="text-xs text-[color:var(--app-text-muted,#64748b)]">{itemLabel}</dt>
          <dd className="font-medium text-[color:var(--app-text-strong,#020617)]">{itemValue}</dd>
        </dl>
      ) : null}

      <div className="mt-1 flex justify-end gap-2">
        <Button type="button" appearance="outline" onClick={onClose} disabled={isConfirming}>
          Cancelar
        </Button>
        <Button
          type="button"
          tone="danger"
          isLoading={isConfirming}
          onClick={() => onSubmit(identifier)}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}