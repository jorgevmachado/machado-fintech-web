import { buildBadgeTheme, getBadgeRandomTone } from '../../src';

describe('Badge theme', () => {
  afterEach(() => jest.restoreAllMocks());

  it('composes the default size, shape and soft primary tone without empty classes', () => {
    expect(buildBadgeTheme({})).toBe(
      'inline-flex items-center justify-center gap-1 font-semibold leading-none h-6 px-2.5 text-xs rounded-full bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)]',
    );
  });

  it.each([
    {
      params: {
        size: 'lg', shape: 'rounded', variant: 'solid', tone: 'success', className: 'custom-badge',
      } as const,
      expected: 'h-7 px-3 text-sm rounded-md bg-emerald-500 text-white custom-badge',
    },
    {
      params: { size: 'sm', shape: 'pill', variant: 'outline', tone: 'danger' } as const,
      expected: 'h-5 px-2 text-xs rounded-full border border-[color:var(--app-negative,#dc2626)] bg-transparent text-[color:var(--app-negative-strong,#991b1b)]',
    },
  ])('composes $params.variant classes for $params.tone with the requested size and shape', ({ params, expected }) => {
    expect(buildBadgeTheme(params)).toBe(
      `inline-flex items-center justify-center gap-1 font-semibold leading-none ${expected}`,
    );
  });

  it('can select the first and last supported tones without overflowing the palette', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1 - Number.EPSILON);

    expect(getBadgeRandomTone()).toBe('default');
    expect(getBadgeRandomTone()).toBe('inherit');
  });

  it('falls back to primary when the random index is outside the palette', () => {
    jest.spyOn(Math, 'random').mockReturnValue(1);

    expect(getBadgeRandomTone()).toBe('primary');
  });

  it('overrides the supplied tone with a random tone while respecting the variant', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const classes = buildBadgeTheme({ random: true, tone: 'danger', variant: 'solid' });

    expect(classes).toContain('bg-emerald-500 text-white');
    expect(classes).not.toContain('bg-red-500');
  });

  it('keeps the supplied tone and does not draw a random tone when random is disabled', () => {
    const random = jest.spyOn(Math, 'random');

    expect(buildBadgeTheme({ tone: 'warning', random: false })).toContain(
      'bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] text-[color:var(--app-warning-strong,#92400e)]',
    );
    expect(random).not.toHaveBeenCalled();
  });
});
