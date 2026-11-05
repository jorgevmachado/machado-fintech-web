import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { FileUploadInput } from '../../../../src/components/file-upload/input';

describe('FileUploadInput', () => {
  const defaultProps = {
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a file input', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    expect(
      container.querySelector('input[type="file"]'),
    ).toBeInTheDocument();
  });

  it('should render the input as hidden', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).toHaveAttribute('hidden');
  });

  it('should render the accepted file types', () => {
    const { container } = render(
      <FileUploadInput
        {...defaultProps}
        accept={['application/pdf', 'image/png', 'image/jpeg']}
      />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).toHaveAttribute(
      'accept',
      'application/pdf,image/png,image/jpeg',
    );
  });

  it('should not set accept when file types are not provided', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).not.toHaveAttribute('accept');
  });

  it('should allow multiple files when multiple is true', () => {
    const { container } = render(
      <FileUploadInput
        {...defaultProps}
        multiple
      />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).toHaveAttribute('multiple');
  });

  it('should not allow multiple files by default', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).not.toHaveAttribute('multiple');
  });

  it('should disable the input when disabled is true', () => {
    const { container } = render(
      <FileUploadInput
        {...defaultProps}
        disabled
      />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).toBeDisabled();
  });

  it('should not disable the input by default', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector('input[type="file"]');

    expect(input).not.toBeDisabled();
  });

  it('should call onChange when the input value changes', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    );

    fireEvent.change(input!);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it('should pass the change event to onChange', () => {
    const { container } = render(
      <FileUploadInput {...defaultProps} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    );

    fireEvent.change(input!);

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: input,
      }),
    );
  });

  it('should forward the ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <FileUploadInput
        {...defaultProps}
        ref={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'file');
  });
});