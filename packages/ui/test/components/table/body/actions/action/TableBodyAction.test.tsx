import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { buildTableActionTheme } from '@fintech/theme';

import { Icon } from '../../../../../../src/primitives';
import TableBodyAction from '../../../../../../src/components/table/body/actions/action';

jest.mock('@fintech/theme', () => ({
  buildTableActionTheme: jest.fn(),
}));

jest.mock('../../../../../../src/primitives', () => ({
  Icon: jest.fn(({ onClick, ...props }) => (
    <button
      data-testid="icon"
      onClick={onClick}
      {...props}
    />
  )),
}));

const mockBuildTableActionTheme = buildTableActionTheme as jest.Mock;
const mockIcon = Icon as jest.Mock;

type Item = {
  id: number;
  name: string;
};

const item: Item = {
  id: 1,
  name: 'João',
};

describe('TableBodyAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockBuildTableActionTheme.mockReturnValue('action-theme');
  });

  it('should render Icon', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
      />,
    );

    expect(mockIcon).toHaveBeenCalledTimes(1);
  });

  it('should pass icon to Icon', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
      />,
    );

    expect(mockIcon.mock.calls[0][0].icon).toBe('edit');
  });

  it('should pass additional props to Icon', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
        aria-label="Editar"
        title="Editar registro"
        data-testid="custom-icon"
      />,
    );

    expect(mockIcon.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        'aria-label': 'Editar',
        title: 'Editar registro',
        'data-testid': 'custom-icon',
      }),
    );
  });

  it('should build the action theme using the string icon and className', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
        className="custom-class"
      />,
    );

    expect(mockBuildTableActionTheme).toHaveBeenCalledTimes(1);
    expect(mockBuildTableActionTheme).toHaveBeenCalledWith(
      'edit',
      'custom-class',
    );
  });

  it('should pass the generated theme to Icon as className', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
        className="custom-class"
      />,
    );

    expect(mockIcon.mock.calls[0][0].className).toBe('action-theme');
  });

  it('should pass undefined icon to buildTableActionTheme when icon is not a string', () => {
    const icon = <span data-testid="custom-icon">Edit</span>;

    render(
      <TableBodyAction
        item={item}
        icon={icon}
        className="custom-class"
      />,
    );

    expect(mockBuildTableActionTheme).toHaveBeenCalledWith(
      undefined,
      'custom-class',
    );
  });

  it('should pass className to buildTableActionTheme when provided', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
        className="text-red-500"
      />,
    );

    expect(mockBuildTableActionTheme.mock.calls[0][0]).toBe('edit');
    expect(mockBuildTableActionTheme.mock.calls[0][1]).toBe('text-red-500');
  });

  it('should pass undefined className to buildTableActionTheme when not provided', () => {
    render(
      <TableBodyAction
        item={item}
        icon="edit"
      />,
    );

    expect(mockBuildTableActionTheme).toHaveBeenCalledWith(
      'edit',
      undefined,
    );
  });

  it('should call onClick with item when Icon is clicked', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(
      <TableBodyAction
        item={item}
        icon="edit"
        onClick={onClick}
      />,
    );

    fireEvent.click(getByTestId('icon'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(item);
  });

  it('should not throw when onClick is not provided', () => {
    const { getByTestId } = render(
      <TableBodyAction
        item={item}
        icon="edit"
      />,
    );

    expect(() => {
      fireEvent.click(getByTestId('icon'));
    }).not.toThrow();
  });

  it('should not call onClick when it is not provided', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(
      <TableBodyAction
        item={item}
        icon="edit"
        onClick={undefined}
      />,
    );

    fireEvent.click(getByTestId('icon'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should prevent the default click behavior', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(
      <TableBodyAction
        item={item}
        icon="edit"
        onClick={onClick}
      />,
    );

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    getByTestId('icon').dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('should stop click event propagation', () => {
    const onClick = jest.fn();
    const parentClick = jest.fn();

    const { getByTestId } = render(
      <div onClick={parentClick}>
        <TableBodyAction
          item={item}
          icon="edit"
          onClick={onClick}
        />
      </div>,
    );

    fireEvent.click(getByTestId('icon'));

    expect(parentClick).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should pass handleOnClick to Icon', () => {
    const onClick = jest.fn();

    render(
      <TableBodyAction
        item={item}
        icon="edit"
        onClick={onClick}
      />,
    );

    expect(mockIcon.mock.calls[0][0].onClick).toEqual(
      expect.any(Function),
    );
  });
});