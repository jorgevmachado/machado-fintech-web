import { fireEvent, render, screen } from '@testing-library/react';

import { FileUpload } from '../../../src';

describe('FileUpload', () => {
  const createFile = (
    name: string,
    size: number,
    type = 'application/pdf',
  ): File => {
    const content = new Uint8Array(size);

    return new File([content], name, {
      type,
      lastModified: 1,
    });
  };

  const createDataTransfer = (files: File[]) => ({
    files,
    dropEffect: 'none',
  });

  const getInput = (container: HTMLElement) =>
    container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the upload area', () => {
    render(<FileUpload />);

    expect(
      screen.getByRole('button', {
        name: 'File upload area',
      }),
    ).toBeInTheDocument();
  });

  it('should render the upload instructions', () => {
    render(<FileUpload />);

    expect(
      screen.getByText('Arraste seus comprovantes aqui'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('ou clique para selecionar'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('PDF, JPG ou PNG'),
    ).toBeInTheDocument();
  });

  it('should configure the default accepted file types', () => {
    const { container } = render(<FileUpload />);

    expect(getInput(container)).toHaveAttribute(
      'accept',
      'application/pdf,image/jpeg,image/png',
    );
  });

  it('should configure custom accepted file types', () => {
    const { container } = render(
      <FileUpload
        accept={['application/pdf']}
      />,
    );

    expect(getInput(container)).toHaveAttribute(
      'accept',
      'application/pdf',
    );
  });

  it('should configure multiple files', () => {
    const { container } = render(
      <FileUpload multiple />,
    );

    expect(getInput(container)).toHaveAttribute(
      'multiple',
    );
  });

  it('should add a valid file selected through the input', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByText('document.pdf'),
    ).toBeInTheDocument();

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange).toHaveBeenCalledWith([file]);
  });

  it('should add multiple valid files when multiple is true', () => {
    const firstFile = createFile('first.pdf', 500);
    const secondFile = createFile('second.pdf', 1000);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        multiple
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [firstFile, secondFile],
      },
    });

    expect(
      screen.getByText('first.pdf'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('second.pdf'),
    ).toBeInTheDocument();

    expect(onFilesChange).toHaveBeenCalledWith([
      firstFile,
      secondFile,
    ]);
  });

  it('should add only the first file when multiple is false', () => {
    const firstFile = createFile('first.pdf', 500);
    const secondFile = createFile('second.pdf', 1000);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [firstFile, secondFile],
      },
    });

    expect(
      screen.getByText('first.pdf'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('second.pdf'),
    ).not.toBeInTheDocument();

    expect(onFilesChange).toHaveBeenCalledWith([
      firstFile,
    ]);
  });

  it('should reject an invalid file type', () => {
    const file = createFile(
      'document.txt',
      500,
      'text/plain',
    );

    const onFilesChange = jest.fn();
    const onError = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
        onError={onError}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByText('document.txt'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Tipo de arquivo não permitido.',
      ),
    ).toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      {
        code: 'INVALID_TYPE',
        message: 'Tipo de arquivo não permitido.',
      },
      file,
    );
  });

  it('should reject a file that exceeds maxSize', () => {
    const file = createFile(
      'large.pdf',
      2 * 1024 * 1024,
    );

    const onFilesChange = jest.fn();
    const onError = jest.fn();

    const { container } = render(
      <FileUpload
        maxSize={1024 * 1024}
        onFilesChange={onFilesChange}
        onError={onError}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByText(
        'O arquivo deve ter no máximo 1 MB.',
      ),
    ).toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalledWith(
      {
        code: 'FILE_TOO_LARGE',
        message: 'O arquivo deve ter no máximo 1 MB.',
      },
      file,
    );
  });

  it('should respect maxFiles', () => {
    const firstFile = createFile('first.pdf', 500);
    const secondFile = createFile('second.pdf', 500);

    const onFilesChange = jest.fn();
    const onError = jest.fn();

    const { container } = render(
      <FileUpload
        multiple
        maxFiles={1}
        onFilesChange={onFilesChange}
        onError={onError}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [firstFile, secondFile],
      },
    });

    expect(
      screen.getByText('first.pdf'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('second.pdf'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Você pode adicionar no máximo 1 arquivos.',
      ),
    ).toBeInTheDocument();

    expect(onFilesChange).toHaveBeenCalledWith([
      firstFile,
    ]);

    expect(onError).toHaveBeenCalledWith(
      {
        code: 'MAX_FILES_EXCEEDED',
        message:
          'Você pode adicionar no máximo 1 arquivos.',
      },
      secondFile,
    );
  });

  it('should reject valid files when maxFiles is zero', () => {
    const file = createFile('document.pdf', 500);

    const onFilesChange = jest.fn();
    const onError = jest.fn();

    const { container } = render(
      <FileUpload
        multiple
        maxFiles={0}
        onFilesChange={onFilesChange}
        onError={onError}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByText('document.pdf'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Você pode adicionar no máximo 0 arquivos.',
      ),
    ).toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalledWith(
      {
        code: 'MAX_FILES_EXCEEDED',
        message:
          'Você pode adicionar no máximo 0 arquivos.',
      },
      file,
    );
  });

  it('should not add duplicate files', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getAllByText('document.pdf'),
    ).toHaveLength(1);

    expect(onFilesChange).toHaveBeenCalledTimes(1);
  });

  it('should remove a file', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover document.pdf',
      }),
    );

    expect(
      screen.queryByText('document.pdf'),
    ).not.toBeInTheDocument();

    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('should remove a rejected file', () => {
    const file = createFile(
      'document.txt',
      500,
      'text/plain',
    );

    const onFilesChange = jest.fn();
    const onError = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
        onError={onError}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByText('document.txt'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Remover document.txt',
      }),
    );

    expect(
      screen.queryByText('document.txt'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Tipo de arquivo não permitido.',
      ),
    ).not.toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('should activate drag state on drag enter', () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragEnter(dropzone);

    expect(dropzone).toHaveClass('border-primary');
    expect(dropzone).toHaveClass('bg-primary/5');
  });

  it('should keep drag state active when leaving a nested drag target', () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragEnter(dropzone);
    fireEvent.dragEnter(dropzone);

    expect(dropzone).toHaveClass('border-primary');

    fireEvent.dragLeave(dropzone);

    expect(dropzone).toHaveClass('border-primary');
  });

  it('should deactivate drag state on drag leave', () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragEnter(dropzone);
    fireEvent.dragLeave(dropzone);

    expect(dropzone).toHaveClass(
      'border-muted-foreground/25',
    );
  });

  it('should not change drag state on drag leave when disabled', () => {
    render(
      <FileUpload disabled />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragLeave(dropzone);

    expect(dropzone).toHaveClass(
      'border-muted-foreground/25',
    );
  });

  it('should set dropEffect to copy on drag over', () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    const dataTransfer = createDataTransfer([]);

    fireEvent.dragOver(dropzone, {
      dataTransfer,
    });

    expect(dataTransfer.dropEffect).toBe('copy');
  });

  it('should not change dropEffect when disabled', () => {
    render(
      <FileUpload disabled />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    const dataTransfer = createDataTransfer([]);

    fireEvent.dragOver(dropzone, {
      dataTransfer,
    });

    expect(dataTransfer.dropEffect).toBe('none');
  });

  it('should add files dropped on the dropzone', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.drop(dropzone, {
      dataTransfer: createDataTransfer([file]),
    });

    expect(
      screen.getByText('document.pdf'),
    ).toBeInTheDocument();

    expect(onFilesChange).toHaveBeenCalledWith([
      file,
    ]);
  });

  it('should reset drag state after dropping files', () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragEnter(dropzone);

    expect(dropzone).toHaveClass('border-primary');

    fireEvent.drop(dropzone, {
      dataTransfer: createDataTransfer([]),
    });

    expect(dropzone).toHaveClass(
      'border-muted-foreground/25',
    );
  });

  it('should not add files when disabled', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        disabled
        onFilesChange={onFilesChange}
      />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [file],
      },
    });

    expect(
      screen.queryByText('document.pdf'),
    ).not.toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('should not add dropped files when disabled', () => {
    const file = createFile('document.pdf', 500);
    const onFilesChange = jest.fn();

    render(
      <FileUpload
        disabled
        onFilesChange={onFilesChange}
      />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.drop(dropzone, {
      dataTransfer: createDataTransfer([file]),
    });

    expect(
      screen.queryByText('document.pdf'),
    ).not.toBeInTheDocument();

    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('should not activate drag state when disabled', () => {
    render(
      <FileUpload disabled />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.dragEnter(dropzone);

    expect(dropzone).toHaveClass(
      'border-muted-foreground/25',
    );
  });

  it('should use controlled files when value is provided', () => {
    const file = createFile('document.pdf', 500);

    render(
      <FileUpload value={[file]} />,
    );

    expect(
      screen.getByText('document.pdf'),
    ).toBeInTheDocument();
  });

  it('should call onFilesChange without changing controlled value', () => {
    const file = createFile('document.pdf', 500);
    const newFile = createFile('new.pdf', 500);
    const onFilesChange = jest.fn();

    const { rerender } = render(
      <FileUpload
        value={[file]}
        onFilesChange={onFilesChange}
      />,
    );

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.drop(dropzone, {
      dataTransfer: createDataTransfer([newFile]),
    });

    expect(onFilesChange).toHaveBeenCalledWith([
      file,
      newFile,
    ]);

    expect(
      screen.queryByText('new.pdf'),
    ).not.toBeInTheDocument();

    rerender(
      <FileUpload
        value={[file, newFile]}
        onFilesChange={onFilesChange}
      />,
    );

    expect(
      screen.getByText('new.pdf'),
    ).toBeInTheDocument();
  });

  it('should not open the file picker when disabled', () => {
    const { container } = render(
      <FileUpload disabled />,
    );

    const input = getInput(container);
    const clickSpy = jest.spyOn(input, 'click');

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.click(dropzone);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should open the file picker when clicking the dropzone', () => {
    const { container } = render(
      <FileUpload />,
    );

    const input = getInput(container);
    const clickSpy = jest.spyOn(input, 'click');

    const dropzone = screen.getByRole('button', {
      name: 'File upload area',
    });

    fireEvent.click(dropzone);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle input change when no files are provided', () => {
    const onFilesChange = jest.fn();

    const { container } = render(
      <FileUpload
        onFilesChange={onFilesChange}
      />,
    );

    const input = getInput(container);

    fireEvent.change(input, {
      target: {
        files: null,
      },
    });

    expect(onFilesChange).not.toHaveBeenCalled();

    expect(
      screen.queryByText('document.pdf'),
    ).not.toBeInTheDocument();
  });
});