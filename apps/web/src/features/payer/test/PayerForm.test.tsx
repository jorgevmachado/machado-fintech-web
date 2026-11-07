import { fireEvent, render, screen } from '@testing-library/react';

import PayerForm from '../components/form/PayerForm';
import { Payer } from '../domain';

jest.mock('@fintech/ui', () => ({
  ...jest.requireActual('@fintech/ui'),
  useAlert: () => ({ showAlert: jest.fn() }),
}));

jest.mock('@fintech/i18n', () => ({
  ...jest.requireActual('@fintech/i18n'),
  useAppTranslation: () => ({
    locale: 'pt-BR',
    t: (key: string) => key,
  }),
}));

describe('PayerForm', () => {
  it('requires a name and submits the new payer', () => {
    const onSubmit = jest.fn();
    render(<PayerForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox', { name: /^finance\.payer\.name\.label/ }), {
      target: { value: 'Customer' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));

    expect(onSubmit).toHaveBeenCalledWith({ id: undefined, name: 'Customer' });
  });

  it('prefills the name, preserves the identifier when editing and supports cancellation', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const payer = Payer.create({
      id: 'payer-1',
      name: 'Customer',
      created_at: new Date('2026-01-01T00:00:00.000Z'),
    });
    render(<PayerForm item={payer} onSubmit={onSubmit} onCancel={onCancel} />);

    const input = screen.getByRole('textbox', { name: /^finance\.payer\.name\.label/ });
    expect(input).toHaveValue('Customer');
    fireEvent.change(input, { target: { value: 'Updated customer' } });
    fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));
    expect(onSubmit).toHaveBeenCalledWith({ id: 'payer-1', name: 'Updated customer' });

    fireEvent.click(screen.getByRole('button', { name: 'form.action.cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
