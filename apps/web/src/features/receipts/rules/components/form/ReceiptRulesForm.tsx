'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  Form,
  Select,
  Switch,
  Text,
  useAlert,
  useTranslationResolver,
  type FormProps,
  type FormValidation,
} from '@fintech/ui';

import { ReceiptRules, TReceiptRulesPersist } from '../../domain';
import {
  type ReceiptRulesInstitutionOption,
  useReceiptRulesOptions,
} from '../../hooks';

import ReceiptIdentificationRules, {
  type IdentificationRuleDraft,
} from './receipt-identification-rules';

type ReceiptRulesFormProps = {
  item?: ReceiptRules;
  /** Perfis já existentes: instituições com perfil aparecem desabilitadas. */
  profiles: ReadonlyArray<ReceiptRules>;
  onSubmit: (data: TReceiptRulesPersist) => void;
  onCancel: () => void;
};

function toDrafts(item?: ReceiptRules): IdentificationRuleDraft[] {
  return (item?.identification_rules ?? []).map((rule, index) => ({
    key: rule.id ?? `new-${index}`,
    ...(rule.id ? { id: rule.id } : {}),
    pattern: rule.pattern,
    weight: rule.weight,
    is_active: rule.is_active,
  }));
}

export default function ReceiptRulesForm({
  item,
  profiles,
  onSubmit,
  onCancel,
}: ReceiptRulesFormProps) {
  const { showAlert } = useAlert();
  const { resolve } = useTranslationResolver();
  const { institutions, isLoading: isLoadingInstitutions } =
    useReceiptRulesOptions(profiles);

  const [validationAttempted, setValidationAttempted] = useState(false);
  const [identificationRules, setIdentificationRules] = useState<
    IdentificationRuleDraft[]
  >(() => toDrafts(item));
  const [institutionId, setInstitutionId] = useState(item?.institution_id ?? '');
  const [isActive, setIsActive] = useState(item?.is_active ?? true);

  const initialValues = useMemo(
    () => ({
      name: item?.name ?? '',
    }),
    [item],
  );

  /**
   * Ao editar, a instituição não muda: o backend rejeita `institution_id` no PUT. O Select
   * mostra apenas a instituição atual, travado.
   */
  const institutionOptions: ReceiptRulesInstitutionOption[] = useMemo(() => {
    if (!item) return institutions;
    const current = item.institution_id;
    if (current === null) return [];
    return institutions.filter((option) => option.value === current);
  }, [institutions, item]);

  const fields: FormProps['fields'] = useMemo(
    () => [
      {
        type: 'text',
        name: 'name',
        value: initialValues.name,
        label: 'receipt.rules.name.label',
        placeholder: 'receipt.rules.name.placeholder',
        required: true,
      },
    ],
    [initialValues.name],
  );

  const handleOnError = useCallback(
    (validation: FormValidation) => {
      setValidationAttempted(true);
      showAlert({
        variant: 'error',
        message: validation.errorMessage ?? 'form.validation.required',
        position: 'top-right',
      });
    },
    [showAlert],
  );

  const handleOnSuccess = useCallback(
    (data: Record<string, string>) => {
      setValidationAttempted(true);

      const name = data.name?.trim() ?? '';
      const invalidRule = identificationRules.find(
        (rule) => !rule.pattern.trim() || !(rule.weight > 0),
      );

      if (!name) {
        showAlert({
          variant: 'error',
          message: 'form.validation.required',
          position: 'top-right',
        });
        return;
      }
      if (invalidRule) {
        showAlert({
          variant: 'error',
          message: 'receipt.rules.identification.invalid',
          position: 'top-right',
        });
        return;
      }
      if (!item && !institutionId) {
        showAlert({
          variant: 'error',
          message: 'receipt.rules.institution.required',
          position: 'top-right',
        });
        return;
      }

      onSubmit({
        id: item?.id,
        name,
        institution_id: item?.institution_id ?? institutionId,
        is_active: isActive,
        identification_rules: identificationRules.map((rule) => ({
          ...(rule.id ? { id: rule.id } : {}),
          pattern: rule.pattern.trim(),
          weight: rule.weight,
          is_active: rule.is_active,
        })),
      });
    },
    [identificationRules, institutionId, isActive, item, onSubmit, showAlert],
  );

  return (
    <Form
      noValidate
      fields={fields}
      initialValues={initialValues}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      actions={{
        justify: 'end',
        submit: { children: 'form.action.save' },
        cancel: { children: 'form.action.cancel', onClick: onCancel },
      }}
    >
      <div className="space-y-4">
        <Select
          name="institution_id"
          label={resolve('receipt.rules.institution.label')}
          placeholder={resolve('receipt.rules.institution.placeholder')}
          value={institutionId}
          options={institutionOptions}
          disabled={Boolean(item) || isLoadingInstitutions}
          required
          onValueChange={(value) => setInstitutionId(value)}
        />
        {!item && (
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.rules.institution.help
          </Text>
        )}

        <div className="flex items-center gap-3">
          <Switch
            name="is_active"
            checked={isActive}
            onCheckedChange={setIsActive}
            aria-label={resolve('receipt.rules.is_active.label')}
          />
          <Text size="sm">receipt.rules.is_active.label</Text>
        </div>

        <ReceiptIdentificationRules
          value={identificationRules}
          onChange={setIdentificationRules}
          validationAttempted={validationAttempted}
        />
      </div>
    </Form>
  );
}