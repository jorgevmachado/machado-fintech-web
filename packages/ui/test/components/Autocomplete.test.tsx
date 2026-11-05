import React from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

jest.mock('../../src/components/input', () => ({
  __esModule: true,
  default: ({
    value,
    name,
    role,
    placeholder,
    onValueChange,
    onValueBlur,
    onFocus,
    onBlur,
    onKeyDown,
    onClear,
    onChange,
    showClearButton,
    isLoading,
    ...props
  }: {
    value?: string;
    name?: string;
    role?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onValueChange?: (
      value: string,
      name: string,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    onValueBlur?: (
      value: string,
      name: string,
      event: React.FocusEvent<HTMLInputElement>,
    ) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    showClearButton?: boolean;
    isLoading?: boolean;
  }) => (
    <div>
      <input
        {...props}
        role={role}
        name={name}
        value={value}
        placeholder={placeholder}
        aria-busy={isLoading || undefined}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(
            event.currentTarget.value,
            event.currentTarget.name,
            event,
          );
        }}
        onFocus={onFocus}
        onBlur={(event) => {
          onBlur?.(event);
          onValueBlur?.(
            event.currentTarget.value,
            event.currentTarget.name,
            event,
          );
        }}
        onKeyDown={onKeyDown}
      />

      {showClearButton ? (
        <button
          type="button"
          aria-label="Clear input"
          onClick={onClear}
        >
          Clear input
        </button>
      ) : null}
    </div>
  ),
}));

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolve: (value: string) => value,
  }),
}));

import { Autocomplete } from '../../src';

const OPTIONS = [
  {
    key: 'electric',
    value: 'electric',
  },
  {
    key: 'fire',
    value: 'fire',
    label: 'Fire Type',
  },
  {
    key: 'water',
    value: 'water',
  },
];

