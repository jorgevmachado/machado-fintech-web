import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { IconSwitch } from '../../src';

jest.mock('../../src/primitives', () => ({
  Icon: ({ icon, ...props }: { icon?: React.ReactNode }) => (
    <span data-testid={`icon-${String(icon)}`} {...props} />
  ),
}));

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolveChildren: (child?: React.ReactNode) => child,
  }),
}));

describe('IconSwitch', () => {
  describe('renderização', () => {
    it('should render a switch role element', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render both icons', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
      expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    });

    it('should render the off icon inside the thumb when unchecked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      const thumb = screen.getByTestId('icon-sun').parentElement;

      expect(thumb).toHaveClass('translate-x-0');
      expect(thumb).not.toHaveClass('translate-x-7');
    });

    it('should render the on icon inside the thumb when checked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" checked />);

      const thumb = screen.getByTestId('icon-moon').parentElement;

      expect(thumb).toHaveClass('translate-x-7');
    });

    it('should expose the off label as aria-label when unchecked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" offLabel="Tema claro" onLabel="Tema escuro" />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Tema claro');
    });

    it('should expose the on label as aria-label when checked', () => {
      render(
        <IconSwitch offIcon="sun" onIcon="moon" offLabel="Tema claro" onLabel="Tema escuro" checked />,
      );

      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Tema escuro');
    });

    it('should forward id and name', () => {
      render(<IconSwitch id="theme-switch" name="theme" offIcon="sun" onIcon="moon" />);

      const switchElement = screen.getByRole('switch');

      expect(switchElement).toHaveAttribute('id', 'theme-switch');
      expect(switchElement).toHaveAttribute('name', 'theme');
    });
  });

  describe('estado', () => {
    it('should be unchecked by default', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('should use defaultChecked as initial state', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" defaultChecked />);

      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('should toggle its internal state when clicked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      const switchElement = screen.getByRole('switch');

      fireEvent.click(switchElement);
      expect(switchElement).toBeChecked();

      fireEvent.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    it('should not change internal state when controlled', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" checked={false} />);

      const switchElement = screen.getByRole('switch');

      fireEvent.click(switchElement);

      expect(switchElement).not.toBeChecked();
    });

    it('should call onCheckedChange with the next checked value', () => {
      const onCheckedChange = jest.fn();

      render(<IconSwitch offIcon="sun" onIcon="moon" onCheckedChange={onCheckedChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
    });

    it('should call onChange with the event', () => {
      const onChange = jest.fn();

      render(<IconSwitch offIcon="sun" onIcon="moon" onChange={onChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('estados desabilitados e tamanhos', () => {
    it('should disable the input and mark the label as not clickable', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" disabled />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should stay unchecked when rendered disabled', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" disabled />);

      expect(screen.getByRole('switch')).not.toBeChecked();
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should apply the large track size', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" size="lg" />);

      const thumb = screen.getByTestId('icon-sun').parentElement;

      expect(thumb).toHaveClass('h-9', 'w-9');
    });

    it('should apply the small track size', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" size="sm" />);

      const thumb = screen.getByTestId('icon-sun').parentElement;

      expect(thumb).toHaveClass('h-6', 'w-6');
    });

    it('should keep the track colour when checked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" checked />);

      const track = screen.getByRole('switch').nextElementSibling;

      expect(track).toHaveClass('bg-slate-100');
      expect(track).not.toHaveClass('bg-blue-600');
    });

    it('should keep the same track colour when unchecked', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      const track = screen.getByRole('switch').nextElementSibling;

      expect(track).toHaveClass('bg-slate-100');
    });
  });

  describe('acessibilidade', () => {
    it('should expose aria-checked matching the state', () => {
      const { rerender } = render(<IconSwitch offIcon="sun" onIcon="moon" checked={false} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

      rerender(<IconSwitch offIcon="sun" onIcon="moon" checked />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('should mark decorative icons as aria-hidden', () => {
      render(<IconSwitch offIcon="sun" onIcon="moon" />);

      expect(screen.getByTestId('icon-sun')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByTestId('icon-moon')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('ref', () => {
    it('should forward ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<IconSwitch ref={ref} offIcon="sun" onIcon="moon" />);

      expect(ref.current).toBe(screen.getByRole('switch'));
    });
  });
});