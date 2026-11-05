import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../../../src/components/input', () => ({
  __esModule: true,
  default: ({
    name,
    type,
    label,
    value,
    hidden,
    disabled,
    placeholder,
    isInvalid,
    errorMessage,
    mask,
    size,
    onValueChange,
  }: {
    name?: string;
    type?: string;
    label?: string;
    value?: string;
    hidden?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    errorMessage?: string;
    mask?: unknown;
    size?: string;
    onValueChange?: (
      value: string,
      name: string,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }) => (
    <div data-testid="form-input">
      <input
        name={name}
        type={type}
        value={value}
        hidden={hidden}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        data-error-message={errorMessage}
        data-mask={mask ? 'true' : 'false'}
        data-size={size}
        onChange={(event) =>
          onValueChange?.(
            event.target.value,
            name ?? '',
            event,
          )
        }
      />

      {label && <span>{label}</span>}
    </div>
  ),
}));

jest.mock('../../../../src/components/textarea', () => ({
  __esModule: true,
  default: ({
    name,
    label,
    value,
    hidden,
    disabled,
    placeholder,
    isInvalid,
    errorMessage,
    rows,
    maxLength,
    showCharacterCount,
    onValueChange,
  }: {
    name?: string;
    label?: string;
    value?: string;
    hidden?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    errorMessage?: string;
    rows?: number;
    maxLength?: number;
    showCharacterCount?: boolean;
    onValueChange?: (
      value: string,
      name: string,
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
  }) => (
    <div data-testid="form-textarea">
      <textarea
        name={name}
        value={value}
        hidden={hidden}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        data-error-message={errorMessage}
        data-rows={rows}
        data-max-length={maxLength}
        data-show-character-count={showCharacterCount}
        onChange={(event) =>
          onValueChange?.(
            event.target.value,
            name ?? '',
            event,
          )
        }
      />

      {label && <span>{label}</span>}
    </div>
  ),
}));

jest.mock('../../../../src/components/select', () => ({
  __esModule: true,
  default: ({
    name,
    label,
    value,
    hidden,
    disabled,
    placeholder,
    isInvalid,
    errorMessage,
    options,
    size,
    onValueChange,
  }: {
    name?: string;
    label?: string;
    value?: string;
    hidden?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    errorMessage?: string;
    options?: Array<{
      label: string;
      value: string;
      disabled?: boolean;
    }>;
    size?: string;
    onValueChange?: (
      value: string,
      name: string,
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => void;
  }) => (
    <div data-testid="form-select">
      <select
        name={name}
        value={value}
        hidden={hidden}
        disabled={disabled}
        aria-invalid={isInvalid}
        data-error-message={errorMessage}
        data-placeholder={placeholder}
        data-size={size}
        onChange={(event) =>
          onValueChange?.(
            event.target.value,
            name ?? '',
            event,
          )
        }
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {label && <span>{label}</span>}
    </div>
  ),
}));

jest.mock('../../../../src/components/autocomplete', () => ({
  __esModule: true,
  default: ({
    name,
    label,
    value,
    hidden,
    disabled,
    placeholder,
    isInvalid,
    errorMessage,
    options,
    maxOptions,
    noResultsText,
    onValueChange,
  }: {
    name?: string;
    label?: string;
    value?: string;
    hidden?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    errorMessage?: string;
    options?: Array<{
      key: string;
      value: string;
      label?: string;
      disabled?: boolean;
    }>;
    maxOptions?: number;
    noResultsText?: string;
    onValueChange?: (
      value: string,
      name: string,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }) => (
    <div data-testid="form-autocomplete">
      <input
        name={name}
        value={value}
        hidden={hidden}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        data-error-message={errorMessage}
        data-max-options={maxOptions}
        data-no-results-text={noResultsText}
        onChange={(event) =>
          onValueChange?.(
            event.target.value,
            name ?? '',
            event,
          )
        }
      />

      <div data-testid="autocomplete-options">
        {options?.map((option) => (
          <span key={option.key}>
            {option.label ?? option.value}
          </span>
        ))}
      </div>

      {label && <span>{label}</span>}
    </div>
  ),
}));

import { FormField  } from '../../../../src/components/form/field';

describe('<FormField />', () => {
  describe('input fields', () => {
    it('renders an Input for text field', () => {
      render(
        <FormField
          name="username"
          type="text"
          value=""
        />,
      );

      expect(screen.getByTestId('form-input')).toBeInTheDocument();
      expect(screen.queryByTestId('form-textarea')).not.toBeInTheDocument();
    });

    it('renders an Input with the correct input type', () => {
      render(
        <FormField
          name="email"
          type="email"
          value=""
        />,
      );

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'type',
        'email',
      );
    });

    it('renders password fields as password inputs', () => {
      render(
        <FormField
          name="password"
          type="password"
          value=""
        />,
      );

      const input = screen
      .getByTestId('form-input')
      .querySelector('input');

      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders password confirmation as password input', () => {
      render(
        <FormField
          name="password_confirmation"
          type="password_confirmation"
          value=""
        />,
      );

      const input = screen
      .getByTestId('form-input')
      .querySelector('input');

      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders phone as telephone input', () => {
      render(
        <FormField
          name="phone"
          type="phone"
          value=""
        />,
      );

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'type',
        'tel',
      );
    });
  });

  describe('textarea fields', () => {
    it('renders a Textarea for description field', () => {
      render(
        <FormField
          name="description"
          type="description"
          value=""
        />,
      );

      expect(screen.getByTestId('form-textarea')).toBeInTheDocument();
      expect(screen.queryByTestId('form-input')).not.toBeInTheDocument();
    });
  });

  describe('select fields', () => {
    it('renders a Select for select field', () => {
      render(
        <FormField
          name="institution"
          type="select"
          value=""
          options={[
            {
              label: 'Itaú',
              value: 'itau',
            },
            {
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
        />,
      );

      expect(
        screen.getByTestId('form-select'),
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId('form-input'),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('form-textarea'),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('form-autocomplete'),
      ).not.toBeInTheDocument();
    });

    it('passes options to Select', () => {
      render(
        <FormField
          name="institution"
          type="select"
          value=""
          options={[
            {
              label: 'Itaú',
              value: 'itau',
            },
            {
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
        />,
      );

      expect(
        screen.getByRole('option', {
          name: 'Itaú',
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', {
          name: 'Nubank',
        }),
      ).toBeInTheDocument();
    });
  });

  describe('autocomplete fields', () => {
    it('renders an Autocomplete for autocomplete field', () => {
      render(
        <FormField
          name="institution"
          type="autocomplete"
          value=""
          options={[
            {
              key: 'itau',
              label: 'Itaú',
              value: 'itau',
            },
            {
              key: 'nubank',
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
        />,
      );

      expect(
        screen.getByTestId('form-autocomplete'),
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId('form-input'),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('form-textarea'),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('form-select'),
      ).not.toBeInTheDocument();
    });

    it('passes options to Autocomplete', () => {
      render(
        <FormField
          name="institution"
          type="autocomplete"
          value=""
          options={[
            {
              key: 'itau',
              label: 'Itaú',
              value: 'itau',
            },
            {
              key: 'nubank',
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
        />,
      );

      expect(
        screen.getByText('Itaú'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Nubank'),
      ).toBeInTheDocument();
    });
  });

  describe('common properties', () => {
    it('passes common properties to Input', () => {
      render(
        <FormField
          name="email"
          type="email"
          label="E-mail"
          value="test@example.com"
          hidden
          disabled
          placeholder="Enter your e-mail"
          isInvalid
          errorMessage="Invalid e-mail"
        />,
      );

      const input = screen
      .getByTestId('form-input')
      .querySelector('input');

      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveValue('test@example.com');
      expect(input).toHaveAttribute(
        'placeholder',
        'Enter your e-mail',
      );
      expect(input).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(input).toHaveAttribute(
        'data-error-message',
        'Invalid e-mail',
      );
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('hidden');

      expect(screen.getByText('E-mail')).toBeInTheDocument();
    });

    it('passes common properties to Textarea', () => {
      render(
        <FormField
          name="description"
          type="description"
          label="Description"
          value="Some text"
          hidden
          disabled
          placeholder="Enter a description"
          isInvalid
          errorMessage="Description is invalid"
        />,
      );

      const textarea = screen
      .getByTestId('form-textarea')
      .querySelector('textarea');

      expect(textarea).toHaveAttribute(
        'name',
        'description',
      );
      expect(textarea).toHaveValue('Some text');
      expect(textarea).toHaveAttribute(
        'placeholder',
        'Enter a description',
      );
      expect(textarea).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(textarea).toHaveAttribute(
        'data-error-message',
        'Description is invalid',
      );
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('hidden');

      expect(
        screen.getByText('Description'),
      ).toBeInTheDocument();
    });

    it('passes Select presentation properties', () => {
      render(
        <FormField
          name="institution"
          type="select"
          value=""
          options={[
            {
              label: 'Itaú',
              value: 'itau',
            },
          ]}
          presentation={{
            size: 'lg',
          }}
        />,
      );

      const select = screen
      .getByTestId('form-select')
      .querySelector('select');

      expect(select).toHaveAttribute(
        'data-size',
        'lg',
      );
    });

    it('passes Autocomplete presentation properties', () => {
      render(
        <FormField
          name="institution"
          type="autocomplete"
          value=""
          options={[
            {
              key: 'itau',
              label: 'Itaú',
              value: 'itau',
            },
          ]}
          presentation={{
            maxOptions: 5,
            noResultsText: 'Nenhuma instituição encontrada',
          }}
        />,
      );

      const input = screen
      .getByTestId('form-autocomplete')
      .querySelector('input');

      expect(input).toHaveAttribute(
        'data-max-options',
        '5',
      );

      expect(input).toHaveAttribute(
        'data-no-results-text',
        'Nenhuma instituição encontrada',
      );
    });
  });

  describe('presentation', () => {
    it('passes Input presentation properties', () => {
      render(
        <FormField
          name="email"
          type="email"
          value=""
          presentation={{
            mask: '###',
            size: 'lg',
          }}
        />,
      );

      const input = screen
      .getByTestId('form-input')
      .querySelector('input');

      expect(input).toHaveAttribute(
        'data-mask',
        'true',
      );
      expect(input).toHaveAttribute(
        'data-size',
        'lg',
      );
    });

    it('passes Textarea presentation properties', () => {
      render(
        <FormField
          name="description"
          type="description"
          value=""
          presentation={{
            rows: 5,
            maxLength: 500,
            showCharacterCount: true,
          }}
        />,
      );

      const textarea = screen
      .getByTestId('form-textarea')
      .querySelector('textarea');

      expect(textarea).toHaveAttribute(
        'data-rows',
        '5',
      );
      expect(textarea).toHaveAttribute(
        'data-max-length',
        '500',
      );
      expect(textarea).toHaveAttribute(
        'data-show-character-count',
        'true',
      );
    });
  });

  describe('callbacks', () => {
    it('passes onValueChange to Input', () => {
      const onValueChange = jest.fn();

      render(
        <FormField
          name="email"
          type="email"
          value=""
          onValueChange={onValueChange}
        />,
      );

      const input = screen
      .getByTestId('form-input')
      .querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: 'john@example.com',
        },
      });

      expect(onValueChange).toHaveBeenCalledWith(
        'john@example.com',
        'email',
        expect.any(Object),
      );
    });

    it('passes onValueChange to Textarea', () => {
      const onValueChange = jest.fn();

      render(
        <FormField
          name="description"
          type="description"
          value=""
          onValueChange={onValueChange}
        />,
      );

      const textarea = screen
      .getByTestId('form-textarea')
      .querySelector('textarea');

      fireEvent.change(textarea!, {
        target: {
          value: 'Some description',
        },
      });

      expect(onValueChange).toHaveBeenCalledWith(
        'Some description',
        'description',
        expect.any(Object),
      );
    });

    it('passes onValueChange to Select', () => {
      const onValueChange = jest.fn();

      render(
        <FormField
          name="institution"
          type="select"
          value=""
          options={[
            {
              label: 'Itaú',
              value: 'itau',
            },
            {
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
          onValueChange={onValueChange}
        />,
      );

      const select = screen
      .getByTestId('form-select')
      .querySelector('select');

      fireEvent.change(select!, {
        target: {
          value: 'nubank',
        },
      });

      expect(onValueChange).toHaveBeenCalledWith(
        'nubank',
        'institution',
        expect.any(Object),
      );
    });

    it('passes onValueChange to Autocomplete', () => {
      const onValueChange = jest.fn();

      render(
        <FormField
          name="institution"
          type="autocomplete"
          value=""
          options={[
            {
              key: 'itau',
              label: 'Itaú',
              value: 'itau',
            },
            {
              key: 'nubank',
              label: 'Nubank',
              value: 'nubank',
            },
          ]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen
      .getByTestId('form-autocomplete')
      .querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: 'nubank',
        },
      });

      expect(onValueChange).toHaveBeenCalledWith(
        'nubank',
        'institution',
        expect.any(Object),
      );
    });
  });
});