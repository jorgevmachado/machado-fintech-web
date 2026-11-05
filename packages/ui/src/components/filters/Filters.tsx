'use client';

import React ,{ useMemo ,useState } from 'react';

import { useAppTranslation } from '@fintech/i18n';

import { Text } from '../../primitives';

import Autocomplete from '../autocomplete';
import Input from '../input';
import Button from '../button';

import type { FiltersProps } from './types';

export default function Filters({
  filters,
  onApply,
  onClear,
  ariaLabel,
  filterApplyLabel = 'filter.apply',
  filterCleanLabel = 'filter.clear',
}: FiltersProps) {
  const { t } = useAppTranslation();

  const initDraftFilters = (nextFilters: FiltersProps['filters']): Record<string, string> => {
    const result = {} as Record<string, string>;

    for (const filter of nextFilters) {
      result[filter.name] = String(filter.value ?? '');
    }

    return result;
  };

  const [draftFilters, setDraftFilters] = useState<Record<string, string>>(
    () => initDraftFilters(filters),
  );

  const updateDraftValue = (key: string, value: string) => {
    setDraftFilters((previousState) => ({
      ...previousState,
      [key]: value,
    }));
  };

  const handleClear = () => {
    const resetFilters = initDraftFilters(filters);
    setDraftFilters(resetFilters);
    onClear?.();
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(draftFilters).some((value) => value !== '');
  }, [draftFilters]);

  const handleApply = () => {
    const normalizedFilters = Object.fromEntries(
      Object.entries(draftFilters).map(([key, value]) => [key, value.trim()]),
    ) as Record<string, string>;

    onApply(normalizedFilters);
  };

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5"
      aria-label={ariaLabel}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filters.map(({ name, label, type, options, isLoading = false, placeholder }) => {
          const currentLabel = !label ? `filter.label.${name}` : label;
          const currentPlaceholder = !placeholder ? `filter.placeholder.${name}` : placeholder;

          return (
            <label key={name} className={`flex flex-col gap-1.5 ${type === 'autocomplete' ? 'relative' : undefined}`}>
              <Text
                size="xs"
                color="text-slate-600"
                weight="semibold"
                tracking="wide"
                className="uppercase"
              >
                {t(currentLabel)}
              </Text>
              { type === 'autocomplete' && options ? (
                <Autocomplete
                  name={name}
                  value={draftFilters[name] ?? ''}
                  options={options.map((option) => ({ ...option, label: t(option.label ?? '') }))}
                  isLoading={isLoading}
                  noResultsText={t('filter.empty')}
                  placeholder={t(currentPlaceholder)}
                  onValueChange={(nextValue) => {
                    updateDraftValue(name, nextValue);
                  }}
                />
              ) : (
                <Input
                  type={type}
                  name={name}
                  value={draftFilters[name] ?? ''}
                  placeholder={t(currentPlaceholder)}
                  onValueChange={(nextValue) => {
                    updateDraftValue(name, nextValue);
                  }}
                />
              ) }
            </label>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          tone="neutral"
          onClick={handleClear}
          disabled={!hasActiveFilters}
        >
          {t(filterCleanLabel)}
        </Button>

        <Button
          type="button"
          tone="primary"
          onClick={handleApply}
        >
          {t(filterApplyLabel)}
        </Button>
      </div>
    </section>
  );
};
