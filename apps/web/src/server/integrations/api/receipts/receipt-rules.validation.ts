import {
  readJsonObject,
  RequestValidationError,
  requiredString,
} from '@/src/server/validation/request-validation';

const MAX_RULES = 100;
const MAX_PATTERN_LENGTH = 2000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireBoolean(
  body: Record<string, unknown>,
  field: string,
): boolean {
  const value = body[field];
  if (typeof value !== 'boolean') {
    throw new RequestValidationError(`${field} must be a boolean.`);
  }
  return value;
}

function requireInstitutionId(body: Record<string, unknown>): string {
  const value = body['institution_id'];
  if (typeof value !== 'string' || !value.trim()) {
    throw new RequestValidationError('institution_id must be a non-empty string.');
  }
  return value;
}

/**
 * `identification_rules` é uma coleção reconciliada no PUT: item com `id` atualiza, sem `id`
 * cria, e o que existe no banco mas não vier no array é apagado. O backend rejeita `id: null`,
 * então a chave só é enviada quando há valor. No POST não há nada para reconciliar: `id` é
 * recusado para não sugerir que se está editando uma regra existente.
 */
function parseIdentificationRules(
  value: unknown,
  options: { allowId: boolean },
): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    throw new RequestValidationError('identification_rules must be an array.');
  }
  if (value.length > MAX_RULES) {
    throw new RequestValidationError(
      `identification_rules must contain at most ${MAX_RULES} items.`,
    );
  }

  return value.map((item, index) => {
    const field = `identification_rules[${index}]`;
    if (!isRecord(item)) {
      throw new RequestValidationError(`${field} must be an object.`);
    }

    const id = item['id'];
    if (id !== undefined && !options.allowId) {
      throw new RequestValidationError(
        `${field}.id is not accepted when creating a profile.`,
      );
    }
    if (id !== undefined && (typeof id !== 'string' || !id.trim())) {
      throw new RequestValidationError(`${field}.id must be a non-empty string.`);
    }

    const pattern = item['pattern'];
    if (typeof pattern !== 'string' || !pattern.trim()) {
      throw new RequestValidationError(`${field}.pattern must be a non-empty string.`);
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
      throw new RequestValidationError(
        `${field}.pattern must be at most ${MAX_PATTERN_LENGTH} characters.`,
      );
    }

    const weight = item['weight'];
    if (
      typeof weight !== 'number' ||
      !Number.isInteger(weight) ||
      weight <= 0
    ) {
      throw new RequestValidationError(`${field}.weight must be a positive integer.`);
    }

    const isActive = item['is_active'];
    if (typeof isActive !== 'boolean') {
      throw new RequestValidationError(`${field}.is_active must be a boolean.`);
    }

    return {
      ...(typeof id === 'string' ? { id } : {}),
      pattern,
      weight,
      is_active: isActive,
    };
  });
}

const MAX_PATTERNS = 20;
const MAX_MAPPINGS = 20;
const MAX_TEXT_LENGTH = 200;

const PARSERS = new Set([
  'text',
  'decimal_br',
  'date_numeric_br',
  'date_month_name_pt_br',
]);

const NORMALIZATIONS = new Set(['strip', 'remove_whitespace', 'ocr_day']);

const FIELD_NAMES = new Set([
  'fine',
  'payer',
  'barcode',
  'due_date',
  'discount',
  'interest',
  'category',
  'description',
  'paid_amount',
  'beneficiary',
  'payment_date',
  'total_charges',
  'authentication',
  'transaction_id',
  'effective_payer',
  'document_amount',
  'source_institution',
  'destination_institution',
]);

function requireTrimmedString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new RequestValidationError(`${field} must be a non-empty string.`);
  }
  if (value.length > maxLength) {
    throw new RequestValidationError(
      `${field} must be at most ${maxLength} characters.`,
    );
  }
  return value;
}

function parseMappings(value: unknown, field: string): Array<Record<string, string>> {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new RequestValidationError(`${field} must be an array.`);
  }
  if (value.length > MAX_MAPPINGS) {
    throw new RequestValidationError(
      `${field} must contain at most ${MAX_MAPPINGS} items.`,
    );
  }

  return value.map((item, index) => {
    const itemField = `${field}[${index}]`;
    if (!isRecord(item)) {
      throw new RequestValidationError(`${itemField} must be an object.`);
    }
    return {
      contains: requireTrimmedString(item['contains'], `${itemField}.contains`, MAX_TEXT_LENGTH),
      value: requireTrimmedString(item['value'], `${itemField}.value`, MAX_TEXT_LENGTH),
    };
  });
}

