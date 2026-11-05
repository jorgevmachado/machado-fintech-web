import type { TLocalesFiles } from '@fintech/i18n';

import enUS from './locales/en-US.json';
import esUE from './locales/es-UE.json';
import ptBR from './locales/pt-BR.json';

export { default } from './Filters';
export { OFilterVariants } from './options';
export type { FiltersProps, TBaseFilter,TFilter, TFilterOption,  TFilterVariants } from './types';
export { default as useFilter } from './useFilter';

export const filterLocales:TLocalesFiles = { "en-US": enUS, "es-UE": esUE, "pt-BR": ptBR };