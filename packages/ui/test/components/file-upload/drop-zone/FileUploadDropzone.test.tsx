import { fireEvent, render, screen } from '@testing-library/react';

import { FileUploadDropzone } from '../../../../src/components/file-upload/drop-zone';

describe('FileUploadDropzone', () => {
  const defaultProps = {
    onDrop: jest.fn(),
    onClick: jest.fn(),
    onDragOver: jest.fn(),
    onDragEnter: jest.fn(),
    onDragLeave: jest.fn(),
    isDragActive: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        <span>Upload files</span>
      </FileUploadDropzone>,
    );

    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });

  it('should render the upload area as a button', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        Upload
      </FileUploadDropzone>,
    );

    expect(
      screen.getByRole('button', {
        name: 'File upload area',
      }),
    ).toBeInTheDocument();
  });

  it('should render as disabled', () => {
    render(
      <FileUploadDropzone
        {...defaultProps}
        disabled
      >
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveAttribute('tabindex', '-1');
  });

  it('should render the active drag state', () => {
    render(
      <FileUploadDropzone
        {...defaultProps}
        isDragActive
      >
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    expect(dropzone).toHaveClass('border-[color:var(--app-accent-border,#3b82f6)]');
    expect(dropzone).toHaveClass('bg-[color:var(--app-accent-soft,#eff6ff)]');
  });

  it('should render the default drag state', () => {
    render(
      <FileUploadDropzone
        {...defaultProps}
        isDragActive={false}
      >
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    expect(dropzone).toHaveClass('border-[color:var(--app-border,#e2e8f0)]');
    expect(dropzone).toHaveClass('hover:border-[color:var(--app-accent-border,#3b82f6)]');
  });

  it('should call onClick when pressing Enter', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.keyDown(dropzone, {
      key: 'Enter',
    });

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when pressing Space', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.keyDown(dropzone, {
      key: ' ',
    });

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when pressing another key', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.keyDown(dropzone, {
      key: 'Escape',
    });

    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when pressing Enter while disabled', () => {
    render(
      <FileUploadDropzone
        {...defaultProps}
        disabled
      >
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.keyDown(dropzone, {
      key: 'Enter',
    });

    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('should prevent default when pressing Enter', () => {
    render(
      <FileUploadDropzone {...defaultProps}>
        Upload
      </FileUploadDropzone>,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    dropzone.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});