import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form, useAlert, type FormProps } from '@fintech/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import JoinPage from '../pages/JoinPage';
import { loginAction, registerAction } from '../actions';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@fintech/ui', () => ({
  Button: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  ),
  Form: jest.fn(() => null),
  Lang: ({ langKey }: { langKey: string }) => <span>{langKey}</span>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}));

jest.mock('../actions', () => ({
  loginAction: jest.fn(),
  registerAction: jest.fn(),
}));

function formProps(): FormProps {
  const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
  if (!props) {
    throw new Error('Expected the auth form to be rendered.');
  }
  return props;
}

describe('JoinPage', () => {
  const push = jest.fn();
  const showAlert = jest.fn();
  let searchParams = new URLSearchParams();

  beforeEach(() => {
    searchParams = new URLSearchParams();
    jest.mocked(usePathname).mockReturnValue('/join');
    jest.mocked(useRouter).mockReturnValue({ push } as never);
    jest.mocked(useSearchParams).mockImplementation(() => searchParams as never);
    jest.mocked(useAlert).mockReturnValue({ showAlert } as never);
  });

  afterEach(() => jest.resetAllMocks());

  it('defaults to login and shows the login action result', async () => {
    jest.mocked(loginAction).mockResolvedValueOnce({
      status: 'error',
      message: 'Invalid credentials',
    });
    render(<JoinPage />);

    expect(screen.getByText('auth.login.title')).toBeTruthy();
    expect(formProps().fields).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'mode', value: 'login', hidden: true }),
    ]));
    await formProps().onSuccess?.({ email: 'user@example.com' });
    expect(loginAction).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(showAlert).toHaveBeenCalledWith({
      variant: 'error',
      message: 'Invalid credentials',
      position: 'top-right',
    });
  });

  it('switches between login and register modes and updates the URL', () => {
    render(<JoinPage />);

    fireEvent.click(screen.getByRole('button'));
    expect(push).toHaveBeenCalledWith('/join?mode=register');
    expect(screen.getByText('auth.register.title')).toBeTruthy();
    expect(formProps().fields).toHaveLength(7);

    fireEvent.click(screen.getByRole('button'));
    expect(push).toHaveBeenLastCalledWith('/join?mode=login');
    expect(screen.getByText('auth.login.title')).toBeTruthy();
  });

  it('registers successfully then switches to login and reports validation errors', async () => {
    searchParams = new URLSearchParams('mode=register&next=%2Fhome');
    jest.mocked(registerAction).mockResolvedValueOnce({
      status: 'success',
      message: 'Registration complete',
    });
    render(<JoinPage />);

    await act(async () => {
      await formProps().onSuccess?.({ name: 'New user' });
    });
    expect(registerAction).toHaveBeenCalledWith({ name: 'New user' });
    expect(showAlert).toHaveBeenCalledWith({
      variant: 'success',
      message: 'Registration complete',
      position: 'top-right',
    });
    expect(push).toHaveBeenCalledWith('/join?mode=login&next=%2Fhome');
    expect(formProps().fields).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'mode', value: 'login', hidden: true }),
    ]));

    formProps().onError?.({ isInvalid: true, fields: {} });
    expect(showAlert).toHaveBeenLastCalledWith({
      variant: 'error',
      message: 'auth.form.validation.error',
      position: 'top-right',
    });
  });

  it.each(['unknown', ''])('falls back to login for invalid mode %s', (mode) => {
    searchParams = new URLSearchParams(mode ? `mode=${mode}` : '');
    render(<JoinPage />);

    expect(screen.getByText('auth.login.title')).toBeTruthy();
  });
});
