import { render } from '@testing-library/react';
import { Form, type FormProps } from '@fintech/ui';

import CreditCardForm from '../components/form/CreditCardForm';
import { CreditCard } from '../domain';
import { creditCardApiDataToDomain } from '../mappers/credit-card.mapper';

jest.mock('@fintech/ui', () => ({
  Form: jest.fn(() => null),
  useAlert: () => ({ showAlert: jest.fn() }),
}));

function initialValues() {
  const props: FormProps | undefined = jest.mocked(Form).mock.calls.at(-1)?.[0];
  if (!props?.initialValues) throw new Error('Expected form initial values');
  return props.initialValues;
}

describe('CreditCardForm initial values', () => {
  it('does not submit when required data is missing', () => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} onCancel={jest.fn()} />);
    const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
    props?.onSuccess?.({ brand: 'VISA', due_day: '15', closing_day: '5' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('converts required fields into the persistence payload', () => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} onCancel={jest.fn()} />);
    const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
    props?.onSuccess?.({ name: 'Card', brand: 'VISA', due_day: '15', closing_day: '5' });
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Card', brand: 'VISA', due_day: 15, closing_day: 5, is_active: true,
    }));
  });

  it.each([50, 20.1, 0, undefined])('preserves decimal limit %s when editing and submitting without changes', (limit) => {
    const onSubmit = jest.fn();
    const item = CreditCard.create({
      id: 'card-1',
      name: 'Card',
      brand: 'VISA',
      due_day: 15,
      closing_day: 5,
      limit,
      is_active: true,
      created_at: new Date('2026-01-01T00:00:00Z'),
    });
    render(<CreditCardForm item={item} onSubmit={onSubmit} onCancel={jest.fn()} />);

    expect(initialValues()).toMatchObject({
      due_day: '15',
      closing_day: '5',
      limit: limit === undefined ? '' : limit.toFixed(2),
    });
    expect(Object.values(initialValues()).every((value) => typeof value === 'string')).toBe(true);

    const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
    props?.onSuccess?.(initialValues());
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ limit }));
  });

  it.each<[string, number]>([
    ['$50.00', 50],
    ['R$ 20,10', 20.1],
  ])('submits formatted limit %s as the decimal number %s', (formatted, limit) => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
    props?.onSuccess?.({
      name: 'Card', brand: 'VISA', due_day: '15', closing_day: '5', limit: formatted,
    });

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ limit }));
  });

  it.each<[string, number]>([
    ['50.00', 50],
    ['20.10', 20.1],
  ])('edits API decimal string %s without crashing or changing its value', (limit, expected) => {
    const item = creditCardApiDataToDomain({
      id: 'card-1',
      name: 'Card',
      brand: 'VISA',
      due_day: 15,
      closing_day: 5,
      limit,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    });
    const onSubmit = jest.fn();
    render(<CreditCardForm item={item} onSubmit={onSubmit} onCancel={jest.fn()} />);

    expect(initialValues().limit).toBe(expected.toFixed(2));
    const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
    props?.onSuccess?.(initialValues());
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ limit: expected }));
  });

  it('starts numeric fields empty when creating a card', () => {
    render(<CreditCardForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(initialValues()).toMatchObject({ due_day: '', closing_day: '', limit: '' });
  });
});
