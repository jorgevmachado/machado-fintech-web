import { render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';

import { Button } from '../../src';

jest.mock('../../src/primitives', () => ({
  Icon: ({ icon, ...props }: { icon: string }) => (
    <span data-testid={`icon-${icon}`} {...props} />
  ),
}));

jest.mock('@fintech/theme', () => ({
  buildButtonTheme: jest.fn(() => [
    'button-class',
  ]),
}));

describe('Button', () => {
  it('should render button with children', () => {
    render(
      <Button>
        Click me
      </Button>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Click me',
      }),
    ).toBeInTheDocument();
  });

  it('should render with default type button', () => {
    render(
      <Button>
        Click
      </Button>,
    );

    expect(
      screen.getByRole('button'),
    ).toHaveAttribute('type', 'button');
  });

  it('should apply custom className', () => {
    render(
      <Button className="custom-class">
        Button
      </Button>,
    );

    expect(
      screen.getByRole('button'),
    ).toHaveClass('button-class');
  });

  it('should disable button when disabled is true', () => {
    render(
      <Button disabled>
        Disabled
      </Button>,
    );

    expect(
      screen.getByRole('button'),
    ).toBeDisabled();
  });

  it('should disable button while loading', () => {
    render(
      <Button isLoading>
        Save
      </Button>,
    );

    expect(
      screen.getByRole('button'),
    ).toBeDisabled();

    expect(
      screen.getByRole('button'),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('should render loading text when loading with content', () => {
    render(
      <Button
        isLoading
        loadingText="Saving..."
      >
        Save
      </Button>,
    );

    expect(
      screen.getByText('Saving...'),
    ).toBeInTheDocument();
  });

  it('should not render loading text when loading without content', () => {
    render(
      <Button
        isLoading
        loadingText="Saving..."
      />,
    );

    expect(
      screen.queryByText('Saving...'),
    ).not.toBeInTheDocument();
  });

  it('should render left icon', () => {
    render(
      <Button iconLeft="check">
        Confirm
      </Button>,
    );

    expect(
      screen.getByTestId('icon-check'),
    ).toBeInTheDocument();
  });

  it('should render right icon', () => {
    render(
      <Button iconRight="arrowRight">
        Next
      </Button>,
    );

    expect(
      screen.getByTestId('icon-arrowRight'),
    ).toBeInTheDocument();
  });

  it('should use icon variant without children', () => {
    render(
      <Button
        appearance="icon"
        iconLeft="plus"
      />,
    );

    expect(
      screen.getByTestId('icon-plus'),
    ).toBeInTheDocument();
  });

  it('should call buildButtonTheme with correct params', async () => {
    const { buildButtonTheme } = await import('@fintech/theme');

    render(
      <Button
        size="lg"
        tone="secondary"
        appearance="outline"
        fullWidth
      >
        Button
      </Button>,
    );

    expect(buildButtonTheme).toHaveBeenCalledWith({
      size: 'lg',
      tone: 'secondary',
      iconOnly: false,
      disabled: false,
      fullWidth: true,
      className: '',
      appearance: 'outline',
    });
  });

  it('should use theme defaults for nullish appearance props', async () => {
    const { buildButtonTheme } = await import('@fintech/theme');

    render(
      <Button
        size={null as never}
        tone={null as never}
        appearance={null as never}
      >
        Button
      </Button>,
    );

    expect(buildButtonTheme).toHaveBeenLastCalledWith({
      size: 'md',
      tone: 'solid',
      iconOnly: false,
      disabled: false,
      fullWidth: false,
      className: '',
      appearance: 'solid',
    });
  });
});