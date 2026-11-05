import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Form from '../../../src/components/form/Form';
import type { FormProps } from '../../../src/components/form/types';
import { useFormController } from '../../../src/components/form/controller';
import { FormValidator } from '../../../src/components/form/validator';

jest.mock('../../../src/components/form/controller', () => ({
  useFormController: jest.fn(),
}));

jest.mock('../../../src/components/form/validator', () => ({
  FormValidator: jest.fn(),
}));

jest.mock('../../../src/components/form/field', () => ({
  FORM_FIELD_DEFINITIONS: {
    email: {
      label: 'Default email label',
      placeholder: 'Default email placeholder',
      validation: { required: true },
    },
    description: {
      label: 'Default description label',
      placeholder: 'Default description placeholder',
      validation: { minLength: 10 },
    },
  },
  FormField: ({
    name,
    label,
    placeholder,
    validation,
    value,
    isInvalid,
    errorMessage,
    onValueChange,
    onValueBlur,
  }: {
    name: string;
    label?: string;
    placeholder?: string;
    validation?: unknown;
    value: string;
    isInvalid?: boolean;
    errorMessage?: string;
    onValueChange: (value: string) => void;
    onValueBlur: () => void;
  }) => (
    <section
      data-testid={`field-${name}`}
      data-label={label}
      data-placeholder={placeholder}
      data-validation={JSON.stringify(validation)}
      data-value={value}
      data-invalid={String(isInvalid)}
      data-error-message={errorMessage}
    >
      <button type="button" onClick={() => onValueChange('changed value')}>
        Change {name}
      </button>
      <button type="button" onClick={onValueBlur}>
        Blur {name}
      </button>
    </section>
  ),
}));

