import { fireEvent, render, screen } from '@testing-library/react';

import ReceiptFieldRuleForm from '../components/form/receipt-field-rule-form';
import type { TReceiptFieldRuleSummary } from '../domain';

const mockShowAlert = jest.fn();

jest.mock('@fintech/ui', () => ({
  ...jest.requireActual('@fintech/ui'),
  useAlert: () => ({ showAlert: mockShowAlert }),
}));

jest.mock('@fintech/i18n', () => ({
  ...jest.requireActual('@fintech/i18n'),
  useAppTranslation: () => ({ locale: 'pt-BR', t: (key: string) => key }),
}));

function makeRule(
  overrides: Partial<TReceiptFieldRuleSummary> = {},
): TReceiptFieldRuleSummary {
  return {
    id: 'field-1',
    field_name: 'payer',
    configuration: {
      strategy: 'regex',
      patterns: ['Pagador: (?P<value>.+)'],
      parser: 'text',
      normalization: 'strip',
      fallback_field: null,
    },
    is_active: true,
    created_at: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

function save() {
  fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));
}

function patternsInput() {
  return screen.getByRole('textbox', {
    name: /^receipt\.rules\.field_rules\.patterns\.label/,
  });
}

describe('ReceiptFieldRuleForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('preserves the rule id and the parsed patterns when editing', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptFieldRuleForm
        item={makeRule()}
        usedFieldNames={['payer']}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    save();

    expect(onSubmit).toHaveBeenCalledWith({
      id: 'field-1',
      field_name: 'payer',
      configuration: {
        strategy: 'regex',
        patterns: ['Pagador: (?P<value>.+)'],
        parser: 'text',
        normalization: 'strip',
        fallback_field: null,
      },
      is_active: true,
    });
  });

  it('omits the id key when creating a new field rule', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptFieldRuleForm
        usedFieldNames={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.change(patternsInput(), {
      target: { value: 'Pagador: (?P<value>.+)' },
    });
    save();

    const [created] = jest.mocked(onSubmit).mock.calls[0]!;
    expect(created).not.toHaveProperty('id');
    expect(created.field_name).toBe('fine');
  });

  it('blocks the save when no pattern is provided', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptFieldRuleForm
        usedFieldNames={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    save();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'receipt.rules.field_rules.invalid' }),
    );
  });

  it('blocks the save when a pattern lacks the named group the backend requires', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptFieldRuleForm
        usedFieldNames={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.change(patternsInput(), { target: { value: 'Pagador: (.+)' } });
    save();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not offer a field that another rule of the profile already uses', () => {
    render(
      <ReceiptFieldRuleForm
        usedFieldNames={['payer', 'due_date']}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    const fieldSelect = screen.getByRole('combobox', {
      name: /^receipt\.rules\.field_rules\.field_name\.label/,
    });
    const offered = [...fieldSelect.querySelectorAll('option')].map(
      (option) => option.value,
    );

    expect(offered).not.toContain('payer');
    expect(offered).not.toContain('due_date');
    expect(offered).toContain('barcode');
  });

  it('keeps the edited field selectable even though its own name is already used', () => {
    render(
      <ReceiptFieldRuleForm
        item={makeRule()}
        usedFieldNames={['payer', 'due_date']}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    const fieldSelect = screen.getByRole('combobox', {
      name: /^receipt\.rules\.field_rules\.field_name\.label/,
    });
    const offered = [...fieldSelect.querySelectorAll('option')].map(
      (option) => option.value,
    );

    expect(offered).toContain('payer');
    expect(fieldSelect).toBeDisabled();
  });

  it('emits a constant configuration for source_institution without patterns', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptFieldRuleForm
        item={makeRule({
          field_name: 'source_institution',
          configuration: { strategy: 'constant', value: 'Nubank' },
        })}
        usedFieldNames={['source_institution']}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    save();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        configuration: { strategy: 'constant', value: 'Nubank' },
      }),
    );
  });
});