import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Textarea } from '../../src';

jest.mock('../../src/primitives', () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`}>{icon}</span>
  ),
}));

describe('<Textarea />', () => {
  it('updates character count while typing when uncontrolled', () => {
    render(
      <Textarea
        name="description"
        showCharacterCount
        maxLength={100}
      />,
    );

    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, {
      target: {
        value: 'abc',
      },
    });

    expect(screen.getByText('3 / 100')).toBeInTheDocument();
  });

  it('updates character count when controlled value changes', () => {
    const { rerender } = render(
      <Textarea
        name="description"
        showCharacterCount
        maxLength={100}
        value=""
      />,
    );

    rerender(
      <Textarea
        name="description"
        showCharacterCount
        maxLength={100}
        value="abcd"
      />,
    );

    expect(screen.getByText('4 / 100')).toBeInTheDocument();
  });

  it('applies distinct classes for each size', () => {
    const { rerender } = render(
      <Textarea
        name="description"
        size="sm"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('min-h-20', 'text-sm', 'leading-5');

    rerender(
      <Textarea
        name="description"
        size="lg"
      />,
    );

    expect(screen.getByRole('textbox')).toHaveClass('min-h-32', 'text-base', 'leading-7');
  });

  it('calls value and native callbacks with the textarea name', () => {
    const onValueChange = jest.fn();
    const onValueBlur = jest.fn();
    const onChange = jest.fn();
    const onBlur = jest.fn();

    render(
      <Textarea
        name="description"
        value=""
        onValueChange={onValueChange}
        onValueBlur={onValueBlur}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { name: 'description', value: 'hello' },
    });
    fireEvent.blur(textarea);

    expect(onValueChange).toHaveBeenCalledWith('hello', 'description', expect.any(Object));
    expect(onValueBlur).toHaveBeenCalledWith('', 'description', expect.any(Object));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('renders validation, helper and character count accessibility metadata', () => {
    const { rerender } = render(
      <Textarea
        name="description"
        value="hello"
        minLength={2}
        maxLength={10}
        showCharacterCount
        isInvalid
        errorMessage="Description is invalid"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(' '),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Description is invalid');
    expect(screen.getByText('5 / 10')).toBeInTheDocument();

    rerender(
      <Textarea
        name="description"
        value="hello"
        minLength={2}
        helperText="Add more details"
        showCharacterCount
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Add more details')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders loading, icons and clear action', () => {
    const onClear = jest.fn();

    const { rerender } = render(
      <Textarea
        name="description"
        value="hello"
        leadingIcon="edit"
        trailingIcon="check"
        showClearButton
        clearButtonAriaLabel="Clear description"
        onClear={onClear}
        isLoading={false}
      />,
    );

    expect(screen.getByTestId('icon-edit')).toBeInTheDocument();
    expect(screen.getByTestId('icon-close')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear description' }));
    expect(onClear).toHaveBeenCalledTimes(1);

    rerender(
      <Textarea
        name="description"
        value="hello"
        trailingIcon="check"
        isLoading
        loadingText="Loading"
      />,
    );

    expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    rerender(
      <Textarea
        name="description"
        value="hello"
        trailingIcon="check"
        isLoading={false}
      />,
    );
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('normalizes numeric and array values and supports non-uppercase labels', () => {
    const { rerender } = render(
      <Textarea
        name="description"
        label="Description"
        value={123 as unknown as string}
        uppercaseLabel={false}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('123');
    expect(screen.getByText('Description')).not.toHaveClass('uppercase');

    rerender(
      <Textarea
        name="description"
        value={['a', 'b'] as unknown as string}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('a,b');
  });

  it('supports hidden, disabled, narrow, invalid, and minimum-count states', () => {
    const { container } = render(
      <Textarea
        name="description"
        label="Description"
        hidden
        disabled
        fullWidth={false}
        isInvalid
        minLength={2}
        showCharacterCount
      />,
    );

    expect(container.firstChild).toHaveClass('hidden');
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('character-count'),
    );
    expect(screen.getByText('Description')).toHaveClass('uppercase');
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('highlights the character count when the maximum is reached', () => {
    render(
      <Textarea
        name="description"
        value="abc"
        maxLength={3}
        showCharacterCount
      />,
    );

    expect(screen.getByText('3 / 3')).toHaveClass('text-red-600');
  });
});