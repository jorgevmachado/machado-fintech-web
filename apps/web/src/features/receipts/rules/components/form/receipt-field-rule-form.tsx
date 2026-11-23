'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  Form,
  Input,
  Select,
  Switch,
  Text,
  useAlert,
  useTranslationResolver,
  type FormProps,
  type FormValidation,
} from '@fintech/ui';

import {
  ReceiptFieldNamesMap,
  ReceiptParsersMap,
  allowedNormalizationsFor,
  allowedParsersFor,
  allowedStrategiesFor,
  FALLBACK_FIELDS,
  type TReceiptFieldName,
  type TReceiptFieldRule,
  type TReceiptFieldRuleConfiguration,
  type TReceiptFieldStrategy,
  type TReceiptNormalization,
  type TReceiptParser,
  type TReceiptTextMapping,
} from '../../domain';

import ReceiptTextMappings, { type TextMappingDraft } from './receipt-text-mappings';

type ReceiptFieldRuleFormProps = {
  /** Regra existente quando edição; ausente quando criação. */
  item?: TReceiptFieldRule;
  /** Campos já configurados no perfil — não podem repetir (o backend rejeita). */
  usedFieldNames: ReadonlyArray<TReceiptFieldName>;
  onSubmit: (rule: TReceiptFieldRule) => void;
  onCancel: () => void;
};

const ALL_FIELD_NAMES = Object.values(ReceiptFieldNamesMap);

const STRATEGY_LABEL: Record<TReceiptFieldStrategy, string> = {
  regex: 'receipt.rules.field_rules.strategy.regex',
  constant: 'receipt.rules.field_rules.strategy.constant',
  not_found: 'receipt.rules.field_rules.strategy.not_found',
  source: 'receipt.rules.field_rules.strategy.source',
};

const PARSER_LABEL: Record<TReceiptParser, string> = {
  text: 'receipt.rules.field_rules.parser.text',
  decimal_br: 'receipt.rules.field_rules.parser.decimal_br',
  date_numeric_br: 'receipt.rules.field_rules.parser.date_numeric_br',
  date_month_name_pt_br: 'receipt.rules.field_rules.parser.date_month_name_pt_br',
};

const NORMALIZATION_LABEL: Record<TReceiptNormalization, string> = {
  strip: 'receipt.rules.field_rules.normalization.strip',
  remove_whitespace: 'receipt.rules.field_rules.normalization.remove_whitespace',
  ocr_day: 'receipt.rules.field_rules.normalization.ocr_day',
};

function toMappingDrafts(mappings: TReceiptTextMapping[]): TextMappingDraft[] {
  return mappings.map((mapping, index) => ({ key: `m-${index}`, ...mapping }));
}

function patternsToText(patterns: string[]): string {
  return patterns.join('\n');
}

function textToPatterns(text: string): string[] {
  return text
    .split('\n')
    .map((pattern) => pattern.trim())
    .filter(Boolean);
}

function initialRegexState(configuration?: TReceiptFieldRuleConfiguration) {
  if (configuration?.strategy === 'regex') {
    return {
      patterns: patternsToText(configuration.patterns),
      parser: configuration.parser,
      normalization: configuration.normalization,
    };
  }
  return { patterns: '', parser: ReceiptParsersMap.TEXT, normalization: 'strip' as const };
}

