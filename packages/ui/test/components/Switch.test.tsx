import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Switch } from '../../src';

describe('Switch', () => {
  describe('rendering', () => {
    it('should render the switch', () => {
      render(<Switch fullWidth />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render the label', () => {
      render(<Switch label="Enable notifications" />);

      expect(
        screen.getByText('Enable notifications'),
      ).toBeInTheDocument();
    });

    it('should render the description', () => {
      render(
        <Switch
          label="Notifications"
          description="Receive notifications by email"
        />,
      );

      expect(
        screen.getByText('Receive notifications by email'),
      ).toBeInTheDocument();
    });

    it('should render label and description when both are provided', () => {
      render(
        <Switch
          label="Notifications"
          description="Receive notifications"
        />,
      );

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(
        screen.getByText('Receive notifications'),
      ).toBeInTheDocument();
    });

    it('should not render label when it is not provided', () => {
      render(<Switch description="Description" />);

      expect(screen.queryByText('Label')).not.toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should not render description when it is not provided', () => {
      render(<Switch label="Notifications" />);

      expect(
        screen.queryByText('Description'),
      ).not.toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('should be unchecked by default', () => {
      render(<Switch />);

      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('should use defaultChecked as initial state', () => {
      render(<Switch defaultChecked />);

      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('should update its internal state when changed', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');

      expect(switchElement).not.toBeChecked();

      fireEvent.click(switchElement);

      expect(switchElement).toBeChecked();

      fireEvent.click(switchElement);

      expect(switchElement).not.toBeChecked();
    });

    it('should support controlled checked state', () => {
      render(<Switch checked />);

      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('should support controlled unchecked state', () => {
      render(<Switch checked={false} />);

      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('should not update controlled state internally', () => {
      const { rerender } = render(<Switch checked={false} />);

      const switchElement = screen.getByRole('switch');

      fireEvent.click(switchElement);

      expect(switchElement).not.toBeChecked();

      rerender(<Switch checked />);

      expect(switchElement).toBeChecked();
    });
  });

  describe('events', () => {
    it('should call onChange when changed', () => {
      const onChange = jest.fn();

      render(<Switch onChange={onChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
          }),
        }),
      );
    });

    it('should call onCheckedChange with the next checked state', () => {
      const onCheckedChange = jest.fn();

      render(<Switch onCheckedChange={onCheckedChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(
        true,
        expect.any(Object),
      );
    });

    it('should call onCheckedChange with false when unchecked', () => {
      const onCheckedChange = jest.fn();

      render(
        <Switch
          defaultChecked
          onCheckedChange={onCheckedChange}
        />,
      );

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).toHaveBeenCalledWith(
        false,
        expect.any(Object),
      );
    });

    it('should call both onChange and onCheckedChange', () => {
      const onChange = jest.fn();
      const onCheckedChange = jest.fn();

      render(
        <Switch
          onChange={onChange}
          onCheckedChange={onCheckedChange}
        />,
      );

      fireEvent.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled state', () => {
    it('should disable the switch when disabled is true', () => {
      render(<Switch disabled />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should disable the switch when loading is true', () => {
      render(<Switch loading />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should disable the switch when readOnly is true', () => {
      render(<Switch readOnly />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });
  });

  describe('loading', () => {
    it('should render the default loading label', () => {
      render(<Switch loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render a custom loading label', () => {
      render(
        <Switch
          loading
          loadingLabel="Saving..."
        />,
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(
        screen.queryByText('Loading...'),
      ).not.toBeInTheDocument();
    });

    it('should prioritize loading label over checked label', () => {
      render(
        <Switch
          loading
          checked
          loadingLabel="Loading"
          checkedLabel="Enabled"
        />,
      );

      expect(screen.getByText('Loading')).toBeInTheDocument();
      expect(screen.queryByText('Enabled')).not.toBeInTheDocument();
    });

    it('should prioritize loading label over unchecked label', () => {
      render(
        <Switch
          loading
          loadingLabel="Loading"
          uncheckedLabel="Disabled"
        />,
      );

      expect(screen.getByText('Loading')).toBeInTheDocument();
      expect(screen.queryByText('Disabled')).not.toBeInTheDocument();
    });
  });

  describe('status labels', () => {
    it('should render checkedLabel when checked', () => {
      render(
        <Switch
          checked
          checkedLabel="Enabled"
        />,
      );

      expect(screen.getByText('Enabled')).toBeInTheDocument();
    });

    it('should render uncheckedLabel when unchecked', () => {
      render(
        <Switch
          uncheckedLabel="Disabled"
        />,
      );

      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('should not render checkedLabel when unchecked', () => {
      render(
        <Switch
          checked={false}
          checkedLabel="Enabled"
        />,
      );

      expect(screen.queryByText('Enabled')).not.toBeInTheDocument();
    });

    it('should not render uncheckedLabel when checked', () => {
      render(
        <Switch
          checked
          uncheckedLabel="Disabled"
        />,
      );

      expect(screen.queryByText('Disabled')).not.toBeInTheDocument();
    });

    it('should render no status text when labels are not provided', () => {
      render(<Switch />);

      expect(screen.queryByText('Enabled')).not.toBeInTheDocument();
      expect(screen.queryByText('Disabled')).not.toBeInTheDocument();
    });
  });

  describe('label position', () => {
    it('should render content after the switch by default', () => {
      const { container } = render(
        <Switch label="Notifications" />,
      );

      const root = container.firstElementChild;

      expect(root).toHaveClass('justify-start');
      expect(root).toHaveTextContent('Notifications');
    });

    it('should support label position start', () => {
      const { container } = render(
        <Switch
          label="Notifications"
          labelPosition="start"
        />,
      );

      const root = container.firstElementChild;

      expect(root).toHaveClass('justify-between');
      expect(root?.textContent).toContain('Notifications');
    });

    it('should support label position end', () => {
      const { container } = render(
        <Switch
          label="Notifications"
          labelPosition="end"
        />,
      );

      const root = container.firstElementChild;

      expect(root).toHaveClass('justify-start');
    });
  });

  describe('size', () => {
    it.each(['sm', 'md', 'lg'] as const)(
      'should apply the correct classes for %s size',
      size => {
        const { container } = render(
          <Switch size={size} />,
        );

        const track = container.querySelector(
          'label > span[aria-hidden="true"]',
        );

        expect(track).toBeInTheDocument();
      },
    );
  });

  describe('tone', () => {
    it.each(['primary', 'secondary', 'neutral'] as const)(
      'should support %s tone',
      tone => {
        const { container } = render(
          <Switch tone={tone} />,
        );

        const track = container.querySelector(
          'label > span[aria-hidden="true"]',
        );

        expect(track).toBeInTheDocument();
      },
    );
  });

  describe('variant', () => {
    it('should apply transparent border classes for solid variant', () => {
      const { container } = render(
        <Switch variant="solid" />,
      );

      const track = container.querySelector(
        'label > span[aria-hidden="true"]',
      );

      expect(track).toHaveClass(
        'border',
        'border-transparent',
      );

      expect(track).not.toHaveClass('bg-transparent');
    });

    it('should apply outline classes for outline variant', () => {
      const { container } = render(
        <Switch variant="outline" />,
      );

      const track = container.querySelector(
        'label > span[aria-hidden="true"]',
      );

      expect(track).toHaveClass(
        'border',
        'bg-transparent',
      );
    });
  });

  describe('custom classes', () => {
    it('should apply containerClassName', () => {
      const { container } = render(
        <Switch containerClassName="custom-container" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'custom-container',
      );
    });

    it('should apply switchClassName', () => {
      const { container } = render(
        <Switch switchClassName="custom-switch" />,
      );

      const track = container.querySelector(
        'label > span[aria-hidden="true"]',
      );

      expect(track).toHaveClass('custom-switch');
    });

    it('should apply thumbClassName', () => {
      const { container } = render(
        <Switch thumbClassName="custom-thumb" />,
      );

      const thumb = container.querySelector(
        'label > span[aria-hidden="true"] > span',
      );

      expect(thumb).toHaveClass('custom-thumb');
    });

    it('should apply labelClassName', () => {
      const { container } = render(
        <Switch
          label="Notifications"
          labelClassName="custom-label"
        />,
      );

      const labelContainer = container.querySelector(
        '.custom-label',
      );

      expect(labelContainer).toBeInTheDocument();
      expect(labelContainer).toHaveTextContent('Notifications');
    });

    it('should apply descriptionClassName', () => {
      render(
        <Switch
          description="Description"
          descriptionClassName="custom-description"
        />,
      );

      expect(
        screen.getByText('Description'),
      ).toHaveClass('custom-description');
    });
  });

  describe('input attributes', () => {
    it('should forward id', () => {
      render(<Switch id="notifications-switch" />);

      expect(
        screen.getByRole('switch'),
      ).toHaveAttribute('id', 'notifications-switch');
    });

    it('should forward name', () => {
      render(<Switch name="notifications" />);

      expect(
        screen.getByRole('switch'),
      ).toHaveAttribute('name', 'notifications');
    });

    it('should forward value', () => {
      render(<Switch value="enabled" />);

      expect(
        screen.getByRole('switch'),
      ).toHaveAttribute('value', 'enabled');
    });

    it('should support required', () => {
      render(<Switch required />);

      expect(
        screen.getByRole('switch'),
      ).toBeRequired();
    });

    it('should support autoFocus', () => {
      render(<Switch autoFocus />);

      expect(screen.getByRole('switch')).toHaveFocus();
    });

    it('should expose aria-busy when loading', () => {
      render(<Switch loading />);

      expect(
        screen.getByRole('switch'),
      ).toHaveAttribute('aria-busy', 'true');
    });

    it('should not expose aria-busy when not loading', () => {
      render(<Switch />);

      expect(
        screen.getByRole('switch'),
      ).not.toHaveAttribute('aria-busy');
    });

    it('should expose aria-readonly when readOnly', () => {
      render(<Switch readOnly />);

      expect(
        screen.getByRole('switch'),
      ).toHaveAttribute('aria-readonly', 'true');
    });

    it('should not expose aria-readonly when not readOnly', () => {
      render(<Switch />);

      expect(
        screen.getByRole('switch'),
      ).not.toHaveAttribute('aria-readonly');
    });
  });

  describe('ref', () => {
    it('should forward ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Switch ref={ref} />);

      expect(ref.current).toBe(
        screen.getByRole('switch'),
      );
    });
  });
});