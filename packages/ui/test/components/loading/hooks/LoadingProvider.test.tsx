import type { ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';

import LoadingProvider from '../../../../src/components/loading/hooks/LoadingProvider';
import useLoading from '../../../../src/components/loading/hooks/useLoading';

function LoadingConsumer() {
  const {
    start,
    stop,
    stopAll,
    execute,
    startPageRender,
    stopPageRender,
    isLoading,
    isPageRendering,
  } = useLoading();

  return (
    <>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <button onClick={stopAll}>stopAll</button>
      <button onClick={startPageRender}>startPageRender</button>
      <button onClick={stopPageRender}>stopPageRender</button>

      <button
        onClick={() => {
          void execute(() => Promise.resolve('result'));
        }}
      >
        execute
      </button>

      <button
        onClick={() => {
          void execute(
            () => Promise.reject(new Error('Operation failed')),
          ).catch(() => undefined);
        }}
      >
        executeError
      </button>

      <span data-testid="is-loading">
        {String(isLoading)}
      </span>

      <span data-testid="is-page-rendering">
        {String(isPageRendering)}
      </span>
    </>
  );
}

function renderProvider(
  props: {
    service?: {
      variant?: 'bar' | 'circle' | 'dot';
    };
    pageRender?: {
      variant?: 'bar' | 'circle' | 'dot';
      progress?: boolean;
    };
    duration?: number;
  } = {},
) {
  return render(
    <LoadingProvider {...props}>
      <LoadingConsumer />
    </LoadingProvider>,
  );
}

describe('LoadingProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('service', () => {
    it('should start loading', () => {
      renderProvider({
        service: {
          variant: 'circle',
        },
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');

      expect(screen.getByRole('status'))
        .toBeInTheDocument();
    });

    it('should stop loading after the duration', () => {
      renderProvider({
        duration: 600,
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');

      act(() => {
        jest.advanceTimersByTime(599);
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
    });

    it('should stop loading immediately when stopAll is called', () => {
      renderProvider();

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');

      act(() => {
        screen.getByRole('button', {
          name: 'stopAll',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
    });

    it('should reset all active loading operations', () => {
      renderProvider();

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();

        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');

      act(() => {
        screen.getByRole('button', {
          name: 'stopAll',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
    });

    it('should clear the pending stop timer when starting again', () => {
      renderProvider({
        duration: 600,
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();

        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('true');
    });

    it('should ignore stop when there is no active loading', () => {
      renderProvider();

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');

      act(() => {
        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
    });

    it('should clear the pending loading timer when starting again', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      renderProvider({
        duration: 600,
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should clear the pending loading timer when stopAll is called', () => {
      renderProvider({
        duration: 600,
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      expect(jest.getTimerCount()).toBe(1);

      act(() => {
        screen.getByRole('button', {
          name: 'stopAll',
        }).click();
      });

      expect(jest.getTimerCount()).toBe(0);

      expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
    });

    describe('execute', () => {
      it('should start loading while the operation is running', async () => {
        let resolveOperation: (() => void) | undefined;

        const operation = new Promise<void>((resolve) => {
          resolveOperation = resolve;
        });

        render(
          <LoadingProvider>
            <LoadingConsumer />
          </LoadingProvider>,
        );

        act(() => {
          void useLoading;
          screen.getByRole('button', {
            name: 'execute',
          }).click();
        });

        expect(screen.getByTestId('is-loading'))
          .toHaveTextContent('true');

        await act(async () => {
          resolveOperation?.();
        });

        expect(screen.getByTestId('is-loading'))
          .toHaveTextContent('true');

        act(() => {
          jest.advanceTimersByTime(600);
        });

        expect(screen.getByTestId('is-loading'))
          .toHaveTextContent('false');
      });

      it('should stop loading after the operation completes', async () => {
        renderProvider();

        act(() => {
          screen.getByRole('button', {
            name: 'execute',
          }).click();
        });

        expect(screen.getByTestId('is-loading'))
          .toHaveTextContent('true');

        await act(async () => {
          await Promise.resolve();
        });

        act(() => {
          jest.advanceTimersByTime(600);
        });

        expect(screen.getByTestId('is-loading'))
          .toHaveTextContent('false');
      });

      it('should stop loading when the operation fails', async () => {
        renderProvider();

        act(() => {
          screen.getByRole('button', {
            name: 'executeError',
          }).click();
        });

        await act(async () => {
          await Promise.resolve();
        });

        act(() => {
          jest.advanceTimersByTime(600);
        });

        expect(screen.getByTestId('is-loading'))
        .toHaveTextContent('false');
      });
    });
  });

  describe('page render', () => {
    it('should start page rendering', () => {
      renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('false');

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      expect(screen.getByRole('status'))
        .toBeInTheDocument();
    });

    it('should complete page rendering after stopPageRender', () => {
      renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).toHaveClass('w-full');

      act(() => {
        jest.advanceTimersByTime(499);
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('false');

      expect(screen.queryByRole('status'))
        .not.toBeInTheDocument();
    });

    it('should not stop page rendering while there are active operations', () => {
      renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();

        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      act(() => {
        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('false');
    });

    it('should clear the pending completion timer when starting page render again', () => {
      renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();

        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');
    });

    it('should ignore stopPageRender when there is no active page render', () => {
      renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('false');

      act(() => {
        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('false');
    });
  });

  describe('defaults', () => {
    it('should not render service loading when service is not provided', () => {
      renderProvider();

      expect(screen.queryByRole('status'))
        .not.toBeInTheDocument();

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();
      });

      expect(screen.queryByRole('status'))
        .not.toBeInTheDocument();
    });

    it('should not render page loading when pageRender is not provided', () => {
      renderProvider();

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();
      });

      expect(screen.getByTestId('is-page-rendering'))
        .toHaveTextContent('true');

      expect(screen.queryByRole('status'))
        .not.toBeInTheDocument();
    });

    it('should clear the pending loading timer on unmount', () => {
      const { unmount } = renderProvider({
        duration: 600,
      });

      act(() => {
        screen.getByRole('button', {
          name: 'start',
        }).click();

        screen.getByRole('button', {
          name: 'stop',
        }).click();
      });

      expect(jest.getTimerCount()).toBe(1);

      unmount();

      expect(jest.getTimerCount()).toBe(0);
    });

    it('should clear the pending page render timer on unmount', () => {
      const { unmount } = renderProvider({
        pageRender: {
          variant: 'bar',
          progress: true,
        },
      });

      act(() => {
        screen.getByRole('button', {
          name: 'startPageRender',
        }).click();

        screen.getByRole('button', {
          name: 'stopPageRender',
        }).click();
      });

      expect(jest.getTimerCount()).toBe(1);

      unmount();

      expect(jest.getTimerCount()).toBe(0);
    });
  });
});