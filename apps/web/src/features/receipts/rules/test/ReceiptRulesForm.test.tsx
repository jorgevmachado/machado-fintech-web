import { fireEvent, render, screen, within } from '@testing-library/react';

import ReceiptRulesForm from '../components/form/ReceiptRulesForm';
import { ReceiptRules } from '../domain';

const mockShowAlert = jest.fn();

jest.mock('@fintech/ui', () => ({
  ...jest.requireActual('@fintech/ui'),
  useAlert: () => ({ showAlert: mockShowAlert }),
}));

jest.mock('@fintech/i18n', () => ({
  ...jest.requireActual('@fintech/i18n'),
  useAppTranslation: () => ({
    locale: 'pt-BR',
    t: (key: string, values?: Record<string, unknown>) =>
      key === 'receipt.rules.identification.item'
        ? `Rule ${values?.position}`
        : key,
  }),
}));

const institutionOption = {
  value: 'institution-1',
  label: 'Itaú Unibanco (ITAU_UNIBANCO)',
  disabled: false,
};

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useReceiptRulesOptions: () => ({
    institutions: [institutionOption],
    isLoading: false,
    error: null,
  }),
}));

function makeProfile(overrides: Partial<ReceiptRules> = {}): ReceiptRules {
  return ReceiptRules.create({
    id: 'profile-1',
    name: 'Itaú',
    institution_id: 'institution-1',
    institution_code: 'ITAU_UNIBANCO',
    scope: 'private',
    is_active: true,
    identification_rules: [
      { id: 'rule-1', pattern: 'Ita[úu]', weight: 100, is_active: true },
    ],
    field_rules: [],
    created_at: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  });
}

function save() {
  fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));
}

function patternInputs() {
  return screen.getAllByRole('textbox', {
    name: /^receipt\.rules\.identification\.pattern\.label/,
  });
}

describe('ReceiptRulesForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requires a non-empty pattern on every identification rule', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.change(patternInputs()[0]!, { target: { value: '   ' } });
    save();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(patternInputs()[0]).toHaveAttribute('aria-invalid', 'true');
    expect(mockShowAlert).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'receipt.rules.identification.invalid' }),
    );
  });

  it('requires a positive integer weight', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    const weight = screen.getByRole('spinbutton', {
      name: /^receipt\.rules\.identification\.weight\.label/,
    });
    fireEvent.change(weight, { target: { value: '0' } });
    save();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('preserves existing rule ids when saving an edit', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    save();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'profile-1',
        institution_id: 'institution-1',
        identification_rules: [
          { id: 'rule-1', pattern: 'Ita[úu]', weight: 100, is_active: true },
        ],
      }),
    );
  });

  it('omits the id key for a newly added identification rule', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'receipt.rules.identification.add' }),
    );
    const groups = screen.getAllByRole('group', { name: /Rule / });
    fireEvent.change(
      within(groups[1]!).getByRole('textbox', {
        name: /^receipt\.rules\.identification\.pattern\.label/,
      }),
      { target: { value: 'Nubank' } },
    );
    save();

    const [created] = jest.mocked(onSubmit).mock.calls[0]!;
    expect(created.identification_rules[1]).not.toHaveProperty('id');
    expect(created.identification_rules[1]).toMatchObject({
      pattern: 'Nubank',
      weight: 100,
    });
  });

  it('converts the active switch into a strict boolean', () => {
    const onSubmit = jest.fn();
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('switch'));
    save();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: false }),
    );
  });

  it('shows the institution code next to the institution name', () => {
    render(
      <ReceiptRulesForm
        item={makeProfile()}
        profiles={[]}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('option', { name: 'Itaú Unibanco (ITAU_UNIBANCO)' }),
    ).toBeTruthy();
  });
});