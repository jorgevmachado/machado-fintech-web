'use client';

import { useEffect, useState } from 'react';

import { type Institution, institutionService } from '@/src/features/institution';

import type { ReceiptRules } from '../domain';

export type ReceiptRulesInstitutionOption = {
  /** UUID enviado em `institution_id`. */
  value: string;
  /** Rótulo exibido: nome com o código entre parênteses. */
  label: string;
  /** `true` quando a instituição já tem perfil — criar outro daria 409. */
  disabled: boolean;
};

export type ReceiptRulesOptionsResult = {
  institutions: ReceiptRulesInstitutionOption[];
  isLoading: boolean;
  error: string | null;
};

const OPTIONS_PAGE_SIZE = 100;

/**
 * O `Select` de `@fintech/ui` resolve cada `label` como chave de i18n quando ela parece uma
 * chave (`^[a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)+$`). Um nome como "Nubank.com.br" casaria o padrão
 * e renderizaria a própria chave; por isso o rótulo sempre leva o código entre parênteses,
 * que quebra o formato.
 */
export function toInstitutionLabel(institution: Institution): string {
  return `${institution.name} (${institution.name_code.toUpperCase()})`;
}

/**
 * Opções do Select de instituições. Recebe os perfis já carregados para desabilitar as
 * instituições que já possuem regras.
 */
export default function useReceiptRulesOptions(
  profiles: ReadonlyArray<ReceiptRules>,
): ReceiptRulesOptionsResult {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    institutionService
      .fetchList({ page: '1', limit: OPTIONS_PAGE_SIZE.toString() })
      .then((response) => {
        if (!isCurrent) return;

        if (response.isFailure) {
          setError('receipt.rules.institution.options.error');
          return;
        }

        const instance = response.instance;
        setInstitutions(Array.isArray(instance) ? instance : instance?.items ?? []);
        setError(null);
      })
      .catch(() => {
        if (isCurrent) setError('receipt.rules.institution.options.error');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const configured = new Set(
    profiles
      .map((profile) => profile.institution_id)
      .filter((identifier): identifier is string => identifier !== null),
  );

  return {
    institutions: institutions.map((institution) => ({
      value: institution.id,
      label: toInstitutionLabel(institution),
      disabled: configured.has(institution.id),
    })),
    isLoading,
    error,
  };
}