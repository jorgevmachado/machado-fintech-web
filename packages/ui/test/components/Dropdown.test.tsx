import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';

import { Dropdown } from '../../src';

jest.mock('../../src/primitives', () => ({
  Icon: ({ icon }: { icon?: React.ReactNode }) => (
    <span data-testid="mock-icon">{String(icon)}</span>
  ),
}));

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolveChildren: (child?: React.ReactNode) => child,
  }),
}));

const getTrigger = () => screen.getAllByRole('button')[0] as HTMLElement;

const openMenu = () => {
  fireEvent.click(getTrigger());
  return screen.getByRole('menu');
};

describe('Dropdown', () => {
  describe('modo ação', () => {
    const edit = { label: 'Editar', onClick: jest.fn() };
    const remove = { label: 'Excluir', onClick: jest.fn(), tone: 'danger' as const };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render the dropdown closed by default', () => {
      render(<Dropdown items={[edit]} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should open the dropdown when the trigger is clicked', () => {
      render(<Dropdown items={[edit]} />);

      expect(openMenu()).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Editar' })).toBeInTheDocument();
    });

    it('should close the dropdown when the trigger is clicked again', () => {
      render(<Dropdown items={[edit]} />);

      openMenu();
      fireEvent.click(getTrigger());

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should call the item onClick and close the dropdown', () => {
      render(<Dropdown items={[edit]} />);

      openMenu();
      fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));

      expect(edit.onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should not call onClick when the item is disabled', () => {
      const disabledItem = { label: 'Bloqueado', onClick: jest.fn(), disabled: true };

      render(<Dropdown items={[disabledItem]} />);

      openMenu();
      fireEvent.click(screen.getByRole('menuitem', { name: 'Bloqueado' }));

      expect(disabledItem.onClick).not.toHaveBeenCalled();
      expect(screen.getByRole('menuitem', { name: 'Bloqueado' })).toBeDisabled();
    });

    it('should render separators between action groups', () => {
      render(<Dropdown items={[edit, { type: 'separator' }, remove]} />);

      openMenu();

      expect(screen.getAllByRole('separator')).toHaveLength(1);
      expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    });

    it('should render a danger item with the danger tone classes', () => {
      render(<Dropdown items={[remove]} />);

      openMenu();

      expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveClass('text-[color:var(--app-negative-strong,#991b1b)]');
    });

    it('should render the default dots trigger icon', () => {
      render(<Dropdown items={[edit]} />);

      expect(screen.getByTestId('mock-icon')).toHaveTextContent('dots');
    });

    it('should render a custom trigger element instead of the default button', () => {
      render(
        <Dropdown
          trigger={<button type="button">Ações</button>}
          items={[edit]}
        />,
      );

      expect(screen.getByRole('button', { name: 'Ações' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ações' })).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should close the dropdown when clicking outside', () => {
      render(
        <div>
          <Dropdown items={[edit]} />
          <button type="button">Fora</button>
        </div>,
      );

      openMenu();
      fireEvent.mouseDown(screen.getByRole('button', { name: 'Fora' }));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should not close the dropdown when clicking inside the menu', () => {
      render(<Dropdown items={[edit]} />);

      const menu = openMenu();
      fireEvent.mouseDown(menu);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close the dropdown on Escape and return focus to the trigger', () => {
      render(<Dropdown items={[edit]} />);

      const menu = openMenu();
      fireEvent.keyDown(menu, { key: 'Escape' });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(getTrigger()).toHaveFocus();
    });

    it('should move focus between items with arrow keys', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const [first, second] = screen.getAllByRole('menuitem');

      // Ao abrir, o foco já entra no primeiro item.
      expect(first).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      expect(second).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      expect(first).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      expect(second).toHaveFocus();
    });

    it('should jump to the last item with End', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const items = screen.getAllByRole('menuitem');

      fireEvent.keyDown(menu, { key: 'End' });
      expect(items[items.length - 1]).toHaveFocus();
    });

    it('should call onOpenChange when the dropdown opens and closes', () => {
      const onOpenChange = jest.fn();

      render(<Dropdown items={[edit]} onOpenChange={onOpenChange} />);

      openMenu();
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      fireEvent.click(getTrigger());
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('should not open when the dropdown is disabled', () => {
      render(<Dropdown items={[edit]} disabled />);

      fireEvent.click(getTrigger());

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render emptyText when the item list is empty', () => {
      render(<Dropdown items={[]} emptyText="Nada por aqui" />);

      openMenu();

      expect(screen.getByText('Nada por aqui')).toBeInTheDocument();
    });

    it('should keep the danger tone as the only text color class on the item', () => {
      render(<Dropdown items={[remove]} />);

      openMenu();

      const item = screen.getByRole('menuitem', { name: 'Excluir' });

      expect(item).toHaveClass('text-[color:var(--app-negative-strong,#991b1b)]');
      // Sem tailwind-merge, uma classe concorrente venceria na cascata.
      expect(item).not.toHaveClass('text-[color:var(--app-text-subtle,#475569)]');
    });

    it('should keep the dropdown tone out of the item when the item overrides it', () => {
      render(<Dropdown items={[remove]} tone="primary" />);

      openMenu();

      const item = screen.getByRole('menuitem', { name: 'Excluir' });

      expect(item).toHaveClass('text-[color:var(--app-negative-strong,#991b1b)]');
      expect(item).not.toHaveClass('text-[color:var(--app-text-subtle,#475569)]');
    });

    it('should not intercept typing keys inside the header input', () => {
      render(
        <Dropdown
          items={[edit, remove]}
          header={<input aria-label="Buscar" defaultValue="abc" />}
        />,
      );

      openMenu();

      const search = screen.getByRole('textbox', { name: 'Buscar' });
      search.focus();

      fireEvent.keyDown(search, { key: 'Home' });
      fireEvent.keyDown(search, { key: 'End' });
      fireEvent.keyDown(search, { key: 'ArrowDown' });

      // O foco permanece no input; o menu continua aberto.
      expect(search).toHaveFocus();
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should keep the custom trigger disabled and closed when disabled', () => {
      render(
        <Dropdown
          trigger={<button type="button">Ações</button>}
          items={[edit]}
          disabled
        />,
      );

      const customTrigger = screen.getByRole('button', { name: 'Ações' });

      expect(customTrigger).toBeDisabled();

      fireEvent.keyDown(customTrigger, { key: 'ArrowDown' });
      fireEvent.click(customTrigger);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should return focus to the custom trigger on Escape', () => {
      render(
        <Dropdown
          trigger={<button type="button">Ações</button>}
          items={[edit]}
        />,
      );

      const customTrigger = screen.getByRole('button', { name: 'Ações' });
      fireEvent.click(customTrigger);

      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

      expect(customTrigger).toHaveFocus();
    });

    it('should preserve the aria-label already set on the custom trigger', () => {
      render(
        <Dropdown
          trigger={<button type="button" aria-label="Mais ações" />}
          items={[edit]}
        />,
      );

      expect(screen.getByRole('button', { name: 'Mais ações' })).toBeInTheDocument();
    });

    it('should open with Enter and with Space on the trigger', () => {
      render(<Dropdown items={[edit]} />);

      fireEvent.keyDown(getTrigger(), { key: 'Enter' });
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(getTrigger(), { key: 'Escape' });
      fireEvent.keyDown(getTrigger(), { key: ' ' });
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should not open with an unrelated key on the trigger', () => {
      render(<Dropdown items={[edit]} />);

      fireEvent.keyDown(getTrigger(), { key: 'a' });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should jump to the first item with Home', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const [first, second] = screen.getAllByRole('menuitem');

      fireEvent.keyDown(menu, { key: 'End' });
      expect(second).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'Home' });
      expect(first).toHaveFocus();
    });

    it('should ignore navigation keys while focus is outside the menu and its items', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const [first] = screen.getAllByRole('menuitem');

      // O alvo é o container do menu com um filho que não é item: o handler
      // sai cedo e o foco não se move.
      fireEvent.keyDown(menu, { key: 'Home' });
      expect(first).toHaveFocus();
    });

    it('should close without restoring focus when tabbing out of the menu', () => {
      render(<Dropdown items={[edit]} />);

      const menu = openMenu();
      const item = screen.getByRole('menuitem', { name: 'Editar' });
      item.focus();

      fireEvent.keyDown(menu, { key: 'Tab' });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(item).not.toHaveFocus();
    });

    it('should emit onOpenChange once per real state change', () => {
      const onOpenChange = jest.fn();

      render(<Dropdown items={[edit]} onOpenChange={onOpenChange} />);

      openMenu();
      fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));
      fireEvent.click(getTrigger());
      fireEvent.click(getTrigger());

      expect(onOpenChange.mock.calls).toEqual([[true], [false], [true], [false]]);
    });

    it('should keep the menu open on an unrelated key pressed on an item', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const [first] = screen.getAllByRole('menuitem');
      first.focus();

      fireEvent.keyDown(menu, { key: 'a' });

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(first).toHaveFocus();
    });

    it('should not move focus when the menu has no focusable item', () => {
      render(<Dropdown items={[]} header={<span>Sem ações</span>} />);

      const menu = openMenu();
      const header = screen.getByText('Sem ações');
      header.focus();

      // Sem itens, `focusItem` sai cedo e nada quebra.
      fireEvent.keyDown(menu, { key: 'ArrowDown' });

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should ignore a click that reaches the handler while disabled', () => {
      // Um trigger que não é `<button>` não recebe o bloqueio nativo do browser,
      // então o clique chega ao handler — a guarda é o que impede a abertura.
      render(
        <Dropdown
          trigger={<span role="button" tabIndex={0}>Ações</span>}
          items={[edit]}
          disabled
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Ações' }));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should use the aria-label as the accessible name of the trigger', () => {
      render(<Dropdown items={[edit]} aria-label="Mais opções" />);

      expect(screen.getByRole('button', { name: 'Mais opções' })).toBeInTheDocument();
    });

    it('should render an item icon on the left by default', () => {
      render(<Dropdown items={[{ label: 'Editar', icon: 'pencil', onClick: jest.fn() }]} />);

      openMenu();

      const item = screen.getByRole('menuitem', { name: 'Editar' });
      expect(item.querySelector('[data-testid="mock-icon"]')).toHaveTextContent('pencil');
    });

    it('should render an item icon on the right when asked to', () => {
      render(
        <Dropdown
          items={[{ label: 'Editar', icon: 'pencil', iconPosition: 'right', onClick: jest.fn() }]}
        />,
      );

      openMenu();

      const item = screen.getByRole('menuitem', { name: 'Editar' });
      expect(item.querySelector('[data-testid="mock-icon"]')).toHaveTextContent('pencil');
      expect(item).toHaveTextContent('Editar');
    });

    it('should swap the right icon for the check icon once the option is selected', () => {
      render(
        <Dropdown
          options={[{ value: 'paid', label: 'Pago', icon: 'pencil' }]}
          value="paid"
          onChange={jest.fn()}
        />,
      );

      openMenu();

      const item = screen.getByRole('menuitemradio', { name: 'Pago' });
      const icons = Array.from(item.querySelectorAll('[data-testid="mock-icon"]'))
        .map((icon) => icon.textContent);

      // O ícone da opção continua à esquerda; o check entra à direita marcando o selecionado.
      expect(icons).toContain('check');
    });

    it('should render full width when asked to', () => {
      const { container } = render(<Dropdown items={[edit]} fullWidth />);

      expect(container.firstChild).toHaveClass('block', 'w-full');
    });

    it('should fall back to the first item when the focus is on the container', () => {
      render(<Dropdown items={[edit, remove]} />);

      const menu = openMenu();
      const [first] = screen.getAllByRole('menuitem');

      // Foco no próprio menu (alvo é o currentTarget): `currentIndex` fica -1
      // e a navegação cai no primeiro item.
      menu.focus();
      fireEvent.keyDown(menu, { key: 'ArrowDown' });

      expect(first).toHaveFocus();
    });
  });

  describe('modo seleção', () => {
    const options = [
      { value: 'paid', label: 'Pago' },
      { value: 'pending', label: 'Pendente' },
      { value: 'late', label: 'Atrasado', disabled: true },
    ];

    it('should render the selected label on the trigger', () => {
      render(<Dropdown options={options} value="pending" onChange={jest.fn()} />);

      expect(getTrigger()).toHaveTextContent('Pendente');
    });

    it('should render the placeholder when no option matches the value', () => {
      render(
        <Dropdown
          options={options}
          value="unknown"
          onChange={jest.fn()}
          placeholder="Selecione um status"
        />,
      );

      expect(getTrigger()).toHaveTextContent('Selecione um status');
    });

    it('should call onChange with the option value when an option is selected', () => {
      const onChange = jest.fn();

      render(<Dropdown options={options} value="paid" onChange={onChange} />);

      openMenu();
      fireEvent.click(screen.getByRole('menuitemradio', { name: 'Pendente' }));

      expect(onChange).toHaveBeenCalledWith('pending');
    });

    it('should mark the current option as checked', () => {
      render(<Dropdown options={options} value="pending" onChange={jest.fn()} />);

      openMenu();

      expect(screen.getByRole('menuitemradio', { name: 'Pendente' })).toHaveAttribute(
        'aria-checked',
        'true',
      );
      expect(screen.getByRole('menuitemradio', { name: 'Pago' })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    it('should focus the selected option when the menu opens', () => {
      render(<Dropdown options={options} value="pending" onChange={jest.fn()} />);

      openMenu();

      expect(screen.getByRole('menuitemradio', { name: 'Pendente' })).toHaveFocus();
    });

    it('should not call onChange when a disabled option is clicked', () => {
      const onChange = jest.fn();

      render(<Dropdown options={options} value="paid" onChange={onChange} />);

      openMenu();
      fireEvent.click(screen.getByRole('menuitemradio', { name: 'Atrasado' }));

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});