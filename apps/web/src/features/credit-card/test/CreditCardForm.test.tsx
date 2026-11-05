import { render } from '@testing-library/react';
import { Form, type FormProps } from '@fintech/ui';

import CreditCardForm from '../components/form/CreditCardForm';
import { CreditCard } from '../domain';

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

  it.each([125000, 0, undefined])('converts numeric fields to strings, preserving limit %s', (limit) => {
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
    render(<CreditCardForm item={item} onSubmit={jest.fn()} onCancel={jest.fn()} />);

    expect(initialValues()).toMatchObject({
      due_day: '15',
      closing_day: '5',
      limit: limit === undefined ? '' : String(limit),
    });
    expect(Object.values(initialValues()).every((value) => typeof value === 'string')).toBe(true);
  });

  it('starts numeric fields empty when creating a card', () => {
    render(<CreditCardForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(initialValues()).toMatchObject({ due_day: '', closing_day: '', limit: '' });
  });
});
