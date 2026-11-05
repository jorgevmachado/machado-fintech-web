import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../src/primitives', () => ({
  Text: ({
    children,
    className,
    color,
  }: {
    children: React.ReactNode;
    className?: string;
    color?: string;
  }) => (
    <span className={`${color ?? ''} ${className ?? ''}`.trim()}>
      {children}
    </span>
  ),
}));

import { Select } from '../../src';

const options = [
  {
    value: 'pikachu',
    label: 'Pikachu',
  },
  {
    value: 'charizard',
    label: 'Charizard',
  },
  {
    value: 'bulbasaur',
    label: 'Bulbasaur',
  },
];

describe('<Select />', () => {
  it('renders with label, value and options', () => {
    render(
      <Select
        name="pokemon"
        label="Pokemon"
        value="pikachu"
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Pokemon')).toBeInTheDocument();

    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('pikachu');
    expect(screen.getByRole('option', { name: 'Pikachu' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Charizard' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bulbasaur' })).toBeInTheDocument();
  });

  it('renders placeholder as disabled option', () => {
    render(
      <Select
        value=""
        options={options}
        placeholder="Select a pokemon"
        onChange={jest.fn()}
      />,
    );

    const placeholder = screen.getByRole('option', {
      name: 'Select a pokemon',
    });

    expect(placeholder).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('uses loading text as placeholder when loading', () => {
    render(
      <Select
        value=""
        options={options}
        placeholder="Select a pokemon"
        isLoading
        loadingText="Loading pokemons..."
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('option', {
        name: 'Loading pokemons...',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'Select a pokemon',
      }),
    ).not.toBeInTheDocument();
  });

  it('renders placeholder when loading without loading text', () => {
    render(
      <Select
        value=""
        options={options}
        placeholder="Select a pokemon"
        isLoading
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('option', {
        name: 'Select a pokemon',
      }),
    ).toBeInTheDocument();
  });

  it('does not render placeholder when it is not provided', () => {
    render(
      <Select
        value="pikachu"
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onChange and onValueChange when value changes', () => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();

    render(
      <Select
        name="pokemon"
        value=""
        options={options}
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: {
        name: 'pokemon',
        value: 'charizard',
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onValueChange).toHaveBeenCalledWith(
      'charizard',
      'pokemon',
      expect.any(Object),
    );
  });

  it('calls onValueBlur with value, name and event', () => {
    const onBlur = jest.fn();
    const onValueBlur = jest.fn();

    render(
      <Select
        name="pokemon"
        value="pikachu"
        options={options}
        onBlur={onBlur}
        onValueBlur={onValueBlur}
      />,
    );

    fireEvent.blur(screen.getByRole('combobox'));

    expect(onBlur).toHaveBeenCalledTimes(1);

    expect(onValueBlur).toHaveBeenCalledWith(
      'pikachu',
      'pokemon',
      expect.any(Object),
    );
  });

  it('does not throw when value change callback is not provided', () => {
    render(
      <Select
        name="pokemon"
        value=""
        options={options}
      />,
    );

    expect(() => {
      fireEvent.change(screen.getByRole('combobox'), {
        target: {
          name: 'pokemon',
          value: 'pikachu',
        },
      });
    }).not.toThrow();
  });

  it('does not throw when blur callback is not provided', () => {
    render(
      <Select
        name="pokemon"
        value="pikachu"
        options={options}
      />,
    );

    expect(() => {
      fireEvent.blur(screen.getByRole('combobox'));
    }).not.toThrow();
  });

  it('renders disabled options', () => {
    render(
      <Select
        value=""
        options={[
          ...options,
          {
            value: 'mewtwo',
            label: 'Mewtwo',
            disabled: true,
          },
        ]}
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('option', { name: 'Mewtwo' }),
    ).toBeDisabled();
  });

  it('disables the select when disabled', () => {
    render(
      <Select
        value="pikachu"
        options={options}
        disabled
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('disables the select while loading', () => {
    render(
      <Select
        value="pikachu"
        options={options}
        isLoading
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
    expect(select).toHaveAttribute('aria-busy', 'true');
  });

  it('does not set aria-busy when not loading', () => {
    render(
      <Select
        value="pikachu"
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-busy');
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <Select
        value=""
        options={options}
        isInvalid
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('does not set aria-invalid when valid', () => {
    render(
      <Select
        value="pikachu"
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  it('renders error message when provided', () => {
    render(
      <Select
        value=""
        options={options}
        isInvalid
        errorMessage="Pokemon is required."
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Pokemon is required.',
    );
  });

  it('renders helper text when there is no error', () => {
    render(
      <Select
        value=""
        options={options}
        helperText="Select your favorite pokemon."
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByText('Select your favorite pokemon.'),
    ).toBeInTheDocument();
  });

  it('does not render helper text when error message exists', () => {
    render(
      <Select
        value=""
        options={options}
        helperText="Select your favorite pokemon."
        errorMessage="Pokemon is required."
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.queryByText('Select your favorite pokemon.'),
    ).not.toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Pokemon is required.',
    );
  });

  it('hides the component when hidden is true', () => {
    render(
      <Select
        value=""
        options={options}
        hidden
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByRole('combobox');

    expect(select.closest('div.hidden')).toBeInTheDocument();
  });

  it('does not hide the component by default', () => {
    render(
      <Select
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).not.toHaveClass('hidden');
  });

  it('does not uppercase the label when uppercaseLabel is false', () => {
    render(
      <Select
        label="Pokemon"
        value=""
        options={options}
        uppercaseLabel={false}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Pokemon')).not.toHaveClass('uppercase');
  });

  it('uppercases the label by default', () => {
    render(
      <Select
        label="Pokemon"
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Pokemon')).toHaveClass('uppercase');
  });

  it('applies custom class names', () => {
    render(
      <Select
        value=""
        options={options}
        className="custom-select"
        containerClassName="custom-container"
        inputWrapperClassName="custom-wrapper"
        helperClassName="custom-helper"
        helperText="Helper"
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveClass('custom-select');

    expect(
      screen.getByText('Helper'),
    ).toHaveClass('custom-helper');

    expect(
      screen.getByRole('combobox').closest('.custom-wrapper'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Helper').parentElement,
    ).toHaveClass('custom-container');
  });

  it('applies full width class by default', () => {
    render(
      <Select
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByRole('combobox');

    expect(select.closest('div')?.parentElement).toHaveClass('w-full');
  });

  it('does not apply full width class when fullWidth is false', () => {
    render(
      <Select
        value=""
        options={options}
        fullWidth={false}
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByRole('combobox');

    expect(select.closest('div')?.parentElement).not.toHaveClass('w-full');
  });

  it('applies the filled variant theme', () => {
    render(
      <Select
        value=""
        options={options}
        variant="filled"
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByRole('combobox');

    expect(select.closest('div')).toHaveClass('bg-slate-100');
  });

  it('forwards native select props', () => {
    render(
      <Select
        name="pokemon"
        id="pokemon-select"
        value="pikachu"
        options={options}
        required
        data-testid="pokemon-select"
        onChange={jest.fn()}
      />,
    );

    const select = screen.getByTestId('pokemon-select');

    expect(select).toHaveAttribute('id', 'pokemon-select');
    expect(select).toHaveAttribute('name', 'pokemon');
    expect(select).toBeRequired();
  });

  it('forwards ref to the native select element', () => {
    const ref = React.createRef<HTMLSelectElement>();

    render(
      <Select
        ref={ref}
        value="pikachu"
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('renders empty options without crashing', () => {
    render(
      <Select
        value=""
        options={[]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('applies error color to the label when invalid', () => {
    render(
      <Select
        label="Pokemon"
        value=""
        options={options}
        isInvalid
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Pokemon')).toHaveClass('text-red-600');
  });

  it('applies default color to the label when valid', () => {
    render(
      <Select
        label="Pokemon"
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Pokemon')).toHaveClass('text-slate-600');
  });
});

