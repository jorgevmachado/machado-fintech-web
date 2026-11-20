import type { TThemeVariant ,TReducedSize ,TTone } from '../base';

import { FILE_UPLOAD_SIZE_CLASS_MAP } from './size';
import { FILE_UPLOAD_TONE_CLASS_MAP } from './tone';
import {
  FILE_UPLOAD_VARIANT_PALETTE_MAP,
  resolveFileUploadVariantTone,
} from './variant';

type BuildFileUploadThemeParams = {
  size?: TReducedSize;
  tone?: TTone;
  className?: string;
  /**
   * Tema explícito para quando o componente é renderizado fora do shell
   * (`Navigation`), onde as custom properties `--app-*` não são herdadas.
   * Sem `variant`, as classes seguem baseadas em `var(--app-*, fallback claro)`
   * e acompanham o tema do shell sozinhas.
   */
  variant?: TThemeVariant;
};

type BuildFileUploadDropzoneThemeParams = BuildFileUploadThemeParams & {
  isDragActive?: boolean;
  disabled?: boolean;
};

type BuildFileUploadFileThemeParams = {
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: TThemeVariant;
};

export type BuildFileUploadThemeResult = {
  root: string;
  dropzone: string;
  icon: string;
  title: string;
  hint: string;
};

export type BuildFileUploadFileThemeResult = {
  root: string;
  thumbnail: string;
  name: string;
  size: string;
  error: string;
  remove: string;
};

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

const NEUTRAL_BORDER_CLASS = FILE_UPLOAD_TONE_CLASS_MAP.default.border;
const NEUTRAL_SOFT_CLASS = FILE_UPLOAD_TONE_CLASS_MAP.default.soft;

const resolveToneClass = (
  tone: TTone,
  variant?: TThemeVariant,
) => {
  if (!variant) {
    return FILE_UPLOAD_TONE_CLASS_MAP[tone];
  }

  return resolveFileUploadVariantTone(FILE_UPLOAD_VARIANT_PALETTE_MAP[variant], tone);
};

const resolveNeutralClass = (variant?: TThemeVariant) => {
  if (!variant) {
    return {
      border: NEUTRAL_BORDER_CLASS,
      soft: NEUTRAL_SOFT_CLASS,
    };
  }

  const palette = FILE_UPLOAD_VARIANT_PALETTE_MAP[variant];

  return {
    border: palette.border,
    soft: palette.surfaceMuted,
  };
};

/**
 * O dropzone é o único ponto que responde a arraste e a `disabled`. Os dois
 * estados são exclusivos — desabilitado vence, porque um dropzone inerte não
 * deve acender ao passar o arquivo por cima.
 *
 * Sem `tailwind-merge` no projeto, as classes concorrentes são escolhidas por
 * mapa, nunca concatenadas: duas bordas na mesma string seriam resolvidas pela
 * ordem do CSS, não pela ordem de escrita.
 */
export const buildFileUploadDropzoneTheme = ({
  size = 'md',
  tone = 'primary',
  isDragActive = false,
  disabled = false,
  className,
  variant,
}: BuildFileUploadDropzoneThemeParams = {}): string => {
  const sizeClass = FILE_UPLOAD_SIZE_CLASS_MAP[size];
  const toneClass = resolveToneClass(tone, variant);
  const neutralClass = resolveNeutralClass(variant);

  return joinClasses([
    'flex cursor-pointer flex-col items-center justify-center gap-2 text-center',
    'rounded-lg border-2 border-dashed transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--app-accent-border,#3b82f6)]',
    sizeClass.dropzone,
    disabled
      ? `${neutralClass.border} ${neutralClass.soft} cursor-not-allowed opacity-60`
      : isDragActive
        ? `${toneClass.border} ${toneClass.soft}`
        : `${neutralClass.border} ${toneClass.hoverBorder}`,
    className,
  ]);
};

export const buildFileUploadTheme = ({
  size = 'md',
  tone = 'primary',
  className,
  variant,
}: BuildFileUploadThemeParams = {}): BuildFileUploadThemeResult => {
  const sizeClass = FILE_UPLOAD_SIZE_CLASS_MAP[size];
  const palette = variant ? FILE_UPLOAD_VARIANT_PALETTE_MAP[variant] : undefined;

  return {
    root: joinClasses(['flex flex-col gap-4', className]),
    dropzone: buildFileUploadDropzoneTheme({ size, tone, variant }),
    icon: joinClasses([
      sizeClass.icon,
      'leading-none',
      palette ? palette.textMuted : 'text-[color:var(--app-text-muted,#64748b)]',
    ]),
    title: joinClasses([
      sizeClass.title,
      'font-medium',
      palette ? palette.text : 'text-[color:var(--app-text,#0f172a)]',
    ]),
    hint: joinClasses([
      sizeClass.hint,
      palette ? palette.textMuted : 'text-[color:var(--app-text-muted,#64748b)]',
    ]),
  };
};

/**
 * O card de arquivo não recebe `tone`: rejeição é sempre um estado de erro, e o
 * vermelho do shell (`--app-negative`) é o mesmo nos dois temas. Deixar o acento
 * do dropzone vazar para cá pintaria de azul um arquivo que falhou na validação.
 */
export const buildFileUploadFileTheme = ({
  hasError = false,
  disabled = false,
  className,
  variant,
}: BuildFileUploadFileThemeParams = {}): BuildFileUploadFileThemeResult => {
  const palette = variant ? FILE_UPLOAD_VARIANT_PALETTE_MAP[variant] : undefined;
  const errorTone = resolveToneClass('danger', variant);

  return {
    root: joinClasses([
      'flex items-center gap-3 rounded-lg border p-3',
      palette ? palette.surface : 'bg-[color:var(--app-surface,#ffffff)]',
      hasError
        ? `${errorTone.border} ${errorTone.soft}`
        : palette
          ? palette.border
          : NEUTRAL_BORDER_CLASS,
      className,
    ]),
    thumbnail: joinClasses([
      'flex size-10 shrink-0 items-center justify-center rounded-md',
      palette ? palette.surfaceMuted : 'bg-[color:var(--app-surface-muted,#f1f5f9)]',
    ]),
    name: joinClasses([
      'truncate text-sm font-medium',
      palette ? palette.text : 'text-[color:var(--app-text,#0f172a)]',
    ]),
    size: joinClasses([
      'text-xs',
      palette ? palette.textMuted : 'text-[color:var(--app-text-muted,#64748b)]',
    ]),
    error: joinClasses([
      'text-xs',
      palette ? palette.negativeText : 'text-[color:var(--app-negative,#dc2626)]',
    ]),
    remove: joinClasses([
      'shrink-0 rounded-md p-2',
      palette ? palette.textMuted : 'text-[color:var(--app-text-muted,#64748b)]',
      palette ? palette.surfaceHover : 'hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))]',
      palette ? palette.textStrongHover : 'hover:text-[color:var(--app-text-strong,#020617)]',
      'disabled:pointer-events-none disabled:opacity-50',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ]),
  };
};