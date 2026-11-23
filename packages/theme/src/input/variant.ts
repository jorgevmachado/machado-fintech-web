export const OInputVariant = ['outline' , 'filled' , 'ghost'] as const;

export type TInputVariant = (typeof OInputVariant)[number];

/**
 * Superfície, borda e texto vêm de `--app-*` com o valor claro como fallback:
 * o input acompanha o tema do shell e continua legível fora dele.
 *
 * O halo de foco **não** mora aqui. Ele é escolhido num ponto só em
 * `buildInputTheme`, porque o estado inválido precisa substituí-lo — e duas
 * classes `focus-within:ring-[color:...]` no mesmo elemento seriam resolvidas
 * pela ordem do CSS, não pela ordem da string (o projeto não usa
 * `tailwind-merge`).
 */
export const INPUT_VARIANT_CLASS_MAP: Record<TInputVariant, string> = {
  outline: 'border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)]',
  filled: 'border border-transparent bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]',
  ghost: 'border border-transparent bg-transparent text-[color:var(--app-text,#0f172a)]',
};

/**
 * Halo de foco por estado. Antes era `ring-blue-100`/`ring-red-100` fixos:
 * um anel de 2px cheio e claríssimo sobre a superfície escura (`#17233d`),
 * justamente no estado mais visível. Agora sai do `-soft` de cada matiz.
 */
export const INPUT_FOCUS_RING_CLASS_MAP = {
  valid: 'focus-within:border-[color:var(--app-accent-border,#3b82f6)] focus-within:ring-2 focus-within:ring-[color:var(--app-accent-soft,#eff6ff)]',
  invalid: 'border-[color:var(--app-negative,#dc2626)] focus-within:border-[color:var(--app-negative,#dc2626)] focus-within:ring-2 focus-within:ring-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]',
} as const;