import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { buildAlertId } from '../../../../src/components/alert/hooks/business';

import { AlertProvider, AlertContext } from '../../../../src/components/alert/hooks';

jest.mock('../../../../src/components/alert/hooks/business', () => ({
  ...jest.requireActual('../../../../src/components/alert/hooks/business'),
  buildAlertId: jest.fn(),
}));

jest.mock('../../../../src/components/alert/Alert', () => {
  return function MockAlert({
    title,
    description,
    variant,
    onClose,
  }: {
    title: string;
    description?: string;
    variant: string;
    onClose: () => void;
  }) {
    return (
      <div data-testid="alert">
        <span data-testid="alert-title">{title}</span>
        {description && (
          <span data-testid="alert-description">{description}</span>
        )}
        <span data-testid="alert-variant">{variant}</span>
        <button
          type="button"
          data-testid="alert-close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    );
  };
});

const mockedBuildAlertId = jest.mocked(buildAlertId);

const TestConsumer = () => {
  const {
    alerts,
    showAlert,
    clearAlerts,
    dismissAlert,
  } = React.useContext(AlertContext);

  return (
    <div>
      <span data-testid="alert-count">{alerts.length}</span>

      <button
        type="button"
        data-testid="show-alert"
        onClick={() =>
          showAlert({
            title: 'Alert title',
            message: 'Alert message',
            variant: 'success',
            duration: 5000,
          })
        }
      >
        Show alert
      </button>

      <button
        type="button"
        data-testid="show-default-alert"
        onClick={() =>
          showAlert({
            message: 'Default alert',
          })
        }
      >
        Show default alert
      </button>

      <button
        type="button"
        data-testid="show-zero-duration-alert"
        onClick={() =>
          showAlert({
            message: 'Zero duration alert',
            duration: 0,
          })
        }
      >
        Show zero duration alert
      </button>

      <button
        type="button"
        data-testid="show-bottom-left-alert"
        onClick={() =>
          showAlert({
            message: 'Bottom left alert',
            position: 'bottom-left',
          })
        }
      >
        Show bottom left alert
      </button>

      <button
        type="button"
        data-testid="dismiss-alert"
        onClick={() => {
          const alert = alerts[0];

          if (alert) {
            dismissAlert(alert.id);
          }
        }}
      >
        Dismiss alert
      </button>

      <button
        type="button"
        data-testid="dismiss-missing-alert"
        onClick={() => dismissAlert('missing-alert')}
      >
        Dismiss missing alert
      </button>

      <button
        type="button"
        data-testid="clear-alerts"
        onClick={clearAlerts}
      >
        Clear alerts
      </button>
    </div>
  );
};

const ServiceAlertConsumer = () => {
  const {
    alerts,
    executeServiceAlert,
  } = React.useContext(AlertContext);

  return (
    <div>
      <span data-testid="service-alert-count">{alerts.length}</span>

      <button
        type="button"
        data-testid="service-alert-success"
        onClick={() =>
          executeServiceAlert({
            isOk: true,
            type: 'payment',
          })
        }
      >
        Success
      </button>

      <button
        type="button"
        data-testid="service-alert-error"
        onClick={() =>
          executeServiceAlert({
            isOk: false,
            type: 'payment',
          })
        }
      >
        Error
      </button>

      <button
        type="button"
        data-testid="service-alert-custom-message"
        onClick={() =>
          executeServiceAlert({
            isOk: true,
            type: 'payment',
            message: 'Custom message',
          })
        }
      >
        Custom message
      </button>

      <button
        type="button"
        data-testid="service-alert-prefix"
        onClick={() =>
          executeServiceAlert({
            isOk: false,
            type: 'payment',
            messagePrefix: 'finance.payment',
          })
        }
      >
        Prefix
      </button>

      <button
        type="button"
        data-testid="service-alert-custom-error"
        onClick={() =>
          executeServiceAlert({
            isOk: false,
            type: 'payment',
            errorMessage: 'Custom error message',
          })
        }
      >
        Custom error
      </button>

      <button
        type="button"
        data-testid="service-alert-custom-success"
        onClick={() =>
          executeServiceAlert({
            isOk: true,
            type: 'payment',
            successMessage: 'Custom success message',
          })
        }
      >
        Custom success
      </button>

      <button
        type="button"
        data-testid="service-alert-none"
        onClick={() =>
          executeServiceAlert({
            isOk: true,
            type: 'payment',
            alert: 'none',
          })
        }
      >
        None
      </button>

      <button
        type="button"
        data-testid="service-alert-only-success"
        onClick={() =>
          executeServiceAlert({
            isOk: false,
            type: 'payment',
            alert: 'success',
          })
        }
      >
        Only success
      </button>

      <button
        type="button"
        data-testid="service-alert-only-error"
        onClick={() =>
          executeServiceAlert({
            isOk: true,
            type: 'payment',
            alert: 'error',
          })
        }
      >
        Only error
      </button>
    </div>
  );
};

const renderServiceAlertProvider = () => {
  return render(
    <AlertProvider>
      <ServiceAlertConsumer />
    </AlertProvider>,
  );
};

const renderProvider = () => {
  return render(
    <AlertProvider>
      <TestConsumer />
    </AlertProvider>,
  );
};

describe('AlertProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedBuildAlertId.mockReset();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render children', () => {
    render(
      <AlertProvider>
        <span data-testid="children">Children</span>
      </AlertProvider>,
    );

    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('should show an alert', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert-title')).toHaveTextContent(
      'Alert title',
    );
    expect(screen.getByTestId('alert-description')).toHaveTextContent(
      'Alert message',
    );
    expect(screen.getByTestId('alert-variant')).toHaveTextContent(
      'success',
    );
    expect(screen.getByTestId('alert-count')).toHaveTextContent('1');
  });

  it('should return the generated alert id when showing an alert', () => {
    mockedBuildAlertId.mockReturnValue('alert-123');

    const showAlert = jest.fn();

    const Consumer = () => {
      const { showAlert: contextShowAlert } =
        React.useContext(AlertContext);

      return (
        <button
          type="button"
          data-testid="show"
          onClick={() => {
            const id = contextShowAlert({
              message: 'Test alert',
            });

            showAlert(id);
          }}
        >
          Show
        </button>
      );
    };

    render(
      <AlertProvider>
        <Consumer />
      </AlertProvider>,
    );

    act(() => {
      screen.getByTestId('show').click();
    });

    expect(showAlert).toHaveBeenCalledWith('alert-123');
  });

  it('should use info as the default variant', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-default-alert').click();
    });

    expect(screen.getByTestId('alert-variant')).toHaveTextContent(
      'info',
    );
  });

  it('should use top-right as the default position', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-default-alert').click();
    });

    const alert = screen.getByTestId('alert');
    const stack = alert.parentElement as HTMLElement;
    const overlay = stack.parentElement as HTMLElement;

    expect(stack).toBeTruthy();
    expect(overlay).toBeTruthy();
    expect(overlay.style.position).toBe('fixed');
    expect(stack.style.position).toBe('absolute');
    expect(stack.style.top).toBe('16px');
    expect(stack.style.right).toBe('16px');
  });

  it('should render the alert in a custom position', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-bottom-left-alert').click();
    });

    const alert = screen.getByTestId('alert');
    const stack = alert.parentElement as HTMLElement;

    expect(stack).toBeTruthy();
    expect(stack.style.bottom).toBe('16px');
    expect(stack.style.left).toBe('16px');
    expect(stack.style.top).toBe('');
    expect(stack.style.right).toBe('');
  });

  it('should remove the alert after the configured duration', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('1');

    act(() => {
      jest.advanceTimersByTime(4999);
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('1');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should not schedule a dismissal when duration is zero', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-zero-duration-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('1');
  });

  it('should dismiss an alert', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();

    act(() => {
      screen.getByTestId('dismiss-alert').click();
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should ignore dismissal when the alert has no scheduled timeout', () => {
    renderProvider();

    act(() => {
      screen.getByTestId('dismiss-missing-alert').click();
    });

    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should clear all alerts', () => {
    mockedBuildAlertId
    .mockReturnValueOnce('alert-1')
    .mockReturnValueOnce('alert-2');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
      screen.getByTestId('show-default-alert').click();
    });

    expect(screen.getAllByTestId('alert')).toHaveLength(2);
    expect(screen.getByTestId('alert-count')).toHaveTextContent('2');

    act(() => {
      screen.getByTestId('clear-alerts').click();
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should cancel the timeout when dismissing an alert', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();

    act(() => {
      screen.getByTestId('dismiss-alert').click();
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should dismiss the alert when Alert onClose is called', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-alert').click();
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();

    act(() => {
      screen.getByTestId('alert-close').click();
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
  });

  it('should display the message as title when alert has no title', () => {
    mockedBuildAlertId.mockReturnValue('alert-1');

    renderProvider();

    act(() => {
      screen.getByTestId('show-default-alert').click();
    });

    expect(screen.getByTestId('alert-title')).toHaveTextContent(
      'Default alert',
    );

    expect(
      screen.queryByTestId('alert-description'),
    ).not.toBeInTheDocument();
  });

  describe('serviceAlert', () => {
    it('should use the provided message', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-custom-message').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Custom message',
      );
    });
    it('should use the provided error message', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-custom-error').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Custom error message',
      );

      expect(screen.getByTestId('alert-variant')).toHaveTextContent(
        'error',
      );
    });
    it('should use the provided success message', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-custom-success').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Custom success message',
      );

      expect(screen.getByTestId('alert-variant')).toHaveTextContent(
        'success',
      );
    });
    it('should use the default error message when no message or prefix is provided', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-error').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Error to fetch data payment',
      );
    });
    it('should use the default success message when no message or prefix is provided', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-success').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Success to fetch data payment',
      );
    });
    it('should use the default success message when no message or prefix is provided', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-success').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Success to fetch data payment',
      );
    });
    it('should build the success message using message prefix', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      const Consumer = () => {
        const { executeServiceAlert } = React.useContext(AlertContext);

        return (
          <button
            type="button"
            data-testid="execute"
            onClick={() =>
              executeServiceAlert({
                isOk: true,
                type: 'list',
                messagePrefix: 'finance.payment',
              })
            }
          >
            Execute
          </button>
        );
      };

      render(
        <AlertProvider>
          <Consumer />
        </AlertProvider>,
      );

      act(() => {
        screen.getByTestId('execute').click();
      });

      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'finance.payment.list.success',
      );
    });
    it('should not show an alert when alert is none', () => {
      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-none').click();
      });

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
      expect(screen.getByTestId('service-alert-count')).toHaveTextContent(
        '0',
      );
    });
    it('should not show an error when alert is success only', () => {
      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-only-success').click();
      });

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
    it('should not show a success alert when alert is error only', () => {
      renderServiceAlertProvider();

      act(() => {
        screen.getByTestId('service-alert-only-error').click();
      });

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
    it('should show a success alert when alert is success only', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      const Consumer = () => {
        const { executeServiceAlert } = React.useContext(AlertContext);

        return (
          <button
            type="button"
            data-testid="execute"
            onClick={() =>
              executeServiceAlert({
                isOk: true,
                type: 'payment',
                alert: 'success',
              })
            }
          >
            Execute
          </button>
        );
      };

      render(
        <AlertProvider>
          <Consumer />
        </AlertProvider>,
      );

      act(() => {
        screen.getByTestId('execute').click();
      });

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-variant')).toHaveTextContent(
        'success',
      );
    });
    it('should show a success alert when alert is success only', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      const Consumer = () => {
        const { executeServiceAlert } = React.useContext(AlertContext);

        return (
          <button
            type="button"
            data-testid="execute"
            onClick={() =>
              executeServiceAlert({
                isOk: true,
                type: 'payment',
                alert: 'success',
              })
            }
          >
            Execute
          </button>
        );
      };

      render(
        <AlertProvider>
          <Consumer />
        </AlertProvider>,
      );

      act(() => {
        screen.getByTestId('execute').click();
      });

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-variant')).toHaveTextContent(
        'success',
      );
    });
    it('should use defaultAlert when alert is not provided', () => {
      mockedBuildAlertId.mockReturnValue('alert-1');

      const Consumer = () => {
        const { executeServiceAlert } = React.useContext(AlertContext);

        return (
          <button
            type="button"
            data-testid="execute"
            onClick={() =>
              executeServiceAlert({
                isOk: true,
                type: 'payment',
                defaultAlert: 'none',
              })
            }
          >
            Execute
          </button>
        );
      };

      render(
        <AlertProvider>
          <Consumer />
        </AlertProvider>,
      );

      act(() => {
        screen.getByTestId('execute').click();
      });

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });
});