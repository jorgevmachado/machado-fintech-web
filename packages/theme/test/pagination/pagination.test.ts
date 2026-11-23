import { buildButtonPaginationTheme } from '../../src';

describe('Pagination Theme', () => {
  it('render with isCurrent and disabled equal false', () => {
    const result =  buildButtonPaginationTheme();
    expect(result).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] cursor-pointer hover:border-[color:var(--app-accent-border,#3b82f6)] hover:text-[color:var(--app-accent,#1d4ed8)]'
    );
  });

  it('render with isCurrent equal true and disabled equal false', () => {
    const result =  buildButtonPaginationTheme(true);
    expect(result).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-[color:var(--app-accent-border,#3b82f6)] bg-blue-600 text-white cursor-pointer'
    );
  });

  it('render with isCurrent equal false and disabled equal true', () => {
    const render = buildButtonPaginationTheme(false, true);
    expect(render).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] cursor-not-allowed opacity-50'
    );
  });
});