export default function ReceiptFieldRuleForm({
  item,
  usedFieldNames,
  onSubmit,
  onCancel,
}: ReceiptFieldRuleFormProps) {
  const { showAlert } = useAlert();
  const { resolve } = useTranslationResolver();

  const [fieldName, setFieldName] = useState<TReceiptFieldName>(
    item?.field_name ?? 'fine',
  );
  const [strategy, setStrategy] = useState<TReceiptFieldStrategy>(
    item?.configuration.strategy ?? 'regex',
  );
  const [isActive, setIsActive] = useState(item?.is_active ?? true);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const regexState = initialRegexState(item?.configuration);
  const [patternsText, setPatternsText] = useState(regexState.patterns);
  const [parser, setParser] = useState<TReceiptParser>(regexState.parser);
  const [normalization, setNormalization] =
    useState<TReceiptNormalization>(regexState.normalization);

  const [constantValue, setConstantValue] = useState(
    item?.configuration.strategy === 'constant' ? item.configuration.value : '',
  );

  const sourceConfiguration =
    item?.configuration.strategy === 'source' ? item.configuration : undefined;
  const [identifiedValue, setIdentifiedValue] = useState(
    sourceConfiguration?.identified_value ?? '',
  );
  const [matches, setMatches] = useState<TextMappingDraft[]>(
    sourceConfiguration ? toMappingDrafts(sourceConfiguration.matches) : [],
  );
  const [mappings, setMappings] = useState<TextMappingDraft[]>(
    sourceConfiguration ? toMappingDrafts(sourceConfiguration.mappings) : [],
  );
  const [extractionPatternsText, setExtractionPatternsText] = useState(
    sourceConfiguration?.extraction
      ? patternsToText(sourceConfiguration.extraction.patterns)
      : '',
  );

  const availableFieldNames = useMemo(
    () =>
      ALL_FIELD_NAMES.filter(
        (name) => name === item?.field_name || !usedFieldNames.includes(name),
      ),
    [item?.field_name, usedFieldNames],
  );

  const parserOptions = useMemo(() => allowedParsersFor(fieldName), [fieldName]);
  const normalizationOptions = useMemo(
    () => allowedNormalizationsFor(fieldName, parser),
    [fieldName, parser],
  );
  const strategyOptions = useMemo(
    () => allowedStrategiesFor(fieldName),
    [fieldName],
  );
  const fallbackField = FALLBACK_FIELDS[fieldName];

  const initialValues = useMemo(() => ({}), []);

  const handleFieldNameChange = useCallback(
    (value: string) => {
      const next = value as TReceiptFieldName;
      setFieldName(next);

      // O parser depende do campo: reajusta para o primeiro aceito, senão o backend
      // responde "Parser is incompatible with the receipt field".
      const nextParsers = allowedParsersFor(next);
      if (!nextParsers.includes(parser)) {
        setParser(nextParsers[0]!);
        setNormalization('strip');
      }
      // `constant` e `source` só existem para source_institution.
      if (!allowedStrategiesFor(next).includes(strategy)) {
        setStrategy('regex');
      }
    },
    [parser, strategy],
  );

  const buildConfiguration = useCallback((): TReceiptFieldRuleConfiguration | null => {
    if (strategy === 'not_found') return { strategy: 'not_found' };

    if (strategy === 'constant') {
      const value = constantValue.trim();
      return value ? { strategy: 'constant', value } : null;
    }

    if (strategy === 'source') {
      const identified = identifiedValue.trim();
      if (!identified) return null;
      const extractionPatterns = textToPatterns(extractionPatternsText);
      return {
        strategy: 'source',
        identified_value: identified,
        matches: matches
          .filter((mapping) => mapping.contains.trim() && mapping.value.trim())
          .map((mapping) => ({
            contains: mapping.contains.trim(),
            value: mapping.value.trim(),
          })),
        extraction:
          extractionPatterns.length > 0
            ? {
                strategy: 'regex',
                patterns: extractionPatterns,
                parser: ReceiptParsersMap.TEXT,
                normalization: 'strip',
                fallback_field: null,
              }
            : null,
        mappings: mappings
          .filter((mapping) => mapping.contains.trim() && mapping.value.trim())
          .map((mapping) => ({
            contains: mapping.contains.trim(),
            value: mapping.value.trim(),
          })),
      };
    }

    const patterns = textToPatterns(patternsText);
    if (patterns.length === 0) return null;
    // O backend exige o grupo nomeado 'value' em cada pattern.
    if (patterns.some((pattern) => !pattern.includes('(?P<value>'))) return null;

    return {
      strategy: 'regex',
      patterns,
      parser,
      normalization,
      fallback_field: fallbackField ?? null,
    };
  }, [
    constantValue,
    extractionPatternsText,
    fallbackField,
    identifiedValue,
    mappings,
    matches,
    normalization,
    parser,
    patternsText,
    strategy,
  ]);

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

  const handleOnSuccess = useCallback(() => {
    setValidationAttempted(true);
    const configuration = buildConfiguration();

    if (configuration === null) {
      showAlert({
        variant: 'error',
        message: 'receipt.rules.field_rules.invalid',
        position: 'top-right',
      });
      return;
    }

    onSubmit({
      ...(item?.id ? { id: item.id } : {}),
      field_name: fieldName,
      configuration,
      is_active: isActive,
    });
  }, [buildConfiguration, fieldName, isActive, item, onSubmit, showAlert]);

  const fields: FormProps['fields'] = useMemo(() => [], []);

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
        {/*
         * `field_name` e `strategy` mudam quais campos existem abaixo: controlados aqui,
         * fora do `Form`, para o formulário reagir no mesmo render.
         */}
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            name="field_name"
            label={resolve('receipt.rules.field_rules.field_name.label')}
            value={fieldName}
            options={availableFieldNames.map((name) => ({
              value: name,
              label: `receipt.rules.field.${name}`,
            }))}
            disabled={Boolean(item)}
            onValueChange={handleFieldNameChange}
          />
          <Select
            name="strategy"
            label={resolve('receipt.rules.field_rules.strategy.label')}
            value={strategy}
            options={strategyOptions.map((option) => ({
              value: option,
              label: STRATEGY_LABEL[option],
            }))}
            onValueChange={(value) => setStrategy(value as TReceiptFieldStrategy)}
          />
        </div>
        {strategy === 'regex' && (
          <>
            <Input
              name="patterns"
              label={resolve('receipt.rules.field_rules.patterns.label')}
              placeholder={resolve('receipt.rules.field_rules.patterns.placeholder')}
              value={patternsText}
              required
              isInvalid={validationAttempted && textToPatterns(patternsText).length === 0}
              errorMessage={
                validationAttempted && textToPatterns(patternsText).length === 0
                  ? resolve('receipt.rules.field_rules.patterns.required')
                  : undefined
              }
              onValueChange={setPatternsText}
            />
            <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
              receipt.rules.field_rules.patterns.help
            </Text>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                name="parser"
                label={resolve('receipt.rules.field_rules.parser.label')}
                value={parser}
                options={parserOptions.map((option) => ({
                  value: option,
                  label: PARSER_LABEL[option],
                }))}
                disabled={parserOptions.length === 1}
                onValueChange={(value) => {
                  setParser(value as TReceiptParser);
                  setNormalization('strip');
                }}
              />
              <Select
                name="normalization"
                label={resolve('receipt.rules.field_rules.normalization.label')}
                value={normalization}
                options={normalizationOptions.map((option) => ({
                  value: option,
                  label: NORMALIZATION_LABEL[option],
                }))}
                disabled={normalizationOptions.length === 1}
                onValueChange={(value) =>
                  setNormalization(value as TReceiptNormalization)
                }
              />
            </div>

            {fallbackField && (
              <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
                {`receipt.rules.field_rules.fallback.${fallbackField}`}
              </Text>
            )}
          </>
        )}

        {strategy === 'constant' && (
          <Input
            name="constant_value"
            label={resolve('receipt.rules.field_rules.constant.label')}
            placeholder={resolve('receipt.rules.field_rules.constant.placeholder')}
            value={constantValue}
            required
            isInvalid={validationAttempted && !constantValue.trim()}
            errorMessage={
              validationAttempted && !constantValue.trim()
                ? resolve('receipt.rules.field_rules.constant.required')
                : undefined
            }
            onValueChange={setConstantValue}
          />
        )}

        {strategy === 'source' && (
          <>
            <Input
              name="identified_value"
              label={resolve('receipt.rules.field_rules.identified_value.label')}
              placeholder={resolve(
                'receipt.rules.field_rules.identified_value.placeholder',
              )}
              value={identifiedValue}
              required
              isInvalid={validationAttempted && !identifiedValue.trim()}
              errorMessage={
                validationAttempted && !identifiedValue.trim()
                  ? resolve('receipt.rules.field_rules.identified_value.required')
                  : undefined
              }
              onValueChange={setIdentifiedValue}
            />

            <ReceiptTextMappings
              title="receipt.rules.field_rules.matches.title"
              containsLabel="receipt.rules.field_rules.matches.contains"
              valueLabel="receipt.rules.field_rules.matches.value"
              value={matches}
              onChange={setMatches}
            />

            <Input
              name="extraction_patterns"
              label={resolve('receipt.rules.field_rules.extraction.label')}
              placeholder={resolve(
                'receipt.rules.field_rules.extraction.placeholder',
              )}
              value={extractionPatternsText}
              onValueChange={setExtractionPatternsText}
            />

            <ReceiptTextMappings
              title="receipt.rules.field_rules.mappings.title"
              containsLabel="receipt.rules.field_rules.mappings.contains"
              valueLabel="receipt.rules.field_rules.mappings.value"
              value={mappings}
              onChange={setMappings}
            />
          </>
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
      </div>
    </Form>
  );
}