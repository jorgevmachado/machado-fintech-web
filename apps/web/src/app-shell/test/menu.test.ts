import { menu } from '../menu';

describe('application navigation menu', () => {
  it('exposes the main routes and grouped institution navigation', () => {
    expect(menu.map(({ href }) => href)).toEqual([
      '/home',
      '/receipt',
      '/payer',
      '/payment',
      '/beneficiary',
      '/category',
      '/institution',
    ]);
    expect(menu.at(-1)).toMatchObject({
      disabled: true,
      children: [
        { href: '/institution/source' },
        { href: '/institution/destination' },
      ],
    });
  });
});