jest.mock('../../../src/components/form/layout', () => ({
  FormLayout: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="layout" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

jest.mock('../../../src/components/form/actions', () => ({
  FormActions: (props: unknown) => (
    <div data-testid="actions" data-props={JSON.stringify(props)} />
  ),
}));

const mockUseFormController = jest.mocked(useFormController);
const MockFormValidator = jest.mocked(FormValidator);

const controller = {
  data: { email: 'initial@example.com', bio: 'Initial biography' },
  reset: jest.fn(),
  getValue: jest.fn((name: string) => controller.data[name] ?? ''),
  setValue: jest.fn(),
};

const validateField = jest.fn();
const validateFields = jest.fn();

const fields: FormProps['fields'] = [
  { type: 'email' },
  {
    type: 'description',
    name: 'bio',
    label: 'Biography',
    placeholder: 'Write about yourself',
    validation: { maxLength: 500 },
  },
];

function renderForm(overrides: Partial<FormProps> = {}) {
  const props: FormProps = {
    initialValues: controller.data,
    fields,
    ...overrides,
  };

  return render(<Form {...props} />);
}

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormController.mockReturnValue(controller);
    MockFormValidator.mockImplementation(
      () => ({ validateField, validateFields }) as never,
    );
    validateField.mockReturnValue({ isInvalid: false });
    validateFields.mockReturnValue({ isInvalid: false, fields: {} });
  });

  it('renders normalized fields with definition defaults and default styling', () => {
    const { container } = renderForm({ id: 'profile-form' });

    expect(mockUseFormController).toHaveBeenCalledWith({
      initialValues: controller.data,
    });
    expect(MockFormValidator).toHaveBeenCalledWith(undefined, undefined);
    expect(container.querySelector('form')).toHaveAttribute('id', 'profile-form');
    expect(container.querySelector('form')).toHaveClass('space-y-4');
    expect(screen.getByTestId('layout')).toHaveAttribute('data-props', '{}');
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-label',
      'Default email label',
    );
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-placeholder',
      'Default email placeholder',
    );
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-validation',
      JSON.stringify({ required: true }),
    );
    expect(screen.getByTestId('field-bio')).toHaveAttribute(
      'data-label',
      'Biography',
    );
    expect(screen.getByTestId('field-bio')).toHaveAttribute(
      'data-placeholder',
      'Write about yourself',
    );
    expect(screen.getByTestId('field-bio')).toHaveAttribute(
      'data-validation',
      JSON.stringify({ maxLength: 500 }),
    );
    expect(screen.queryByTestId('actions')).not.toBeInTheDocument();
  });

  it('forwards refs and renders configured layout, actions, and class name', () => {
    const ref = React.createRef<HTMLFormElement>();
    const actions: NonNullable<FormProps['actions']> = {
      submit: { children: 'Save', type: 'submit' },
      justify: 'end',
    };

    render(
      <Form
        ref={ref}
        initialValues={controller.data}
        fields={fields}
        className="custom-form"
        layout={{ cols: 2, gap: 4 }}
        actions={actions}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(ref.current).toHaveClass('space-y-4', 'custom-form');
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-props',
      JSON.stringify({ cols: 2, gap: 4 }),
    );
    expect(screen.getByTestId('actions')).toHaveAttribute(
      'data-props',
      JSON.stringify(actions),
    );
  });

  it('updates controller values and displays validation after a field blur', () => {
    validateField.mockReturnValue({
      isInvalid: true,
      errorMessage: 'Invalid email',
    });

    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Change email' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blur email' }));

    expect(controller.setValue).toHaveBeenCalledWith('email', 'changed value');
    expect(validateField).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email',
        type: 'email',
        label: 'Default email label',
      }),
      'initial@example.com',
      controller.data,
    );
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-invalid',
      'true',
    );
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-error-message',
      'Invalid email',
    );
  });

  it('prevents submission and reports invalid forms', () => {
    const onError = jest.fn();
    const validation = {
      isInvalid: true,
      fields: {
        email: { isInvalid: true, errorMessage: 'Email is required' },
      },
    };
    validateFields.mockReturnValue(validation);

    const { container } = renderForm({ onError });
    fireEvent.submit(container.querySelector('form')!);

    expect(validateFields).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'email' }),
        expect.objectContaining({ name: 'bio' }),
      ]),
      controller.data,
    );
    expect(onError).toHaveBeenCalledWith(validation);
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-error-message',
      'Email is required',
    );
  });

  it('reports valid forms to success handlers', () => {
    const onSuccess = jest.fn();
    const { container } = renderForm({ onSuccess });

    fireEvent.submit(container.querySelector('form')!);

    expect(onSuccess).toHaveBeenCalledWith(controller.data);
  });

  it('submits without optional callbacks', () => {
    const { container } = renderForm();

    fireEvent.submit(container.querySelector('form')!);
    validateFields.mockReturnValue({ isInvalid: true, fields: {} });
    fireEvent.submit(container.querySelector('form')!);

    expect(validateFields).toHaveBeenCalledTimes(2);
  });

  it('does not reset when initial values have the same data signature', () => {
    const { rerender } = renderForm();

    rerender(
      <Form
        initialValues={{ ...controller.data }}
        fields={fields}
      />,
    );

    expect(controller.reset).not.toHaveBeenCalled();
  });

  it('resets the controller and clears validations when initial values change', () => {
    const validation = {
      isInvalid: true,
      fields: {
        email: { isInvalid: true, errorMessage: 'Email is required' },
      },
    };
    validateFields.mockReturnValue(validation);

    const { container, rerender } = renderForm();
    fireEvent.submit(container.querySelector('form')!);

    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-error-message',
      'Email is required',
    );

    rerender(
      <Form
        initialValues={{ email: 'updated@example.com', bio: 'Updated biography' }}
        fields={fields}
      />,
    );

    expect(controller.reset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('field-email')).toHaveAttribute(
      'data-invalid',
      'undefined',
    );
    expect(screen.getByTestId('field-email')).not.toHaveAttribute(
      'data-error-message',
    );
  });
});