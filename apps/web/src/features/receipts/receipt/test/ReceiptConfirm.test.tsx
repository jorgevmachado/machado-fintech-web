import { act, fireEvent, render, screen } from '@testing-library/react';

import ReceiptConfirm from '../components/confirm/ReceiptConfirm';
import type { TReceiptPersist } from '../domain';

const mockShowAlert = jest.fn();

jest.mock('@fintech/ui', () => ({
  ...jest.requireActual('@fintech/ui'),
  useAlert: () => ({ showAlert: mockShowAlert }),
  useUser: () => ({ user: { name: 'Maria Souza' } }),
}));

jest.mock('@fintech/i18n', () => ({
  ...jest.requireActual('@fintech/i18n'),
  useAppTranslation: () => ({ locale: 'pt-BR', t: (key: string) => key }),
}));

const receipt: TReceiptPersist = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: '',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: new Date('2026-11-02T00:00:00.000Z'),
  due_date: new Date('2026-11-10T00:00:00.000Z'),
  source_institution: 'Nubank',
};

const accountsOptions = [
  { value: '3b3f1c1e-1111-4222-8333-444455556666', label: 'Conta Corrente' },
];
const subcategoryOptions = [
  { value: '56f17ac3-10b3-4c07-a92c-820ce6e63436', label: 'Internet' },
];

function renderConfirm(onSubmit = jest.fn().mockResolvedValue(undefined)) {
  render(
    <ReceiptConfirm
      item={receipt}
      onSubmit={onSubmit}
      onCancel={jest.fn()}
      accountsOptions={accountsOptions}
      creditCardsOptions={[]}
      subcategoryOptions={subcategoryOptions}
    />,
  );

  return onSubmit;
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'receipt.confirm.action' }));
}

/** Escolhe a conta no autocomplete: foca, digita e clica na opção da lista. */
function chooseAccount(label = 'Conta Corrente') {
  const combobox = screen.getByRole('combobox', { name: /Conta/i });
  fireEvent.focus(combobox);
  fireEvent.change(combobox, { target: { value: label } });
  fireEvent.mouseDown(screen.getByRole('option', { name: label }));
}

describe('ReceiptConfirm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does not submit while the account is not chosen', () => {
    const onSubmit = renderConfirm();

    submit();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('refuses free text in the account field instead of sending an invalid id', () => {
    const onSubmit = renderConfirm();

    const combobox = screen.getByRole('combobox', { name: /Conta/i });
    fireEvent.focus(combobox);
    fireEvent.change(combobox, { target: { value: 'Conta que não existe' } });
    submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Selecione uma conta da lista.',
    }));
  });

  it('submits the confirmation payload built from the receipt and the chosen account', async () => {
    const onSubmit = renderConfirm();

    chooseAccount();
    await act(async () => { submit(); });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [payload] = onSubmit.mock.calls[0]!;
    expect(payload).toEqual(expect.objectContaining({
      id: receipt.id,
      name: 'Claro Net',
      account_id: accountsOptions[0]!.value,
      subcategory_id: receipt.subcategory_id,
      transaction_kind: 'SIMPLE',
      direction: 'OUT',
    }));
    expect(payload.expected_on).toEqual(receipt.due_date);
  });

  it('fills the required payer with the logged user when the receipt has none', async () => {
    const onSubmit = renderConfirm();

    chooseAccount();
    await act(async () => { submit(); });

    const [payload] = onSubmit.mock.calls[0]!;
    expect(payload.payer).toBe('Maria Souza');
  });

  it('blocks a second submit while the first one is in flight', async () => {
    let release: () => void = () => {};
    const pending = new Promise<void>((resolve) => { release = resolve; });
    const onSubmit = renderConfirm(jest.fn(() => pending));

    chooseAccount();
    // Captura o nó antes do clique: durante o envio o botão troca o rótulo pelo de loading.
    const button = screen.getByRole('button', { name: 'receipt.confirm.action' });
    await act(async () => { fireEvent.click(button); });
    await act(async () => { fireEvent.click(button); });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();

    // Resolver dentro de `act` mantém o `setIsSubmitting(false)` do `finally` fora do warning.
    await act(async () => { release(); });
  });

  it('shows the validation message when required fields are empty', () => {
    render(
      <ReceiptConfirm
        item={{ ...receipt, beneficiary: '' }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        accountsOptions={accountsOptions}
        creditCardsOptions={[]}
        subcategoryOptions={subcategoryOptions}
      />,
    );

    submit();

    expect(mockShowAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'form.validation.required',
    }));
  });
});