/** Espelha `ReceiptFieldConfiguration` de `rules/configuration/schema.py`. */
function parseRegexConfiguration(
  value: Record<string, unknown>,
  field: string,
): Record<string, unknown> {
  const patterns = value['patterns'];
  if (!Array.isArray(patterns) || patterns.length === 0) {
    throw new RequestValidationError(`${field}.patterns must be a non-empty array.`);
  }
  if (patterns.length > MAX_PATTERNS) {
    throw new RequestValidationError(
      `${field}.patterns must contain at most ${MAX_PATTERNS} items.`,
    );
  }
  const parsedPatterns = patterns.map((pattern, index) =>
    requireTrimmedString(pattern, `${field}.patterns[${index}]`, MAX_PATTERN_LENGTH),
  );

  const parser = value['parser'];
  if (typeof parser !== 'string' || !PARSERS.has(parser)) {
    throw new RequestValidationError(
      `${field}.parser must be one of ${[...PARSERS].join(', ')}.`,
    );
  }

  const normalization = value['normalization'] ?? 'strip';
  if (typeof normalization !== 'string' || !NORMALIZATIONS.has(normalization)) {
    throw new RequestValidationError(
      `${field}.normalization must be one of ${[...NORMALIZATIONS].join(', ')}.`,
    );
  }

  const fallback = value['fallback_field'] ?? null;
  if (fallback !== null && fallback !== 'payer' && fallback !== 'paid_amount') {
    throw new RequestValidationError(
      `${field}.fallback_field must be null, payer or paid_amount.`,
    );
  }

  return {
    strategy: 'regex',
    patterns: parsedPatterns,
    parser,
    normalization,
    fallback_field: fallback,
  };
}

/**
 * A configuração é uma union discriminada por `strategy`. A compatibilidade entre campo,
 * parser e normalização é regra de negócio do backend: aqui validamos só a forma, para o
 * 422 da API continuar sendo a fonte da verdade.
 */
function parseConfiguration(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new RequestValidationError(`${field} must be an object.`);
  }

  switch (value['strategy']) {
    case 'regex':
      return parseRegexConfiguration(value, field);
    case 'constant':
      return {
        strategy: 'constant',
        value: requireTrimmedString(value['value'], `${field}.value`, MAX_TEXT_LENGTH),
      };
    case 'not_found':
      return { strategy: 'not_found' };
    case 'source': {
      const extraction = value['extraction'];
      if (extraction !== undefined && extraction !== null && !isRecord(extraction)) {
        throw new RequestValidationError(`${field}.extraction must be an object or null.`);
      }
      return {
        strategy: 'source',
        identified_value: requireTrimmedString(
          value['identified_value'],
          `${field}.identified_value`,
          MAX_TEXT_LENGTH,
        ),
        matches: parseMappings(value['matches'], `${field}.matches`),
        extraction:
          extraction === undefined || extraction === null
            ? null
            : parseRegexConfiguration(extraction, `${field}.extraction`),
        mappings: parseMappings(value['mappings'], `${field}.mappings`),
      };
    }
    default:
      throw new RequestValidationError(
        `${field}.strategy must be one of regex, constant, not_found, source.`,
      );
  }
}

/**
 * `field_rules` também é coleção reconciliada: item com `id` atualiza, sem `id` cria, e o que
 * existe no banco mas não vier no array é apagado. Ausente no body = preservado.
 */
