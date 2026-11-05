import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { OIcon } from '@fintech/icons';

import IconCombobox from '../../src/components/icon-combobox';

jest.mock('@fintech/i18n', () => ({
  useAppTranslation: () => ({ locale: 'en-US', t: (value: string) => value }),
}));

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolve: <T,>(value: T) => value,
    resolveChildren: (value: React.ReactNode) => value,
  }),
}));

describe('<IconCombobox />', () => {
  it.each([0, -1, 1.5, NaN, Infinity])('rejects an invalid page size: %s', (pageSize) => {
    expect(() => render(<IconCombobox name="icon" pageSize={pageSize} />))
      .toThrow('IconCombobox pageSize must be a positive safe integer');
  });

  it('wraps keyboard navigation and supports Home and opening with ArrowUp', () => {
    render(<IconCombobox name="icon" pageSize={2} />);
    const input = screen.getByRole('combobox');
    const expectActive = (icon: string) => {
      expect(document.getElementById(input.getAttribute('aria-activedescendant') ?? ''))
        .toHaveAttribute('aria-label', icon);
    };
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expectActive(OIcon[1]);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expectActive(OIcon[0]);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expectActive(OIcon[1]);
    fireEvent.keyDown(input, { key: 'Home' });
    expectActive(OIcon[0]);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expectActive(OIcon[1]);
  });

  it('does not select or create an active descendant when no results are available', () => {
    const onValueChange = jest.fn();
    render(<IconCombobox name="icon" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'missing-icon-name' } });
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter']) {
      fireEvent.keyDown(input, { key });
      expect(input).not.toHaveAttribute('aria-activedescendant');
    }
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('No icons found');
  });

  it('highlights hovered options and prevents mouse down from moving input focus', () => {
    render(<IconCombobox name="icon" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    const option = screen.getByRole('option', { name: 'box' });
    fireEvent.mouseMove(option);
    expect(input).toHaveAttribute('aria-activedescendant', option.id);
    expect(fireEvent.mouseDown(option)).toBe(false);
    fireEvent.pointerDown(option);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('box');
  });

  it('respects prevented keyboard events and composition without changing selection', () => {
    const onKeyDown = jest.fn((event: React.KeyboardEvent<HTMLInputElement>) => event.preventDefault());
    const { rerender } = render(<IconCombobox name="icon" onKeyDown={onKeyDown} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender(<IconCombobox name="icon" />);
    fireEvent.keyDown(input, { key: 'ArrowDown', isComposing: true });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'a' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('forwards focus, click, clear and callback refs', () => {
    const ref = jest.fn();
    const onFocus = jest.fn();
    const onClick = jest.fn();
    const onClear = jest.fn();
    const { unmount } = render(
      <IconCombobox ref={ref} name="icon" defaultValue="wallet" fullWidth={false}
        aria-label="Choose icon" showClearButton onFocus={onFocus} onClick={onClick} onClear={onClear} />,
    );
    const input = screen.getByRole('combobox', { name: 'Choose icon' });
    expect(ref).toHaveBeenCalledWith(input);
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('listbox')).toHaveAccessibleName('Choose icon');
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.click(input);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Clear icon' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it('preserves event cancellation and propagation methods in selection callbacks', () => {
    const parentClick = jest.fn();
    const onValueChange = jest.fn((_value: string, _name: string, event: React.ChangeEvent<HTMLInputElement>) => {
      expect(event.isDefaultPrevented()).toBe(false);
      expect(event.isPropagationStopped()).toBe(false);
      event.preventDefault();
      event.stopPropagation();
      event.persist();
      expect(event.isDefaultPrevented()).toBe(true);
      expect(event.isPropagationStopped()).toBe(true);
      expect(event.currentTarget.value).toBe('tv');
    });
    render(<div onClick={parentClick}><IconCombobox name="icon" onValueChange={onValueChange} /></div>);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(fireEvent.click(screen.getByRole('option', { name: 'tv' }))).toBe(false);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('opens a configurable page and makes the entire catalog available through Show more', () => {
    render(<IconCombobox name="icon" pageSize={50} />);
    const input = screen.getByRole('combobox');
    fireEvent.click(input);

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(50);
    while (screen.queryByRole('button', { name: 'Show more' })) {
      fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    }

    expect(screen.getAllByRole('option').map((option) => option.getAttribute('aria-label'))).toEqual([...OIcon]);
  });

  it('searches the full catalog case-insensitively, resets pagination and reports no matches', () => {
    render(<IconCombobox name="icon" pageSize={2} noResultsText="No matches" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));
    fireEvent.change(input, { target: { value: ' WALLET ' } });

    const matches = OIcon.filter((icon) => icon.includes('wallet'));
    expect(screen.getAllByRole('option')).toHaveLength(Math.min(2, matches.length));
    expect(screen.getByRole('option', { name: 'wallet' })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'not-an-icon-at-all' } });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No matches');
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('selects by mouse without emitting values for search text and reopens the full list', () => {
    const onValueChange = jest.fn();
    render(<IconCombobox name="cardIcon" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'wallet' } });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('option', { name: 'wallet' }));
    expect(onValueChange).toHaveBeenCalledWith('wallet', 'cardIcon', expect.objectContaining({
      type: 'change', target: input, currentTarget: input,
    }));
    expect(input).toHaveValue('wallet');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(input);
    expect(screen.getAllByRole('option')).toHaveLength(24);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('wallet');
  });

  it('supports keyboard navigation, selection and controlled updates', () => {
    const onValueChange = jest.fn((nextValue: string, name: string, event: React.ChangeEvent<HTMLInputElement>) => {
      expect(event.target.value).toBe(nextValue);
      expect(event.currentTarget.value).toBe(nextValue);
      expect(event.target.name).toBe(name);
    });
    const { rerender } = render(
      <IconCombobox name="icon" value="wallet" onValueChange={onValueChange} pageSize={3} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.getElementById(input.getAttribute('aria-activedescendant') ?? '')).toHaveAttribute('aria-label', OIcon[0]);
    fireEvent.keyDown(input, { key: 'End' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(OIcon[1], 'icon', expect.objectContaining({ target: input }));
    expect(input).toHaveValue('wallet');

    rerender(<IconCombobox name="icon" value={OIcon[1]} onValueChange={onValueChange} />);
    expect(input).toHaveValue(OIcon[1]);
    fireEvent.focus(input);
    expect(screen.getByRole('option', { name: OIcon[1] })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps focus navigation within the popup open and dismisses on outside interaction', () => {
    render(<><IconCombobox name="icon" defaultValue="wallet" pageSize={2} /><button>Outside</button></>);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    const more = screen.getByRole('button', { name: 'Show more' });
    fireEvent.blur(input, { relatedTarget: more });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(more, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('wallet');

    fireEvent.click(input);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.click(input);
    fireEvent.blur(input, { relatedTarget: screen.getByRole('button', { name: 'Outside' }) });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it.each([{ disabled: true }, { readOnly: true }, { isLoading: true }])(
    'does not open or select when unavailable: %o',
    (props) => {
      const onValueChange = jest.fn();
      render(<IconCombobox name="icon" {...props} onValueChange={onValueChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.click(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.change(input, { target: { value: 'wallet' } });
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );

  it('does not clear a hidden selection', () => {
    const onClear = jest.fn();
    const onValueChange = jest.fn();
    const { container } = render(
      <IconCombobox
        name="icon"
        hidden
        defaultValue="wallet"
        showClearButton
        onClear={onClear}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(container.querySelector('button')!);

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('forwards the input ref and supports clearing an uncontrolled selection', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onValueChange = jest.fn();
    render(
      <IconCombobox ref={ref} name="icon" label="Card icon" defaultValue="wallet" showClearButton onValueChange={onValueChange} />,
    );
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Card icon' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear icon' }));
    expect(ref.current).toHaveValue('');
    expect(onValueChange).toHaveBeenCalledWith('', 'icon', expect.objectContaining({
      target: ref.current, currentTarget: ref.current, type: 'change',
    }));
  });

  it('uses unique listbox and option ids for multiple instances', () => {
    render(<><IconCombobox name="icon" label="First" /><IconCombobox name="icon" label="Second" /></>);
    const [first, second] = screen.getAllByRole('combobox');
    fireEvent.focus(first!);
    fireEvent.focus(second!);
    const lists = screen.getAllByRole('listbox');
    expect(lists[0]?.id).not.toBe(lists[1]?.id);
    expect(within(lists[0]!).getAllByRole('option')[0]?.id).not.toBe(within(lists[1]!).getAllByRole('option')[0]?.id);
  });
});
