import {
  renderHook,
} from '@testing-library/react';

import { useUI } from '../../../src/providers/ui-context';
import { UIContext } from '../../../src/providers/ui-context/UIContext';

describe('useUI', () => {
  it('should return the UI context', () => {
    const context = {
      locale: 'pt-BR' as const,
    };

    const { result } = renderHook(
      () => useUI(),
      {
        wrapper: ({ children }) => (
          <UIContext.Provider value={context}>
            {children}
          </UIContext.Provider>
        ),
      },
    );

    expect(result.current).toEqual(context);
  });

  it('should throw when used outside UIContextProvider', () => {
    expect(() =>
      renderHook(() => useUI()),
    ).toThrow(
      'useUI must be used within UIContextProvider.',
    );
  });
});