import type { TThemeVariant ,TTone } from '../base';

import type { TFileUploadToneClassNames } from './tone';

/**
 * Paleta literal dos dois temas, espelhando `NAVIGATION_SHELL_VARS_MAP`.
 *
 * O `FileUpload` fora do shell — em portal ou modal — não herda as custom
 * properties `--app-*`, e o fallback claro de cada `var()` deixaria o
 * componente claro sobre uma página escura. Quem está fora do shell informa
 * `variant` e recebe as classes literais do tema pedido.
 *
 * `hoverBorder` de cada tom é escrito por extenso: o scanner do Tailwind v4 lê
 * o texto do source, então `hover:` + interpolação nunca entra no CSS gerado.
 */
export type TFileUploadVariantPalette = {
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderHover: string;
  text: string;
  textStrong: string;
  textStrongHover: string;
  textMuted: string;
  accentBorder: string;
  accentHoverBorder: string;
  accentSoft: string;
  negativeBorder: string;
  negativeHoverBorder: string;
  negativeSoft: string;
  negativeText: string;
};

export const FILE_UPLOAD_VARIANT_PALETTE_MAP: Record<TThemeVariant, TFileUploadVariantPalette> = {
  light: {
    surface: 'bg-white',
    surfaceMuted: 'bg-slate-100',
    surfaceHover: 'hover:bg-slate-100/70',
    border: 'border-slate-200',
    borderHover: 'hover:border-slate-300',
    text: 'text-slate-900',
    textStrong: 'text-slate-950',
    textStrongHover: 'hover:text-slate-950',
    textMuted: 'text-slate-500',
    accentBorder: 'border-blue-500',
    accentHoverBorder: 'hover:border-blue-400',
    accentSoft: 'bg-blue-50',
    negativeBorder: 'border-red-600',
    negativeHoverBorder: 'hover:border-red-500',
    negativeSoft: 'bg-red-50',
    negativeText: 'text-red-600',
  },
  dark: {
    surface: 'bg-[#111c33]',
    surfaceMuted: 'bg-[#17233d]',
    surfaceHover: 'hover:bg-white/10',
    border: 'border-[#1f2f4a]',
    borderHover: 'hover:border-[#2b3f61]',
    text: 'text-[#e6edf7]',
    textStrong: 'text-[#f8fafc]',
    textStrongHover: 'hover:text-[#f8fafc]',
    textMuted: 'text-[#93a4bd]',
    accentBorder: 'border-[#3b82f6]',
    accentHoverBorder: 'hover:border-[#60a5fa]',
    accentSoft: 'bg-[rgba(59,130,246,0.16)]',
    negativeBorder: 'border-[#f87171]',
    negativeHoverBorder: 'hover:border-[#fca5a5]',
    negativeSoft: 'bg-[rgba(248,113,113,0.16)]',
    negativeText: 'text-[#f87171]',
  },
};

/**
 * Traduz um `TTone` para o tom equivalente na paleta do tema.
 *
 * Só `primary`/`info` usam o acento e `danger` usa o negativo: os demais tons
 * não têm par no shell, então caem no neutro do tema em vez de um `bg-*-50`
 * fixo que sumiria no escuro.
 */
export const resolveFileUploadVariantTone = (
  palette: TFileUploadVariantPalette,
  tone: TTone,
): TFileUploadToneClassNames => {
  if (tone === 'primary' || tone === 'info') {
    return {
      border: palette.accentBorder,
      hoverBorder: palette.accentHoverBorder,
      soft: palette.accentSoft,
    };
  }

  if (tone === 'danger') {
    return {
      border: palette.negativeBorder,
      hoverBorder: palette.negativeHoverBorder,
      soft: palette.negativeSoft,
    };
  }

  return {
    border: palette.border,
    hoverBorder: palette.borderHover,
    soft: palette.surfaceMuted,
  };
};