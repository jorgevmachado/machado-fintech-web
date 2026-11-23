export const OTone = [
  'default',
  'muted',
  'white',
  'subtle',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'inherit',
] as const;

export type TTone = (typeof OTone)[number];

export const OThemeTone = [
  'neutral',
  'primary',
  'secondary',
] as const;

export type TThemeTone = (typeof OThemeTone)[number];

/**
 * Cores de texto por tom.
 *
 * Todos os tons vêm das custom properties `--app-*` com o valor claro como
 * fallback: um ponto só decide a aparência nos dois temas, e quem é renderizado
 * fora do shell continua legível.
 *
 * Os acentos também migraram. Um `text-red-600` literal fica em 3.51:1 sobre a
 * superfície escura e `text-emerald-600` em 3.77:1 sobre a clara — nenhum dos
 * dois passa AA em um dos temas. Os `-strong` são o par claro do `-soft` do
 * mesmo matiz (8.3–11.8:1 nos dois temas).
 *
 * `secondary` é neutro de propósito, como em `Button`, `Dropdown` e `Badge`,
 * onde o tom secundário é `slate-700`/`--app-text`. Antes era `text-violet-600`,
 * o único ponto violeta do sistema — e 2.98:1 sobre a superfície escura.
 */
export const TEXT_TONE_CLASS_MAP: Record<TTone ,string> = {
  info: 'text-[color:var(--app-info-strong,#075985)]',
  muted: 'text-[color:var(--app-text-subtle,#475569)]',
  white: 'text-white',
  subtle: 'text-[color:var(--app-text-muted,#64748b)]',
  danger: 'text-[color:var(--app-negative-strong,#991b1b)]',
  default: 'text-[color:var(--app-text-strong,#020617)]',
  primary: 'text-[color:var(--app-accent,#1d4ed8)]',
  success: 'text-[color:var(--app-positive-strong,#065f46)]',
  warning: 'text-[color:var(--app-warning-strong,#92400e)]',
  neutral: 'text-[color:var(--app-text,#0f172a)]',
  inherit: 'text-inherit',
  secondary: 'text-[color:var(--app-text-subtle,#475569)]',
};