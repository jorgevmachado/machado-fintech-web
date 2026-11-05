import React from 'react';
import { Mask } from '@fintech/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../src/primitives', () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => (
    <span data-testid={`icon-${icon}`} {...props}>
      {icon}
    </span>
  ),
}));

import { Input } from '../../src';

describe('<Input />', () => {
  it('renders with label , value and placeholder', () => {
    render(
      <Input
        label="Pokemon"
        value="pikachu"
        onChange={() => undefined}
        placeholder="Search pokemon"
      />,
    );

    expect(screen.getByText('Pokemon')).toBeInTheDocument();
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search pokemon')).toBeInTheDocument();
  });

  it('calls onValueChange with typed value', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'charizard' },
    });

    expect(onValueChange).toHaveBeenCalledWith('charizard', '', expect.any(Object));
  });

  it('formats money input with BRL when switchLanguage is pt-BR', () => {
    render(
      <Input
        type='money'
        switchLanguage='pt-BR'
        value='123456'
        onChange={() => undefined}
      />,
    );

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue('R$ 1.234,56');
    expect(textbox).toHaveAttribute('type', 'text');
  });

  it('defaults money locale mapping when switchLanguage is undefined', () => {
    render(
      <Input
        type='money'
        switchLanguage={undefined}
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('$1,234.56');
  });

  it('formats money input with USD when switchLanguage is en', () => {
    render(
      <Input
        type='money'
        switchLanguage='en-US'
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('$1,234.56');
  });

  it('formats money input with EUR when switchLanguage is es', () => {
    render(
      <Input
        type='money'
        switchLanguage='es-UE'
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('1234,56 €');
  });

  it('shows clear button and triggers onClear', () => {
    const onClear = jest.fn();

    render(
      <Input
        value='bulbasaur'
        onChange={() => undefined}
        showClearButton={true}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = jest.fn();

    render(
      <Input
        value="bulbasaur"
        onChange={() => {}}
        showClearButton
        onClear={onClear}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /clear input/i }),
    );

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not call onClear when disabled', () => {
    const onClear = jest.fn();

    render(
      <Input
        value="bulbasaur"
        onChange={() => {}}
        showClearButton
        disabled
        onClear={onClear}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /clear input/i }),
    ).not.toBeInTheDocument();

    expect(onClear).not.toHaveBeenCalled();
  });

  it('does not call onClear when readOnly', () => {
    const onClear = jest.fn();

    render(
      <Input
        value="bulbasaur"
        onChange={() => {}}
        showClearButton
        readOnly
        onClear={onClear}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /clear input/i }),
    ).not.toBeInTheDocument();

    expect(onClear).not.toHaveBeenCalled();
  });

  it('renders loading state with aria-busy', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isLoading
        loadingText='Loading types...'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-busy', 'true');
    expect(textbox).toHaveAttribute('placeholder', 'Loading types...');
  });

  it('renders leading and trailing icons', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        leadingIcon="react"
        trailingIcon="home"
      />,
    );

    expect(screen.getByTestId('icon-react')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('renders error message with invalid state', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isInvalid
        errorMessage='This field is required.'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
  });

  it('supports hidden labels and invalid label styling', () => {
    const { container } = render(
      <Input
        label="Trainer name"
        value=""
        hidden
        isInvalid
      />,
    );

    expect(container.firstChild).toHaveClass('hidden');
    expect(screen.getByText('Trainer name')).toBeInTheDocument();
  });

  it('does not show clear button when input is readOnly', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        showClearButton
        readOnly
        onClear={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('does not show clear button when input is disabled', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        showClearButton
        disabled
        onClear={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('renders helper text when no error', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        helperText='Enter your trainer name'
      />,
    );

    expect(screen.getByText('Enter your trainer name')).toBeInTheDocument();
  });

  it('applies filled variant class', () => {
    render(<Input value='' onChange={() => undefined} variant='filled' />);
    const wrapper = screen.getByRole('textbox').closest('div');
    expect(wrapper).toHaveClass('bg-slate-100');
  });

  it('supports mask function callback', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask={'masked:###'}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'abc' },
    });

    expect(onValueChange).toHaveBeenCalledWith('masked:abc', '', expect.any(Object));
  });

  it('handles short mask token sequence without crashing', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask={new Mask('###')}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '12' },
    });

    expect(onValueChange).toHaveBeenCalledWith('12', '', expect.any(Object));
  });

  it('stops mask when reaching trailing literal with no remaining digits', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask={new Mask('(##)')}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '12' },
    });

    expect(onValueChange).toHaveBeenCalledWith('(12', '', expect.any(Object));
  });

  it('keeps empty value for money input when there are no digits', () => {
    render(
      <Input
        type='money'
        value=''
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('accepts non-string controlled values without formatting', () => {
    render(
      <Input
        value={123 as unknown as string}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('123');
  });

  it('formats money value on typing in onValueChange callback', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        type='money'
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1234' },
    });

    expect(onValueChange).toHaveBeenCalledWith('$12.34', '', expect.any(Object));
  });

  it('handles clearing a money value without optional callbacks', () => {
    render(<Input type="money" value="123" />);

    expect(() => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '' },
      });
    }).not.toThrow();
  });

  it('calls onValueBlur with value, name and event', () => {
    const onValueBlur = jest.fn();

    render(
      <Input
        name="pokemon"
        value="pikachu"
        onChange={() => undefined}
        onValueBlur={onValueBlur}
      />,
    );

    fireEvent.blur(screen.getByRole('textbox'));

    expect(onValueBlur).toHaveBeenCalledWith('pikachu', 'pokemon', expect.any(Object));
  });

  it('calls native blur and change callbacks', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(
      <Input
        name="pokemon"
        value=""
        onBlur={onBlur}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { name: 'pokemon', value: 'pikachu' },
    });
    fireEvent.blur(screen.getByRole('textbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('does not uppercase the label when uppercaseLabel is false', () => {
    render(
      <Input
        label="Pokemon"
        value=""
        onChange={() => undefined}
        uppercaseLabel={false}
      />,
    );

    expect(screen.getByText('Pokemon')).not.toHaveClass('uppercase');
  });

  describe('when type is password', () => {
    it('should toggle password visibility when clicking the visibility icon', async () => {
      const user = userEvent.setup();

      render(
        <Input
          name="password"
          type="password"
          value="my-password"
          onChange={jest.fn()}
        />,
      );

      const input = screen.getByDisplayValue('my-password');

      const visibilityIcon = screen.getByRole('button', {
        name: 'Show password',
      });

      expect(input).toHaveAttribute('type', 'password');
      expect(visibilityIcon).toHaveAttribute('aria-label', 'Show password');

      await user.click(visibilityIcon);

      expect(input).toHaveAttribute('type', 'text');
      expect(visibilityIcon).toHaveAttribute('aria-label', 'Hide password');

      await user.click(visibilityIcon);

      expect(input).toHaveAttribute('type', 'password');
      expect(visibilityIcon).toHaveAttribute('aria-label', 'Show password');
    });
  });
});