function parseFieldRules(
  value: unknown,
  options: { allowId: boolean } = { allowId: true },
): Array<Record<string, unknown>> | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new RequestValidationError('field_rules must be an array.');
  }
  if (value.length > MAX_RULES) {
    throw new RequestValidationError(
      `field_rules must contain at most ${MAX_RULES} items.`,
    );
  }

  const seen = new Set<string>();

  return value.map((item, index) => {
    const field = `field_rules[${index}]`;
    if (!isRecord(item)) {
      throw new RequestValidationError(`${field} must be an object.`);
    }

    const id = item['id'];
    if (id !== undefined && !options.allowId) {
      throw new RequestValidationError(
        `${field}.id is not accepted when creating a profile.`,
      );
    }
    if (id !== undefined && (typeof id !== 'string' || !id.trim())) {
      throw new RequestValidationError(`${field}.id must be a non-empty string.`);
    }

    const fieldName = item['field_name'];
    if (typeof fieldName !== 'string' || !FIELD_NAMES.has(fieldName)) {
      throw new RequestValidationError(`${field}.field_name is not a receipt field.`);
    }
    if (seen.has(fieldName)) {
      throw new RequestValidationError(
        `field_rules must not repeat the field ${fieldName}.`,
      );
    }
    seen.add(fieldName);

    const isActive = item['is_active'];
    if (typeof isActive !== 'boolean') {
      throw new RequestValidationError(`${field}.is_active must be a boolean.`);
    }

    return {
      ...(typeof id === 'string' ? { id } : {}),
      field_name: fieldName,
      configuration: parseConfiguration(item['configuration'], `${field}.configuration`),
      is_active: isActive,
    };
  });
}

/** Campos comuns a criação e atualização. `field_rules` é opcional: ausente = preservado. */
function parseSharedFields(body: Record<string, unknown>) {
  const fieldRules = parseFieldRules(body['field_rules']);

  return {
    name: requiredString(body, 'name'),
    is_active: requireBoolean(body, 'is_active'),
    identification_rules: parseIdentificationRules(
      body['identification_rules'],
      { allowId: true },
    ),
    ...(fieldRules ? { field_rules: fieldRules } : {}),
  };
}

export async function parseReceiptRulesCreateBody(
  request: Pick<Request, 'json'>,
): Promise<Record<string, unknown>> {
  const body = await readJsonObject(request);
  const fieldRules = parseFieldRules(body['field_rules'], { allowId: false });

  return {
    name: requiredString(body, 'name'),
    institution_id: requireInstitutionId(body),
    is_active: requireBoolean(body, 'is_active'),
    identification_rules: parseIdentificationRules(
      body['identification_rules'],
      { allowId: false },
    ),
    ...(fieldRules ? { field_rules: fieldRules } : {}),
  };
}

export async function parseReceiptRulesUpdateBody(
  request: Pick<Request, 'json'>,
): Promise<Record<string, unknown>> {
  const body = await readJsonObject(request);

  if (body['institution_id'] !== undefined) {
    throw new RequestValidationError(
      'institution_id is not editable; delete the profile and create a new one.',
    );
  }

  return parseSharedFields(body);
}

/**
 * O backend aceita `name`, `institution_id`, `is_active` e `scope` além dos campos de
 * paginação. `parseResourceFilterQuery` não serve: o union de campos é fechado.
 */
export function parseReceiptRulesFilterQuery(
  searchParams: URLSearchParams,
): Record<string, string> {
  const allowedFields = new Set([
    'page',
    'limit',
    'order_by',
    'clean_cache',
    'with_deleted',
    'name',
    'institution_id',
    'is_active',
    'scope',
  ]);
  const params: Record<string, string> = {};

  searchParams.forEach((value, field) => {
    if (!allowedFields.has(field)) {
      throw new RequestValidationError(`Unsupported query parameter: ${field}.`);
    }
    if (Object.hasOwn(params, field)) {
      throw new RequestValidationError(`${field} must not be repeated.`);
    }
    params[field] = value;
  });

  ['page', 'limit'].forEach((field) => {
    const value = params[field];
    if (
      value !== undefined &&
      (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
    ) {
      throw new RequestValidationError(`${field} must be a positive integer.`);
    }
  });

  ['clean_cache', 'with_deleted'].forEach((field) => {
    const value = params[field];
    if (value !== undefined && value !== 'true' && value !== 'false') {
      throw new RequestValidationError(`${field} must be true or false.`);
    }
  });

  const isActive = params.is_active;
  if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
    throw new RequestValidationError('is_active must be true or false.');
  }

  const scope = params.scope;
  if (scope !== undefined && scope !== 'system' && scope !== 'private') {
    throw new RequestValidationError('scope must be system or private.');
  }

  return params;
}