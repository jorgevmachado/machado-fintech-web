import React from 'react';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';

import { OptionsDropdown } from '../../src';


jest.mock('../../src/primitives', () => ({
  Icon: ({ icon }: { icon?: React.ReactNode }) => (
    <span data-testid="mock-icon">{String(icon)}</span>
  ),
}));

describe('OptionsDropdown', () => {
  const firstItem = {
    label: 'Edit',
    onClick: jest.fn(),
  };

  const secondItem = {
    label: 'Delete',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dropdown closed by default', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should open the dropdown when the trigger is clicked', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    const trigger = screen.getByTestId('mock-icon');

    fireEvent.click(trigger);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' }))
    .toBeInTheDocument();
  });

  it('should close the dropdown when the trigger is clicked again', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    const trigger = screen.getByTestId('mock-icon');

    fireEvent.click(trigger);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render all items when opened', () => {
    render(
      <OptionsDropdown
        items={[firstItem, secondItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(
      screen.getByRole('menuitem', { name: 'Edit' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('menuitem', { name: 'Delete' }),
    ).toBeInTheDocument();
  });

  it('should call the item onClick callback', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    fireEvent.click(
      screen.getByRole('menuitem', { name: 'Edit' }),
    );

    expect(firstItem.onClick).toHaveBeenCalledTimes(1);
  });

  it('should close the dropdown after clicking an item', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('menuitem', { name: 'Edit' }),
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render disabled items as disabled', () => {
    const disabledItem = {
      label: 'Disabled',
      onClick: jest.fn(),
      disabled: true,
    };

    render(
      <OptionsDropdown
        items={[disabledItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(
      screen.getByRole('menuitem', { name: 'Disabled' }),
    ).toBeDisabled();
  });

  it('should not call onClick when a disabled item is clicked', () => {
    const disabledItem = {
      label: 'Disabled',
      onClick: jest.fn(),
      disabled: true,
    };

    render(
      <OptionsDropdown
        items={[disabledItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    fireEvent.click(
      screen.getByRole('menuitem', { name: 'Disabled' }),
    );

    expect(disabledItem.onClick).not.toHaveBeenCalled();
  });

  it('should close the dropdown when clicking outside', () => {
    render(
      <div>
        <OptionsDropdown
          items={[firstItem]}
        />

        <button type="button">
          Outside
        </button>
      </div>,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(
      screen.getByRole('button', { name: 'Outside' }),
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should not close the dropdown when clicking inside it', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    const menu = screen.getByRole('menu');

    fireEvent.mouseDown(menu);

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should render the default icon', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    expect(
      screen.getByTestId('mock-icon'),
    ).toHaveTextContent('dots');
  });

  it('should render a custom trigger icon', () => {
    render(
      <OptionsDropdown
        icon="ellipsis"
        items={[firstItem]}
      />,
    );

    expect(
      screen.getByTestId('mock-icon'),
    ).toHaveTextContent('ellipsis');
  });

  it('should apply right alignment by default', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(screen.getByRole('menu')).toHaveClass('right-0');
    expect(screen.getByRole('menu')).not.toHaveClass('left-0');
  });

  it('should apply left alignment when align is left', () => {
    render(
      <OptionsDropdown
        align="left"
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(screen.getByRole('menu')).toHaveClass('left-0');
    expect(screen.getByRole('menu')).not.toHaveClass('right-0');
  });

  it('should render an item icon on the left by default', () => {
    const item = {
      label: 'Edit',
      icon: 'edit',
      onClick: jest.fn(),
    };

    render(
      <OptionsDropdown
        items={[item]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    const menuItem = screen.getByRole('menuitem', {
      name: 'Edit',
    });

    const icon = menuItem.querySelector(
      '[data-testid="mock-icon"]',
    );

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('edit');

    expect(icon?.parentElement).toHaveClass(
      'inline-flex',
      'shrink-0',
    );

    expect(icon?.parentElement).not.toHaveClass('ml-auto');
  });

  it('should render an item icon on the right', () => {
    const item = {
      label: 'Edit',
      icon: 'edit',
      iconPosition: 'right' as const,
      onClick: jest.fn(),
    };

    render(
      <OptionsDropdown
        items={[item]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    const menuItem = screen.getByRole('menuitem', {
      name: 'Edit',
    });

    const itemIcon = menuItem.querySelector(
      '[data-testid="mock-icon"]',
    );

    expect(itemIcon).toBeInTheDocument();
    expect(itemIcon).toHaveTextContent('edit');

    expect(itemIcon?.parentElement).toHaveClass(
      'ml-auto',
      'inline-flex',
      'shrink-0',
    );
  });

  it('should not render an item icon when no icon is provided', () => {
    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(screen.getAllByTestId('mock-icon')).toHaveLength(1);
  });

  it('should remove the outside click listener when the dropdown closes', () => {
    const addEventListenerSpy = jest.spyOn(
      document,
      'addEventListener',
    );

    const removeEventListenerSpy = jest.spyOn(
      document,
      'removeEventListener',
    );

    render(
      <OptionsDropdown
        items={[firstItem]}
      />,
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );

    fireEvent.click(screen.getByTestId('mock-icon'));

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});