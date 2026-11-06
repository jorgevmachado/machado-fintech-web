import { render, screen } from '@testing-library/react';

import CreditCardList from '../components/list/CreditCardList';
import { CreditCard } from '../domain';

jest.mock('@fintech/ui', () => ({
  Icon: () => null,
  Lang: () => null,
}));

jest.mock('@/src/components', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('CreditCardList limits', () => {
  it.each<[number | undefined, string]>([
    [50, '50,00'],
    [20.1, '20,10'],
    [0, '0,00'],
    [undefined, '-'],
  ])('displays decimal limit %s without converting it from cents', (limit, expected) => {
    const card = CreditCard.create({
      id: 'card-1',
      name: 'Card',
      brand: 'VISA',
      due_day: 15,
      closing_day: 5,
      limit,
      is_active: true,
      created_at: new Date('2026-01-01T00:00:00Z'),
    });

    render(<CreditCardList items={[card]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/Limite:/).textContent).toContain(
      limit === undefined ? 'Limite: -' : `R$\u00a0${expected}`,
    );
  });
});
