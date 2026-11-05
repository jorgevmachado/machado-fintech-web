import React from 'react';

import { render, screen } from '@testing-library/react';

import { TableCell } from '../../../../src/components/table/cell';
import { TableBody } from '../../../../src/components/table/body';
import { TableBodyActions } from '../../../../src/components/table/body/actions';

jest.mock('../../../../src/components/table/cell', () => ({
  TableCell: jest.fn(({ children, type, align, className }) => (
    <td
      data-testid="table-cell"
      data-type={type}
      data-align={align}
      data-class-name={className}
    >
      {children}
    </td>
  )),
}));

jest.mock('../../../../src/components/table/body/actions', () => ({
  TableBodyActions: jest.fn(({ item, className }) => (
    <td
      data-testid="table-body-actions"
      data-item-id={item.id}
      data-class-name={className}
    />
  )),
}));

const mockTableCell = TableCell as jest.Mock;
const mockTableBodyActions = TableBodyActions as jest.Mock;

type Item = {
  id: number;
  name: string;
  salary: number;
  active?: boolean;
  value?: string | null;
};

const items: Item[] = [
  {
    id: 1,
    name: 'João',
    salary: 300,
    active: true,
    value: 'Value 1',
  },
  {
    id: 2,
    name: 'Marcos',
    salary: 200,
    active: false,
    value: 'Value 2',
  },
];

const headers = [
  {
    value: 'id' as keyof Item,
    label: 'ID',
  },
  {
    value: 'name' as keyof Item,
    label: 'Name',
  },
  {
    value: 'salary' as keyof Item,
    label: 'Salary',
    align: 'right' as const,
  },
];

const appearance = {
  background: 'body-background',
  border: 'body-border',
  cell: 'body-cell',
};

const actions = {
  edit: jest.fn(),
  delete: jest.fn(),
};

describe('TableBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a tbody element', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('tbody')).toBeInTheDocument();
  });

  it('should apply the background appearance to tbody', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('tbody')).toHaveClass('body-background');
  });

  it('should render one tr for each item', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelectorAll('tbody tr')).toHaveLength(items.length);
  });

  it('should apply the border appearance to every row', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      expect(row).toHaveClass('body-border');
    });
  });

  it('should render one TableCell for each header in each item', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(
      items.length * headers.length,
    );
  });

  it('should render TableCell with body type', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.type).toBe('body');
    });
  });

  it('should pass the cell appearance to every TableCell', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.className).toBe('body-cell');
    });
  });

  it('should pass the header align to TableCell', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    const firstRowCalls = mockTableCell.mock.calls.slice(0, headers.length);

    expect(firstRowCalls[0][0].align).toBeUndefined();
    expect(firstRowCalls[1][0].align).toBeUndefined();
    expect(firstRowCalls[2][0].align).toBe('right');
  });

  it('should render the item value when format is not provided', () => {
    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
            },
          ]}
          headers={[
            {
              value: 'name' as keyof Item,
              label: 'Name',
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    expect(screen.getByText('João')).toBeInTheDocument();
  });

  it('should convert the item value to string when format is not provided', () => {
    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
            },
          ]}
          headers={[
            {
              value: 'salary' as keyof Item,
              label: 'Salary',
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[0];

    expect(props.children).toBe('300');
  });

  it('should render an empty string when the item value is undefined', () => {
    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
            },
          ]}
          headers={[
            {
              value: 'value' as keyof Item,
              label: 'Value',
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[0];

    expect(props.children).toBe('--');
  });

  it('should render an empty string when the item value is null', () => {
    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
              value: null,
            },
          ]}
          headers={[
            {
              value: 'value' as keyof Item,
              label: 'Value',
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[0];

    expect(props.children).toBe('--');
  });

  it('should use format when it is provided', () => {
    const format = jest.fn(() => 'R$ 300,00');

    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
            },
          ]}
          headers={[
            {
              value: 'salary' as keyof Item,
              label: 'Salary',
              format,
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    expect(format).toHaveBeenCalledTimes(1);
    expect(screen.getByText('R$ 300,00')).toBeInTheDocument();
  });

  it('should call format with the item value and item', () => {
    const format = jest.fn(() => 'Formatted');

    const item = {
      id: 1,
      name: 'João',
      salary: 300,
    };

    render(
      <table>
        <TableBody
          items={[item]}
          headers={[
            {
              value: 'salary' as keyof Item,
              label: 'Salary',
              format,
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    expect(format).toHaveBeenCalledWith(300, item);
  });

  it('should use the formatted value instead of the original value', () => {
    const format = jest.fn(() => 'Formatted salary');

    render(
      <table>
        <TableBody
          items={[
            {
              id: 1,
              name: 'João',
              salary: 300,
            },
          ]}
          headers={[
            {
              value: 'salary' as keyof Item,
              label: 'Salary',
              format,
            },
          ]}
          appearance={appearance}
        />
      </table>,
    );

    expect(screen.getByText('Formatted salary')).toBeInTheDocument();
    expect(screen.queryByText('300')).not.toBeInTheDocument();
  });

  it('should render TableBodyActions for every item when actions are provided', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          actions={actions}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableBodyActions).toHaveBeenCalledTimes(items.length);
  });

  it('should pass the correct item to TableBodyActions', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          actions={actions}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableBodyActions.mock.calls[0][0].item).toBe(items[0]);
    expect(mockTableBodyActions.mock.calls[1][0].item).toBe(items[1]);
  });

  it('should pass actions to TableBodyActions', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          actions={actions}
          appearance={appearance}
        />
      </table>,
    );

    mockTableBodyActions.mock.calls.forEach(([props]) => {
      expect(props.actions).toBe(actions);
    });
  });

  it('should pass the cell appearance to TableBodyActions', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          actions={actions}
          appearance={appearance}
        />
      </table>,
    );

    mockTableBodyActions.mock.calls.forEach(([props]) => {
      expect(props.className).toBe('body-cell');
    });
  });

  it('should not render TableBodyActions when actions are not provided', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableBodyActions).not.toHaveBeenCalled();
  });

  it('should render no rows when items is empty', () => {
    render(
      <table>
        <TableBody
          items={[]}
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(mockTableCell).not.toHaveBeenCalled();
    expect(mockTableBodyActions).not.toHaveBeenCalled();
  });

  it('should render no cells when headers is empty', () => {
    render(
      <table>
        <TableBody
          items={items}
          headers={[]}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelectorAll('tbody tr')).toHaveLength(items.length);
    expect(mockTableCell).not.toHaveBeenCalled();
  });
});
