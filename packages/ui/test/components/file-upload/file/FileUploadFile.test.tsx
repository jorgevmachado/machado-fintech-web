import { fireEvent, render, screen } from '@testing-library/react';

import { FileUploadFile } from '../../../../src/components/file-upload/file';

describe('FileUploadFile', () => {
  const createFile = (name: string, size: number): File => {
    const content = new Uint8Array(size);

    return new File([content], name, {
      type: 'application/pdf',
    });
  };

  const defaultProps = {
    file: createFile('document.pdf', 500),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the file name', () => {
    render(
      <FileUploadFile {...defaultProps} />,
    );

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('should render the file size in bytes', () => {
    const file = createFile('document.pdf', 500);

    render(
      <FileUploadFile
        {...defaultProps}
        file={file}
      />,
    );

    expect(screen.getByText('500 B')).toBeInTheDocument();
  });

  it('should render the file size in kilobytes', () => {
    const file = createFile('document.pdf', 2048);

    render(
      <FileUploadFile
        {...defaultProps}
        file={file}
      />,
    );

    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('should render the file size in megabytes', () => {
    const file = createFile('document.pdf', 2 * 1024 * 1024);

    render(
      <FileUploadFile
        {...defaultProps}
        file={file}
      />,
    );

    expect(screen.getByText('2.0 MB')).toBeInTheDocument();
  });

  it('should render the remove button', () => {
    render(
      <FileUploadFile {...defaultProps} />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Remover document.pdf',
      }),
    ).toBeInTheDocument();
  });

  it('should call onRemove when clicking the remove button', () => {
    render(
      <FileUploadFile {...defaultProps} />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover document.pdf',
      }),
    );

    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRemove).toHaveBeenCalledWith(
      defaultProps.file,
    );
  });

  it('should render the error message', () => {
    const error = {
      code: 'INVALID_TYPE' as const,
      message: 'File type is not supported.',
    };

    render(
      <FileUploadFile
        {...defaultProps}
        error={error}
      />,
    );

    expect(
      screen.getByText('File type is not supported.'),
    ).toBeInTheDocument();
  });

  it('should render the error state', () => {
    const error = {
      code: 'INVALID_TYPE' as const,
      message: 'File type is not supported.',
    };

    render(
      <FileUploadFile
        {...defaultProps}
        error={error}
      />,
    );

    expect(screen.getByTestId('file-upload-file')).toHaveClass(
      'border-destructive/50',
      'bg-destructive/5',
    );
  });

  it('should not render the error message when there is no error', () => {
    render(
      <FileUploadFile {...defaultProps} />,
    );

    expect(
      screen.queryByText('File type is not supported.'),
    ).not.toBeInTheDocument();
  });

  it('should render the remove button as disabled', () => {
    render(
      <FileUploadFile
        {...defaultProps}
        disabled
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Remover document.pdf',
      }),
    ).toBeDisabled();
  });

  it('should not call onRemove when the remove button is disabled', () => {
    render(
      <FileUploadFile
        {...defaultProps}
        disabled
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover document.pdf',
      }),
    );

    expect(defaultProps.onRemove).not.toHaveBeenCalled();
  });
});