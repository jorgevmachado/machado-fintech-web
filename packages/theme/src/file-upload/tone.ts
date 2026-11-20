import type { TTone } from '../base';

export type TFileUploadToneClassNames = {
  border: string;
  hoverBorder: string;
  soft: string;
};

/**
 * O acento do upload vem das custom properties `--app-*` publicadas pelo shell
 * (`Navigation`), com o valor claro como fallback — mesmo contrato de
 * `Table`, `Accordion` e `Tabs`.
 *
 * O componente usava tokens do shadcn (`primary`, `muted-foreground`,
 * `destructive`, `border`), que este projeto não define em nenhum lugar: as
 * classes não geravam CSS e o dropzone ficava igual nos dois temas, sem borda
 * nem estado de arraste visível.
 *
 * `hoverBorder` é uma string literal própria, não `hover:` + `border`: o
 * scanner do Tailwind v4 lê o texto do source, então uma classe montada por
 * interpolação nunca entra no CSS gerado.
 *
 * O shell não publica uma variante `soft` de todas as cores (`success` não tem
 * `--app-positive-soft`), então quem não tem a variável cai no `surface-muted`
 * do tema — que já acompanha claro/escuro — em vez de um `bg-*-50` fixo que
 * sumiria no escuro.
 */
export const FILE_UPLOAD_TONE_CLASS_MAP: Record<TTone, TFileUploadToneClassNames> = {
  primary: {
    border: 'border-[color:var(--app-accent-border,#3b82f6)]',
    hoverBorder: 'hover:border-[color:var(--app-accent-border,#3b82f6)]',
    soft: 'bg-[color:var(--app-accent-soft,#eff6ff)]',
  },
  secondary: {
    border: 'border-[color:var(--app-text-subtle,#475569)]',
    hoverBorder: 'hover:border-[color:var(--app-text-subtle,#475569)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  success: {
    border: 'border-[color:var(--app-positive,#059669)]',
    hoverBorder: 'hover:border-[color:var(--app-positive,#059669)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  warning: {
    border: 'border-[color:var(--app-warning,#b45309)]',
    hoverBorder: 'hover:border-[color:var(--app-warning,#b45309)]',
    soft: 'bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]',
  },
  danger: {
    border: 'border-[color:var(--app-negative,#dc2626)]',
    hoverBorder: 'hover:border-[color:var(--app-negative,#dc2626)]',
    soft: 'bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]',
  },
  info: {
    border: 'border-[color:var(--app-info,#0369a1)]',
    hoverBorder: 'hover:border-[color:var(--app-info,#0369a1)]',
    soft: 'bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))]',
  },
  neutral: {
    border: 'border-[color:var(--app-text-muted,#64748b)]',
    hoverBorder: 'hover:border-[color:var(--app-text-muted,#64748b)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  default: {
    border: 'border-[color:var(--app-border,#e2e8f0)]',
    hoverBorder: 'hover:border-[color:var(--app-border,#e2e8f0)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  muted: {
    border: 'border-[color:var(--app-border,#e2e8f0)]',
    hoverBorder: 'hover:border-[color:var(--app-border,#e2e8f0)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  subtle: {
    border: 'border-[color:var(--app-border,#e2e8f0)]',
    hoverBorder: 'hover:border-[color:var(--app-border,#e2e8f0)]',
    soft: 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
  },
  white: {
    border: 'border-white',
    hoverBorder: 'hover:border-white',
    soft: 'bg-[color:var(--app-surface,#ffffff)]',
  },
  inherit: {
    border: 'border-transparent',
    hoverBorder: 'hover:border-transparent',
    soft: 'bg-transparent',
  },
};