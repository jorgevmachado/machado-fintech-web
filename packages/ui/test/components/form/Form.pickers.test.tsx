import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Form from '../../../src/components/form/Form';
import type { FormProps } from '../../../src/components/form/types';

jest.mock('../../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolve: <T,>(value: T) => value,
    resolveChildren: (value: React.ReactNode) => value,
  }),
}));

const fields: FormProps['fields'] = [
  { type: 'color', name: 'color', label: 'Card color', required: true },
  {
    type: 'icon-combobox',
    name: 'icon',
    label: 'Card icon',
    required: true,
    presentation: { pageSize: 2, showMoreText: 'More icons' },
  },
];

describe('Form picker fields', () => {
  it('submits color and icon selections using the real field controllers', () => {
    const onSuccess = jest.fn();
    const { container } = render(<Form fields={fields} initialValues={{ color: '#123456', icon: '' }} onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText('Select Color'), { target: { value: '#abcdef' } });
    const input = screen.getByRole('combobox', { name: 'Card icon' });
    fireEvent.click(input);
    expect(screen.getAllByRole('option')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'More icons' }));
    expect(screen.getAllByRole('option')).toHaveLength(4);
    fireEvent.change(input, { target: { value: 'wallet' } });
    fireEvent.click(screen.getByRole('option', { name: 'wallet' }));
    fireEvent.submit(container.querySelector('form')!);
    expect(onSuccess).toHaveBeenCalledWith({ color: '#abcdef', icon: 'wallet' });
  });

  it('reports required errors for both fields and clears them after valid submission', () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const { container } = render(
      <Form fields={fields} initialValues={{ color: '', icon: '' }} onError={onError} onSuccess={onSuccess} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.submit(container.querySelector('form')!);
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      isInvalid: true,
      fields: {
        color: expect.objectContaining({ isInvalid: true }),
        icon: expect.objectContaining({ isInvalid: true }),
      },
    }));
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(onSuccess).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '#abcdef' } });
    fireEvent.click(input);
    fireEvent.click(screen.getByRole('option', { name: 'tv' }));
    fireEvent.submit(container.querySelector('form')!);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith({ color: '#abcdef', icon: 'tv' });
  });

  it('validates icon fields on blur and forwards disabled and hidden states', () => {
    const { rerender } = render(<Form fields={fields} initialValues={{ color: '', icon: '' }} />);
    const input = screen.getByRole('combobox');
    fireEvent.blur(input);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<Form fields={[{ type: 'icon-combobox', name: 'icon', disabled: true }]} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender(<Form fields={[{ type: 'icon-combobox', name: 'icon', hidden: true }]} />);
    expect(screen.getByRole('combobox').closest('div.hidden')).toBeInTheDocument();
  });

  it('resets selected values and validation when initial values change', () => {
    const onSuccess = jest.fn();
    const { container, rerender } = render(
      <Form fields={fields} initialValues={{ color: '', icon: '' }} onSuccess={onSuccess} />,
    );
    fireEvent.submit(container.querySelector('form')!);
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    rerender(<Form fields={fields} initialValues={{ color: '#112233', icon: 'wallet' }} onSuccess={onSuccess} />);
    expect(screen.getByRole('textbox')).toHaveValue('#112233');
    expect(screen.getByLabelText('Select Color')).toHaveValue('#112233');
    expect(screen.getByRole('combobox')).toHaveValue('wallet');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    fireEvent.submit(container.querySelector('form')!);
    expect(onSuccess).toHaveBeenCalledWith({ color: '#112233', icon: 'wallet' });
  });
});
