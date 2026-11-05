import { buildButtonPaginationTheme } from '../../src';

describe('Pagination Theme', () => {
  it('render with isCurrent and disabled equal false', () => {
    const result =  buildButtonPaginationTheme();
    expect(result).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 cursor-pointer'
    );
  });

  it('render with isCurrent equal true and disabled equal false', () => {
    const result =  buildButtonPaginationTheme(true);
    expect(result).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-blue-600 bg-blue-600 text-white cursor-pointer'
    );
  });

  it('render with isCurrent equal false and disabled equal true', () => {
    const render = buildButtonPaginationTheme(false, true);
    expect(render).toEqual(
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-700'
    );
  });
});