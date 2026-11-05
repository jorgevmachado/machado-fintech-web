import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import { useAlert, AlertProvider } from '../../../../src';

describe('useAlert', () => {
  it('throws when used outside of AlertProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BadConsumer = () => {
      useAlert();
      return null;
    };

    expect(() => render(<BadConsumer />)).toThrow('useAlert must be used within an AlertProvider.');

    consoleError.mockRestore();
  });

  it('returns context when inside AlertProvider', () => {
    const Consumer = () => {
      const ctx = useAlert();
      return <span>{typeof ctx.showAlert}</span>;
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('showAlert uses default durationMs when not provided', () => {
    jest.useFakeTimers();

    const Consumer = () => {
      const { showAlert } = useAlert();
      return <button onClick={() => showAlert({ message: 'Default duration' })}>Show</button>;
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Default duration')).toBeInTheDocument();

    // Default is 4200ms; advance past it
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.queryByText('Default duration')).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});