import { menu } from '../menu';

describe('application navigation menu', () => {
  it('exposes every main route in the order the sidebar renders them', () => {
    expect(menu.map(({ href }) => href)).toEqual([
      '/home',
      '/account',
      '/credit-card',
      '/payer',
      '/receipt',
      '/payment',
      '/transaction',
      '/beneficiary',
      '/category',
      '/institution',
    ]);
  });

  it('links the payments entry to its translated label and icon', () => {
    expect(menu).toContainEqual({
      href: '/payment',
      icon: 'wallet',
      label: 'navigation.payment',
    });
  });

  it('keeps institution as the last entry', () => {
    expect(menu.at(-1)).toMatchObject({
      href: '/institution',
    });
  });
});