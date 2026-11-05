import { renderHook } from '@testing-library/react';

import useLoading from '../../../../src/components/loading/hooks/useLoading';
import { LoadingContext } from '../../../../src/components/loading/hooks/LoadingContext';

describe('useLoading', () => {
  describe('without provider', () => {
    it('should throw an error', () => {
      expect(() => {
        renderHook(() => useLoading());
      }).toThrow(
        'useLoading must be used within a LoadingProvider',
      );
    });
  });

  describe('with provider', () => {
    it('should return the loading context', () => {
      const contextValue = {
        start: jest.fn(),
        stop: jest.fn(),
        stopAll: jest.fn(),
        isLoading: false,
        startPageRender: jest.fn(),
        stopPageRender: jest.fn(),
        isPageRendering: false,
      };

      const wrapper = ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <LoadingContext.Provider value={contextValue}>
          {children}
        </LoadingContext.Provider>
      );

      const { result } = renderHook(
        () => useLoading(),
        { wrapper },
      );

      expect(result.current).toBe(contextValue);
    });
  });
});