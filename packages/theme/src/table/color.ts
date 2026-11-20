/**
 * Cores das ações por token `--app-*`, com o valor claro como fallback: as
 * variantes `-soft` existem porque `hover:bg-sky-50` some sobre superfície
 * escura, e o texto precisa de mais luz no dark para manter contraste.
 */
export const TABLE_COLOR_THEME: Record<string, string> = {
  show: 'text-[color:var(--app-info,#0369a1)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))]',
  edit: 'text-[color:var(--app-warning,#b45309)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]',
  delete: 'text-[color:var(--app-negative,#dc2626)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]',
}