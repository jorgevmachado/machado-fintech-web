export const OAlertVariant = [
  'info',
  'error',
  'warning',
  'success'
] as const;

export type TAlertVariant = typeof OAlertVariant[number];

/**
 * O alerta é renderizado pelo `AlertProvider`, fora do shell e sem portal —
 * mas nem sempre herda `--app-*` (a página de login não tem shell). O par
 * `-soft` + cor de texto do tema mantém a distinção entre as quatro variantes
 * e é legível no escuro, onde `bg-*-50 text-*-900` sumiria.
 *
 * A borda usa a cor saturada da variante, mas o **texto** usa o tom `-strong`:
 * sobre o fundo `-soft` (10% da mesma cor) a cor saturada fica perto de 3:1 no
 * claro, abaixo do mínimo AA para texto pequeno. O `-strong` mantém a
 * identidade da variante com contraste suficiente.
 *
 * `error` usa `--app-negative` porque o shell não publica `--app-error`; é o
 * mesmo vermelho que o resto do projeto usa para erro.
 */
export const ALERT_VARIANT_CLASS_MAP: Record<TAlertVariant, string> = {
  info: 'border-[color:var(--app-info,#0369a1)] bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] text-[color:var(--app-info-strong,#075985)]',
  error: 'border-[color:var(--app-negative,#dc2626)] bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] text-[color:var(--app-negative-strong,#991b1b)]',
  success: 'border-[color:var(--app-positive,#059669)] bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] text-[color:var(--app-positive-strong,#065f46)]',
  warning: 'border-[color:var(--app-warning,#b45309)] bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] text-[color:var(--app-warning-strong,#92400e)]',
};

export const ALERT_VARIANT_ICON_MAP: Record<TAlertVariant, string> = {
  info: 'info',
  error: 'error',
  success: 'check',
  warning: 'warning',
}