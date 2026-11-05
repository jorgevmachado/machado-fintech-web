import React from 'react';

import { render, screen } from '@testing-library/react';

import { tableCellTheme } from '@fintech/theme';

import TableBodyAction from '../../../../../src/components/table/body/actions/action';
import { TableBodyActions } from '../../../../../src/components/table/body/actions';

jest.mock('@fintech/theme', () => ({
  tableCellTheme: jest.fn(),
}));

jest.mock('../../../../../src/components/table/body/actions/action', () => ({
  __esModule: true,
  default: jest.fn(({ item, ...props }) => (
    <button
      data-testid="table-body-action"
      data-item-id={item.id}
      {...props}
    />
  )),
}));

const mockTableCellTheme = tableCellTheme as jest.Mock;
const mockTableBodyAction = TableBodyAction as jest.Mock;

type Item = {
  id: number;
  name: string;
};

const item: Item = {
  id: 1,
  name: 'João',
};

const actions = {
  align: 'right' as const,
  icons: [
    {
      icon: 'edit',
      label: 'Edit',
    },
    {
      icon: 'delete',
      label: 'Delete',
    },
  ],
};

describe('TableBodyActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockTableCellTheme.mockReturnValue('cell-theme');
  });

  it('should render a td element', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(document.querySelector('td')).toBeInTheDocument();
  });

  it('should apply the theme returned by tableCellTheme to td', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(document.querySelector('td')).toHaveClass('cell-theme');
  });

  it('should call tableCellTheme with size sm, action align and className', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableCellTheme).toHaveBeenCalledTimes(1);
    expect(mockTableCellTheme).toHaveBeenCalledWith({
      size: 'sm',
      align: 'right',
      className: 'custom-class',
    });
  });

  it('should render the actions container', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    const cell = document.querySelector('td');
    const container = cell?.querySelector('div');

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'gap-2');
  });

  it('should render one TableBodyAction for each icon', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableBodyAction).toHaveBeenCalledTimes(actions.icons.length);
  });

  it('should pass the item to every TableBodyAction', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    mockTableBodyAction.mock.calls.forEach(([props]) => {
      expect(props.item).toBe(item);
    });
  });

  it('should pass icon properties to TableBodyAction', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableBodyAction.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        icon: 'edit',
        label: 'Edit',
        item,
      }),
    );

    expect(mockTableBodyAction.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        icon: 'delete',
        label: 'Delete',
        item,
      }),
    );
  });

  it('should not render TableBodyAction when icons are not provided', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={{
                align: 'right',
              }}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableBodyAction).not.toHaveBeenCalled();
  });

  it('should not render TableBodyAction when icons is empty', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={{
                align: 'right',
                icons: [],
              }}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableBodyAction).not.toHaveBeenCalled();
  });

  it('should pass undefined align to tableCellTheme when align is not provided', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={{
                icons: actions.icons,
              }}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(mockTableCellTheme).toHaveBeenCalledWith({
      size: 'sm',
      align: undefined,
      className: 'custom-class',
    });
  });

  it('should render the item information through TableBodyAction', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableBodyActions
              item={item}
              actions={actions}
              className="custom-class"
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getAllByTestId('table-body-action')).toHaveLength(
      actions.icons.length,
    );

    expect(
      screen.getAllByTestId('table-body-action')[0],
    ).toHaveAttribute('data-item-id', '1');

    expect(
      screen.getAllByTestId('table-body-action')[1],
    ).toHaveAttribute('data-item-id', '1');
  });
});

