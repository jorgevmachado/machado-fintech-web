/**
 * Estilos do tooltip compartilhados pelos gráficos.
 *
 * O tooltip do Recharts é HTML posicionado por estilo inline — não é SVG —,
 * então `var()` resolve normalmente e ele acompanha os tokens `--app-*` do
 * tema sem prop nova. O fallback claro cobre o uso fora de um documento com
 * tema aplicado.
 *
 * Grid e eixos seguem caminho diferente: são atributos de apresentação SVG
 * (`<line stroke>` / `<text fill>`), onde `var()` não resolve. Esses são
 * tratados por CSS em `packages/ui/src/styles.css`.
 */
export const TOOLTIP_CONTENT_STYLE = {
  background: 'var(--app-surface, #ffffff)',
  border: '1px solid var(--app-border, #e2e8f0)',
  borderRadius: '0.75rem',
  color: 'var(--app-text, #0f172a)',
  boxShadow: '0 10px 24px rgba(2, 6, 23, 0.12)',
} as const;

export const TOOLTIP_LABEL_STYLE = {
  color: 'var(--app-text-strong, #020617)',
  fontWeight: 600,
} as const;

/**
 * Sem `color` de propósito: o Recharts pinta cada item com a cor da sua série,
 * e fixar `color` aqui sobrescreveria essa cor — o tooltip perderia a única
 * pista visual de qual série é qual.
 */
export const TOOLTIP_ITEM_STYLE = {} as const;