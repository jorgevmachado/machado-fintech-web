import { fireEvent ,render ,screen  } from '@testing-library/react';
import { describe ,expect ,it ,jest  } from '@jest/globals';

import Modal from '../../../src/components/modal';

describe('Modal', () => {
  it('opens from a closed state and reopens after the exit animation', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal open={false} title="Lifecycle" onClose={onClose}>Content</Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Modal open title="Lifecycle" onClose={onClose}>Content</Modal>);
    expect(screen.getByRole('dialog')).toHaveClass('animate-modal-in');

    rerender(
      <Modal open={false} title="Lifecycle" onClose={onClose}>Content</Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('animate-modal-out');
    fireEvent.animationEnd(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Modal open title="Lifecycle" onClose={onClose}>Content</Modal>);
    expect(screen.getByRole('dialog')).toHaveClass('animate-modal-in');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not render when closed', () => {
    render(
      <Modal
        open={false}
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo do modal
      </Modal>,
    );

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo do modal
      </Modal>,
    );

    expect(
      screen.getByRole('dialog'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Teste Modal'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Conteúdo do modal'),
    ).toBeInTheDocument();
  });

  it('should render the title correctly', () => {
    render(
      <Modal
        open
        title="Título do Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Título do Modal',
      }),
    ).toBeInTheDocument();
  });

  it('should associate the dialog with the title', () => {
    render(
      <Modal
        open
        title="Título do Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    const title = screen.getByRole('heading', {
      name: 'Título do Modal',
    });

    expect(dialog).toHaveAttribute(
      'aria-labelledby',
      title.id,
    );
  });

  it('should have aria-modal enabled', () => {
    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.getByRole('dialog'),
    ).toHaveAttribute(
      'aria-modal',
      'true',
    );
  });

  it('should call onClose when the close button is clicked', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Close modal',
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape is pressed', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    fireEvent.keyDown(document, {
      key: 'Escape',
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when another key is pressed', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    fireEvent.keyDown(document, {
      key: 'Enter',
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when clicking the overlay', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(overlay).not.toBeNull();

    fireEvent.mouseDown(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking the modal content', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    fireEvent.mouseDown(dialog);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render the primary footer button', () => {
    const onPrimaryClick = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
        footer={{
          primary: {
            children: 'Salvar',
            onClick: onPrimaryClick,
          },
        }}
      >
        Conteúdo
      </Modal>,
    );

    const button = screen.getByRole('button', {
      name: 'Salvar',
    });

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it('should render the secondary footer button', () => {
    const onSecondaryClick = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
        footer={{
          primary: {
            children: 'Salvar',
          },
          secondary: {
            children: 'Cancelar',
            onClick: onSecondaryClick,
          },
        }}
      >
        Conteúdo
      </Modal>,
    );

    const button = screen.getByRole('button', {
      name: 'Cancelar',
    });

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(
      onSecondaryClick,
    ).toHaveBeenCalledTimes(1);
  });

  it('should not render the secondary button when it is not provided', () => {
    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
        footer={{
          primary: {
            children: 'Salvar',
          },
        }}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', {
        name: 'Cancelar',
      }),
    ).not.toBeInTheDocument();
  });

  it('should render the footer only when provided', () => {
    const { rerender } = render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.queryByRole('contentinfo'),
    ).not.toBeInTheDocument();

    rerender(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
        footer={{
          primary: {
            children: 'Salvar',
          },
        }}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.getByRole('contentinfo'),
    ).toBeInTheDocument();
  });

  it('should apply the enter animation when opened', () => {
    render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(dialog).toHaveClass(
      'animate-modal-in',
    );

    expect(overlay).toHaveClass(
      'animate-modal-overlay-in',
    );
  });

  it('should apply the exit animation when closed', () => {
    const { rerender } = render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    rerender(
      <Modal
        open={false}
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(dialog).toHaveClass(
      'animate-modal-out',
    );

    expect(overlay).toHaveClass(
      'animate-modal-overlay-out',
    );
  });

  it('should keep the modal mounted while the exit animation is running', () => {
    const { rerender } = render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    rerender(
      <Modal
        open={false}
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    expect(
      screen.getByRole('dialog'),
    ).toBeInTheDocument();
  });

  it('should unmount after the exit animation ends', () => {
    const { rerender } = render(
      <Modal
        open
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    rerender(
      <Modal
        open={false}
        title="Teste Modal"
        onClose={jest.fn()}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    fireEvent.animationEnd(dialog);

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument();
  });

  it('should remove the Escape listener after unmounting', () => {
    const onClose = jest.fn();

    const { rerender } = render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    rerender(
      <Modal
        open={false}
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    fireEvent.animationEnd(dialog);

    fireEvent.keyDown(document, {
      key: 'Escape',
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should not unmount when animation ends while modal is open' ,() => {
    render(<Modal open title="Teste Modal"
                  onClose={ jest.fn() }> Conteúdo </Modal> );
    const dialog = screen.getByRole('dialog');
    fireEvent.animationEnd(dialog);
    expect(screen.getByRole('dialog') ).toBeInTheDocument();
  });

  it('should not call onClose when clicking inside the modal', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(overlay).not.toBeNull();

    fireEvent.mouseDown(dialog);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when clicking the overlay itself', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(overlay).not.toBeNull();

    fireEvent.mouseDown(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking another element inside the overlay', () => {
    const onClose = jest.fn();

    render(
      <Modal
        open
        title="Teste Modal"
        onClose={onClose}
      >
        Conteúdo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    expect(overlay).not.toBeNull();

    const element = document.createElement('div');

    overlay!.appendChild(element);

    fireEvent.mouseDown(element);

    expect(onClose).not.toHaveBeenCalled();

    element.remove();
  });

});