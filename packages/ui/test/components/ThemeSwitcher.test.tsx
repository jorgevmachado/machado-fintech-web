import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeSwitcher } from '../../src';

describe('ThemeSwitcher', () => {
  const getLightOption = () => screen.getByRole('button', { name: 'Light theme' });
  const getDarkOption = () => screen.getByRole('button', { name: 'Dark theme' });

  it('renders both options and selects light by default', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
    expect(getLightOption()).toHaveAttribute('aria-pressed', 'true');
    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'false');
    expect(getLightOption()).toHaveClass('bg-slate-100');
    expect(getDarkOption()).toHaveClass('bg-transparent');
    expect(getLightOption()).toHaveClass('cursor-pointer');
    expect(getDarkOption()).toHaveClass('cursor-pointer');
    expect(screen.getByTestId('icon-fa-sun')).toBeInTheDocument();
    expect(screen.getByTestId('icon-fa-moon')).toBeInTheDocument();
    expect(screen.getByTestId('icon-fa-sun').parentElement).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
    );
  });

  it.each([
    ['primary', 'dark', 'from-[#14213d]', 'text-white'],
    ['secondary', 'dark', 'from-[#2e1065]', 'text-white'],
    ['neutral', 'dark', 'from-[#111827]', 'text-white'],
    ['primary', 'light', 'bg-white', 'text-slate-900'],
    ['secondary', 'light', 'from-[#faf5ff]', 'text-violet-700'],
    ['neutral', 'light', 'from-[#ffffff]', 'text-slate-900'],
  ] as const)(
    'uses matching %s navbar styling in %s mode',
    (tone, mode, containerClass, selectedClass) => {
      render(<ThemeSwitcher tone={tone} variant={mode} />);

      const group = screen.getByRole('group', { name: 'Theme' });
      const selectedOption = screen.getByRole('button', {
        name: mode === 'dark' ? 'Dark theme' : 'Light theme',
      });

      expect(group).toHaveClass(containerClass);
      expect(selectedOption).toHaveClass(selectedClass);
    },
  );

  it('selects dark and reports the value to the consumer', () => {
    const onChange = jest.fn();

    render(<ThemeSwitcher onChange={onChange} />);
    fireEvent.click(getDarkOption());

    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'true');
    expect(getLightOption()).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('reports light when selecting it from dark mode', () => {
    const onChange = jest.fn();

    render(<ThemeSwitcher defaultVariant="dark" onChange={onChange} />);
    fireEvent.click(getLightOption());

    expect(getLightOption()).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('uses defaultVariant for its initial uncontrolled selection', () => {
    render(<ThemeSwitcher defaultVariant="dark" />);

    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'true');
    expect(getLightOption()).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects the controlled value and waits for the consumer to update it', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <ThemeSwitcher variant="light" onChange={onChange} />,
    );

    fireEvent.click(getDarkOption());

    expect(onChange).toHaveBeenCalledWith('dark');
    expect(getLightOption()).toHaveAttribute('aria-pressed', 'true');
    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'false');

    rerender(<ThemeSwitcher variant="dark" onChange={onChange} />);

    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not call onChange again when selecting the active option', () => {
    const onChange = jest.fn();

    render(<ThemeSwitcher onChange={onChange} />);
    fireEvent.click(getLightOption());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('works without an onChange callback', () => {
    render(<ThemeSwitcher />);

    expect(() => fireEvent.click(getDarkOption())).not.toThrow();
    expect(getDarkOption()).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard activation with native buttons', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<ThemeSwitcher onChange={onChange} />);
    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(getDarkOption()).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('dark');
  });
});
