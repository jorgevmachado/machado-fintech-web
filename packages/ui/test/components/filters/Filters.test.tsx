import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Filters ,OFilterVariants } from '../../../src';


jest.mock('@fintech/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));


jest.mock('../../../src/components/input', () => ({
  __esModule: true,
  default: ({
    value,
    placeholder,
    onValueChange,
  }: {
    value: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
  }) => (
    <input
      data-testid="input"
      value={value}
      placeholder={placeholder}
      onChange={(event) =>
        onValueChange?.(event.target.value)
      }
    />
  ),
}));


jest.mock('../../../src/components/autocomplete', () => ({
  __esModule: true,
  default: ({
    name,
    value,
    placeholder,
    onValueChange,
  }: {
    name: string;
    value: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
  }) => (
    <input
      data-testid={`autocomplete-${name}`}
      value={value}
      placeholder={placeholder}
      onChange={(event) =>
        onValueChange?.(event.target.value)
      }
    />
  ),
}));


jest.mock('../../../src/primitives', () => ({
  Text: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <span>{children}</span>
  ),
}));


jest.mock('../../../src/components/button', () => ({
  __esModule: true,
  default: ({
    children,
    disabled,
    onClick,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));


describe('<Filters />', () => {

  const filters = [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Search name',
      type: 'text' as const,
      value: '',
    },
    {
      name: 'type',
      label: 'Type',
      placeholder: 'Select type',
      type: 'autocomplete' as const,
      value: '',
      options: [
        {
          key: 'fire',
          value: 'fire',
          label: 'Fire',
        },
      ],
    },
  ];


  it('should render filters correctly', () => {
    render(
      <Filters
        filters={filters}
        onApply={jest.fn()}
      />,
    );


    expect(
      screen.getByTestId('input'),
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('autocomplete-type'),
    ).toBeInTheDocument();


    expect(
      screen.getByText('Name'),
    ).toBeInTheDocument();
  });


  it('should initialize fields with filter values', () => {
    render(
      <Filters
        filters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: 'Pikachu',
          },
        ]}
        onApply={jest.fn()}
      />,
    );


    expect(
      screen.getByTestId('input'),
    ).toHaveValue('Pikachu');
  });


  it('should update filter value', () => {
    render(
      <Filters
        filters={filters}
        onApply={jest.fn()}
      />,
    );


    fireEvent.change(
      screen.getByTestId('input'),
      {
        target: {
          value: 'Charmander',
        },
      },
    );


    expect(
      screen.getByTestId('input'),
    ).toHaveValue('Charmander');
  });


  it('should call onApply with trimmed values', () => {
    const onApply = jest.fn();


    render(
      <Filters
        filters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: '',
          },
        ]}
        onApply={onApply}
      />,
    );


    fireEvent.change(
      screen.getByTestId('input'),
      {
        target: {
          value: '  Pikachu  ',
        },
      },
    );


    fireEvent.click(
      screen.getByText('filter.apply'),
    );


    expect(onApply)
    .toHaveBeenCalledWith({
      name: 'Pikachu',
    });
  });


  it('should clear filters and call onClear', () => {
    const onClear = jest.fn();


    render(
      <Filters
        filters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: 'Pikachu',
          },
        ]}
        onApply={jest.fn()}
        onClear={onClear}
      />,
    );


    expect(
      screen.getByTestId('input'),
    ).toHaveValue('Pikachu');


    fireEvent.click(
      screen.getByText('filter.clear'),
    );


    expect(onClear)
    .toHaveBeenCalled();


    expect(
      screen.getByTestId('input'),
    ).toHaveValue('Pikachu');
  });


  it('should disable clear button when there are no active filters', () => {
    render(
      <Filters
        filters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: '',
          },
        ]}
        onApply={jest.fn()}
      />,
    );


    expect(
      screen.getByText('filter.clear'),
    ).toBeDisabled();
  });


  it('should enable clear button when a filter has value', () => {
    render(
      <Filters
        filters={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            value: 'Pikachu',
          },
        ]}
        onApply={jest.fn()}
      />,
    );


    expect(
      screen.getByText('filter.clear'),
    ).not.toBeDisabled();
  });


  it('should use default label and placeholder when not provided', () => {
    render(
      <Filters
        filters={[
          {
            name: 'pokemon',
            type: 'text',
            value: '',
          },
        ]}
        onApply={jest.fn()}
      />,
    );


    expect(
      screen.getByText('filter.label.pokemon'),
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('input'),
    ).toHaveAttribute(
      'placeholder',
      'filter.placeholder.pokemon',
    );
  });


  it('should update autocomplete value', () => {
    render(
      <Filters
        filters={[
          {
            name: 'type',
            type: 'autocomplete',
            value: '',
            options: [
              {
                key: 'fire',
                value: 'fire',
              },
            ],
          },
        ]}
        onApply={jest.fn()}
      />,
    );


    fireEvent.change(
      screen.getByTestId('autocomplete-type'),
      {
        target: {
          value: 'fire',
        },
      },
    );


    expect(
      screen.getByTestId('autocomplete-type'),
    ).toHaveValue('fire');
  });

  it('should map filter variant', () => {
    expect(OFilterVariants.length).toEqual(5);
  });

  it('should render an autocomplete without options as a regular input', () => {
    render(
      <Filters
        filters={[
          {
            name: 'type',
            type: 'autocomplete',
            value: null as unknown as string,
          },
        ]}
        onApply={jest.fn()}
      />,
    );

    expect(screen.getByTestId('input')).toHaveValue('');
    expect(screen.queryByTestId('autocomplete-type')).not.toBeInTheDocument();
  });

  it('should default values for filters added after the initial render', () => {
    const onApply = jest.fn();
    const { rerender } = render(
      <Filters filters={[]} onApply={onApply} />,
    );

    rerender(
      <Filters
        filters={[
          {
            name: 'type',
            type: 'autocomplete',
            value: 'fire',
            options: [{ key: 'fire', value: 'fire' }],
          },
          {
            name: 'search',
            type: 'text',
            value: 'Pikachu',
          },
        ]}
        onApply={onApply}
      />,
    );

    expect(screen.getByTestId('autocomplete-type')).toHaveValue('');
    expect(screen.getByTestId('input')).toHaveValue('');
  });

});