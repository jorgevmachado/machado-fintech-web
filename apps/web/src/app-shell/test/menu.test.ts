import { menu } from '../menu';

describe('application navigation menu', () => {
  it('exposes every top-level route in the order the sidebar renders them', () => {
    expect(menu.map(({ href }) => href)).toEqual([
      '/home',
      '/account',
      '/credit-card',
      '/payer',
      '/receipt',
      '/transaction',
      '/beneficiary',
      '/category',
      '/institution',
    ]);
  });

  it('nests payments and receipt rules under receipts', () => {
    const receipt = menu.find(({ href }) => href === '/receipt');

    expect(receipt?.children?.map(({ href }) => href)).toEqual([
      '/payment',
      '/receipt/rules',
    ]);
  });

  it('links the receipt rules entry to its translated label and icon', () => {
    const receipt = menu.find(({ href }) => href === '/receipt');

    expect(receipt?.children).toContainEqual({
      href: '/receipt/rules',
      icon: 'receipt',
      label: 'navigation.receiptRules',
    });
  });

  it('keeps institution as the last entry', () => {
    expect(menu.at(-1)).toMatchObject({
      href: '/institution',
    });
  });
});