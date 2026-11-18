export default function GroupCount({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-[color:var(--app-surface-muted,#f1f5f9)] px-2 py-0.5 text-[11px] tabular-nums text-[color:var(--app-text-muted,#64748b)]">
      {count}
      <span className="sr-only"> {count === 1 ? 'transação' : 'transações'}</span>
    </span>
  );
}