describe('<Autocomplete />', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders options on focus and filters by input value', () => {
    const onValueChange = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.change(input, {
      target: {
        value: 'fi',
      },
    });

    expect(onValueChange).toHaveBeenCalledWith(
      'fi',
      'type',
      expect.any(Object),
    );

    expect(screen.getByText('Fire Type')).toBeInTheDocument();

    expect(
      screen.queryByText('water'),
    ).not.toBeInTheDocument();
  });

  it('selects highlighted option with Enter key', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onSelectOption).toHaveBeenCalledWith({
      key: 'electric',
      value: 'electric',
    });

    expect(onValueChange).toHaveBeenCalledWith(
      'electric',
      'type',
      expect.any(Object),
    );
  });

  it('does nothing when the highlighted option is removed before Enter', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();
    const { rerender } = render(
      <Autocomplete
        name="type"
        value=""
        options={[{ key: 'fire', value: 'fire', label: 'Fire' }]}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    rerender(
      <Autocomplete
        name="type"
        value=""
        options={[]}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSelectOption).not.toHaveBeenCalled();
  });

  it('renders loading placeholder when loading', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        isLoading
        loadingPlaceholder="Loading types..."
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveAttribute(
      'placeholder',
      'Loading types...',
    );
  });

  it('renders default loading placeholder when loadingPlaceholder is not provided', () => {
    render(
      <Autocomplete
        name="pokemon"
        value=""
        options={OPTIONS}
        isLoading
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveAttribute(
      'placeholder',
      'Loading pokemon...',
    );
  });

  it('uses regular placeholder when not loading', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        placeholder="Select a type"
        loadingPlaceholder="Loading types..."
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveAttribute(
      'placeholder',
      'Select a type',
    );
  });

  it('navigates up through options with ArrowUp key', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    const options = screen.getAllByRole('option');

    expect(
      options[options.length - 1],
    ).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('wraps ArrowDown to first option after last', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    for (let index = 0; index < OPTIONS.length; index += 1) {
      fireEvent.keyDown(input, {
        key: 'ArrowDown',
      });
    }

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    const options = screen.getAllByRole('option');

    expect(options[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('navigates up from first option to last', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    const options = screen.getAllByRole('option');

    expect(
      options[OPTIONS.length - 2],
    ).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('closes dropdown on Escape key', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument();

    fireEvent.keyDown(input, {
      key: 'Escape',
    });

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument();
  });

  it('calls onValueChange when input value changes', () => {
    const onValueChange = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(
      screen.getByRole('combobox'),
      {
        target: {
          value: 'fi',
        },
      },
    );

    expect(onValueChange).toHaveBeenCalledWith(
      'fi',
      'type',
      expect.any(Object),
    );
  });

  it('calls onValueBlur when input loses focus', () => {
    jest.useFakeTimers();

    const onValueBlur = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueBlur={onValueBlur}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(onValueBlur).toHaveBeenCalledWith(
      '',
      'type',
      expect.any(Object),
    );
  });

  it('calls onBlur and closes dropdown after delay', () => {
    jest.useFakeTimers();

    const onBlur = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument();

    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument();
  });

  it('clears the input when clear button is clicked', () => {
    const onValueChange = jest.fn();

    render(
      <Autocomplete
        name="type"
        value="fire"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear input',
      }),
    );

    expect(onValueChange).not.toHaveBeenCalled();

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('');
  });

  it('calls onFocus callback', () => {
    const onFocus = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onFocus={onFocus}
      />,
    );

    fireEvent.focus(
      screen.getByRole('combobox'),
    );

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('respects custom filterOptions function', () => {
    const filterOptions = jest.fn(
      (
        option: { value: string },
        query: string,
      ) => option.value.startsWith(query),
    );

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        filterOptions={filterOptions}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: 'el',
      },
    });

    expect(filterOptions).toHaveBeenCalled();

    expect(
      screen.getByText('electric'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Fire Type'),
    ).not.toBeInTheDocument();
  });

  it('shows noResultsText when no options match', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        noResultsText="Nothing found."
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: 'zzz',
      },
    });

    expect(
      screen.getByText('Nothing found.'),
    ).toBeInTheDocument();
  });

  it('uses default no results text when noResultsText is not provided', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: 'zzz',
      },
    });

    expect(
      screen.getByText('form.no_options'),
    ).toBeInTheDocument();
  });

  it('does not move highlight when ArrowDown is pressed with no filtered options', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: 'zzz',
      },
    });

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(
      screen.getByText('form.no_options'),
    ).toBeInTheDocument();

    expect(input).not.toHaveAttribute(
      'aria-activedescendant',
    );
  });

  it('does not move highlight when ArrowUp is pressed with no filtered options', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.change(input, {
      target: {
        value: 'zzz',
      },
    });

    fireEvent.keyDown(input, {
      key: 'ArrowUp',
    });

    expect(
      screen.getByText('form.no_options'),
    ).toBeInTheDocument();

    expect(input).not.toHaveAttribute(
      'aria-activedescendant',
    );
  });

  it('respects onInputKeyDown when event is prevented', () => {
    const onInputKeyDown = jest.fn(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
      },
    );

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onInputKeyDown={onInputKeyDown}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(onInputKeyDown).toHaveBeenCalledTimes(1);

    expect(
      input,
    ).not.toHaveAttribute(
      'aria-activedescendant',
    );
  });

  it('selects option by mouseDown', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.mouseDown(
      screen.getByText('water'),
    );

    expect(onSelectOption).toHaveBeenCalledWith({
      key: 'water',
      value: 'water',
    });

    expect(onValueChange).toHaveBeenCalledWith(
      'water',
      'type',
      expect.any(Object),
    );

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument();
  });

  it('shows option label in input while keeping option value', () => {
    const onValueChange = jest.fn();
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onValueChange={onValueChange}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.mouseDown(
      screen.getByText('Fire Type'),
    );

    expect(onSelectOption).toHaveBeenCalledWith({
      key: 'fire',
      value: 'fire',
      label: 'Fire Type',
    });

    expect(onValueChange).toHaveBeenCalledWith(
      'fire',
      'type',
      expect.any(Object),
    );

    expect(input).toHaveValue('Fire Type');
  });

  it('displays option value when option has no label', () => {
    render(
      <Autocomplete
        name="type"
        value="electric"
        options={OPTIONS}
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('electric');
  });

  it('displays option label when initial value has a label', () => {
    render(
      <Autocomplete
        name="type"
        value="fire"
        options={OPTIONS}
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('Fire Type');
  });

  it('updates displayed value when external value changes', () => {
    const ControlledAutocomplete = () => {
      const [value, setValue] = React.useState('');

      return (
        <>
          <Autocomplete
            name="type"
            value={value}
            options={OPTIONS}
          />

          <button
            type="button"
            onClick={() => setValue('fire')}
          >
            Set fire
          </button>
        </>
      );
    };

    render(<ControlledAutocomplete />);

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Set fire',
      }),
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('Fire Type');
  });

  it('respects maxOptions', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        maxOptions={2}
        options={[
          ...OPTIONS,
          {
            key: 'grass',
            value: 'grass',
          },
        ]}
      />,
    );

    fireEvent.focus(
      screen.getByRole('combobox'),
    );

    expect(
      screen.getAllByRole('option'),
    ).toHaveLength(2);
  });

  it('does not render disabled options', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={[
          ...OPTIONS,
          {
            key: 'disabled',
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
          },
        ]}
      />,
    );

    fireEvent.focus(
      screen.getByRole('combobox'),
    );

    expect(
      screen.queryByRole('option', {
        name: 'Disabled',
      }),
    ).not.toBeInTheDocument();
  });

  it('renders custom option and listbox classes', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        optionClassName="custom-option"
        listboxClassName="custom-listbox"
      />,
    );

    fireEvent.focus(
      screen.getByRole('combobox'),
    );

    expect(
      screen.getByRole('listbox'),
    ).toHaveClass('custom-listbox');

    expect(
      screen.getByRole('option', {
        name: 'Fire Type',
      }),
    ).toHaveClass('custom-option');
  });

  it('sets active descendant when an option is highlighted', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    expect(input).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    expect(input).toHaveAttribute(
      'aria-activedescendant',
      'type-option-0',
    );

    expect(
      screen.getByRole('option', {
        name: 'electric',
      }),
    ).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('forwards onChange callback', () => {
    const onChange = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onChange={onChange}
      />,
    );

    fireEvent.change(
      screen.getByRole('combobox'),
      {
        target: {
          value: 'fi',
        },
      },
    );

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectOption when selecting with Enter', () => {
    const onSelectOption = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onSelectOption={onSelectOption}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onSelectOption).toHaveBeenCalledTimes(1);
  });

  it('keeps dropdown open when a non-special key is pressed', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'Tab',
    });

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument();
  });

  it('closes dropdown when Escape is pressed without highlighted option', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'Escape',
    });

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument();
  });

  it('does not select an option on Enter when no option is highlighted', () => {
    const onSelectOption = jest.fn();
    const onValueChange = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onSelectOption={onSelectOption}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onSelectOption).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not call optional callbacks when they are not provided', () => {
    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
      />,
    );

    const input = screen.getByRole('combobox');

    expect(() => {
      fireEvent.focus(input);
      fireEvent.change(input, {
        target: {
          value: 'fire',
        },
      });
      fireEvent.blur(input);
      fireEvent.keyDown(input, {
        key: 'ArrowDown',
      });
      fireEvent.keyDown(input, {
        key: 'Escape',
      });
    }).not.toThrow();
  });

  it('uses empty string when value is undefined', () => {
    render(
      <Autocomplete
        name="type"
        options={OPTIONS}
      />,
    );

    expect(
      screen.getByRole('combobox'),
    ).toHaveValue('');
  });

  it('clears the previous blur timeout when blur happens again', () => {
    jest.useFakeTimers();

    const onBlur = jest.fn();

    render(
      <Autocomplete
        name="type"
        value=""
        options={OPTIONS}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);

    fireEvent.blur(input);

    act(() => {
      jest.advanceTimersByTime(60);
    });

    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalledTimes(2);

    act(() => {
      jest.advanceTimersByTime(59);
    });

    expect(
      screen.getByRole('listbox'),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(61);
    });

    expect(
      screen.queryByRole('listbox'),
    ).not.toBeInTheDocument();
  });
});