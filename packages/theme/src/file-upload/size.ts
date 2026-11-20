import type { TReducedSize } from '../base';

type TFileUploadSizeClassNames = {
  dropzone: string;
  icon: string;
  title: string;
  hint: string;
};

/**
 * Altura, respiro e tipografia do dropzone mudam juntos: `sm` serve para um
 * campo compacto dentro de formulário, `lg` para a área de upload de uma página
 * inteira. O card de arquivo tem altura própria (vem do conteúdo) e não entra
 * no mapa.
 */
export const FILE_UPLOAD_SIZE_CLASS_MAP: Record<TReducedSize, TFileUploadSizeClassNames> = {
  sm: {
    dropzone: 'min-h-40 p-6',
    icon: 'text-2xl',
    title: 'text-sm',
    hint: 'text-xs',
  },
  md: {
    dropzone: 'min-h-64 p-8',
    icon: 'text-3xl',
    title: 'text-sm',
    hint: 'text-xs',
  },
  lg: {
    dropzone: 'min-h-80 p-10',
    icon: 'text-4xl',
    title: 'text-base',
    hint: 'text-sm',
  },
};