import { fireEvent, render, screen, within } from '@testing-library/react';

import CategoryForm from '../components/form/CategoryForm';
import { Category } from '../domain';

const mockShowAlert = jest.fn();

jest.mock('@fintech/ui', () => ({
  ...jest.requireActual('@fintech/ui'),
  useAlert: () => ({ showAlert: mockShowAlert }),
}));

jest.mock('@fintech/i18n', () => ({
  ...jest.requireActual('@fintech/i18n'),
  useAppTranslation: () => ({
    locale: 'pt-BR',
    t: (key: string, values?: Record<string, unknown>) =>
      key === 'category.subcategory.form_title' ? `Subcategory ${values?.position}` : key,
  }),
}));

function addSubcategory(name = '') {
  fireEvent.click(screen.getByRole('button', { name: 'category.subcategory.add' }));
  const groups = screen.getAllByRole('group', { name: /Subcategory / });
  const group = groups[groups.length - 1]!;
  fireEvent.change(within(group).getByRole('textbox', { name: /^category\.subcategory\.name\.label/ }), {
    target: { value: name },
  });
  return group;
}

function save() {
  fireEvent.click(screen.getByRole('button', { name: 'form.action.save' }));
}

describe('CategoryForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requires a category name, a non-empty subcategory list and every subcategory name', () => {
    const onSubmit = jest.fn();
    render(<CategoryForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    save();
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox', { name: /^category\.name\.label/ }), {
      target: { value: 'Food' },
    });
    save();
    expect(screen.getByRole('alert')).toHaveTextContent('category.subcategory.required');

    addSubcategory('   ');
    save();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /^category\.subcategory\.name\.label/ }))
      .toHaveAttribute('aria-invalid', 'true');
    expect(mockShowAlert).toHaveBeenLastCalledWith(expect.objectContaining({
      message: 'category.subcategory.name.required',
    }));

    fireEvent.change(screen.getByRole('textbox', { name: /^category\.subcategory\.name\.label/ }), {
      target: { value: ' Groceries ' },
    });
    save();
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Food',
      subcategories: [expect.objectContaining({ name: 'Groceries', order: 1 })],
    }));
  });

  it('adds, moves and removes independent blocks without submitting or losing their values', () => {
    const onSubmit = jest.fn();
    const { container } = render(<CategoryForm onSubmit={onSubmit} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'category.name.label' }), {
      target: { value: 'Food' },
    });
    addSubcategory('Groceries');
    addSubcategory('Restaurants');
    addSubcategory('Coffee');

    let groups = screen.getAllByRole('group', { name: /Subcategory / });
    expect(within(groups[0]!).getByRole('button', { name: 'category.subcategory.move_up' })).toBeDisabled();
    expect(within(groups[2]!).getByRole('button', { name: 'category.subcategory.move_down' })).toBeDisabled();
    fireEvent.click(within(groups[1]!).getByRole('button', { name: 'category.subcategory.move_up' }));
    groups = screen.getAllByRole('group', { name: /Subcategory / });
    expect(within(groups[0]!).getByRole('textbox', { name: 'category.subcategory.name.label' }))
      .toHaveValue('Restaurants');

    fireEvent.click(within(groups[0]!).getByRole('button', { name: 'category.subcategory.move_down' }));
    groups = screen.getAllByRole('group', { name: /Subcategory / });
    fireEvent.click(within(groups[1]!).getByRole('button', { name: 'category.subcategory.remove' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelectorAll('form')).toHaveLength(1);

    save();
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      subcategories: [
        expect.objectContaining({ name: 'Groceries', order: 1 }),
        expect.objectContaining({ name: 'Coffee', order: 2 }),
      ],
    }));
  });

  it('preserves identifiers, colors, icons and inactive statuses when editing in order', () => {
    const item = Category.create({
      id: 'category-1',
      name: 'Food',
      color: '#123456',
      icon: 'wallet',
      is_active: false,
      created_at: new Date('2026-01-01T00:00:00Z'),
      subcategories: [
        {
          id: 'subcategory-2', name: 'Restaurants', color: '#abcdef', icon: 'home',
          order: 10, is_active: false, created_at: new Date('2026-01-01T00:00:00Z'),
        },
        {
          id: 'subcategory-1', name: 'Groceries', color: '#654321', icon: 'wallet',
          order: 5, is_active: true, created_at: new Date('2026-01-01T00:00:00Z'),
        },
      ],
    });
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<CategoryForm item={item} onSubmit={onSubmit} onCancel={onCancel} />);

    const groups = screen.getAllByRole('group', { name: /Subcategory / });
    fireEvent.change(within(groups[0]!).getByRole('textbox', { name: 'category.subcategory.color.label' }), {
      target: { value: '#111111' },
    });
    const iconInput = within(groups[0]!).getByRole('combobox', { name: 'category.subcategory.icon.label' });
    fireEvent.focus(iconInput);
    fireEvent.change(iconInput, { target: { value: 'home' } });
    fireEvent.click(within(groups[0]!).getByRole('option', { name: 'home' }));
    save();
    expect(onSubmit).toHaveBeenCalledWith({
      id: 'category-1', name: 'Food', color: '#123456', icon: 'wallet', is_active: false,
      subcategories: [
        {
          id: 'subcategory-1', name: 'Groceries', color: '#111111', icon: 'home',
          order: 1, is_active: true,
        },
        {
          id: 'subcategory-2', name: 'Restaurants', color: '#abcdef', icon: 'home',
          order: 2, is_active: false,
        },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: 'form.action.cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('blocks saving after removing the last subcategory', () => {
    const onSubmit = jest.fn();
    render(<CategoryForm onSubmit={onSubmit} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'category.name.label' }), {
      target: { value: 'Food' },
    });
    const group = addSubcategory('Groceries');
    expect(within(group).getByRole('button', { name: 'category.subcategory.move_up' })).toBeDisabled();
    expect(within(group).getByRole('button', { name: 'category.subcategory.move_down' })).toBeDisabled();
    fireEvent.click(within(group).getByRole('button', { name: 'category.subcategory.remove' }));

    save();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('category.subcategory.required');
  });
});
