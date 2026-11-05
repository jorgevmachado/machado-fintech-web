import React from 'react';

import { render, screen } from '@testing-library/react';

import { TableCell } from '../../../../src/components/table/cell';
import { TableHeader } from '../../../../src/components/table/header';
import { TableSort } from '../../../../src/components/table/sort';

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

jest.mock('../../../../src/components/table/sort', () => ({
  TableSort: jest.fn(() => (
    <span data-testid="table-sort" />
  )),
}));

const mockTableCell = TableCell as jest.Mock;
const mockTableSort = TableSort as jest.Mock;

type Item = {
  id: number;
  name: string;
  salary: number;
};

const headers = [
  {
    value: 'id',
    label: 'ID',
  },
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'salary',
    label: 'Salary',
    align: 'right' as const,
  },
];

const appearance = {
  background: 'header-background',
  cell: 'header-cell',
};

const sort = {
  field: 'name',
  direction: 'asc' as const,
};

const toggleSort = jest.fn();

describe('TableHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a thead element', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('thead')).toBeInTheDocument();
  });

  it('should apply the background appearance to thead', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('thead')).toHaveClass('header-background');
  });

  it('should render the header inside a tr', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    const header = document.querySelector('thead');

    expect(header?.querySelector('tr')).toBeInTheDocument();
  });

  it('should render one TableCell for each header', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length);
  });

  it('should render TableCell with header type', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.type).toBe('header');
    });
  });

  it('should pass the cell appearance to every TableCell', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.className).toBe('header-cell');
    });
  });

  it('should pass the header align to TableCell', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell.mock.calls[0][0].align).toBeUndefined();
    expect(mockTableCell.mock.calls[1][0].align).toBeUndefined();
    expect(mockTableCell.mock.calls[2][0].align).toBe('right');
  });

  it('should render the header label', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('should render TableSort when the header is sortable and toggleSort is provided', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: 'name',
              label: 'Name',
              sortable: true,
            },
          ]}
          sort={sort}
          toggleSort={toggleSort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort).toHaveBeenCalledTimes(1);
  });

  it('should pass sort, value and toggleSort to TableSort', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: 'name',
              label: 'Name',
              sortable: true,
            },
          ]}
          sort={sort}
          toggleSort={toggleSort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        sort,
        value: 'name',
        toggleSort,
      }),
    );
  });

  it('should not render TableSort when the header is not sortable', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: 'name',
              label: 'Name',
              sortable: false,
            },
          ]}
          sort={sort}
          toggleSort={toggleSort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort).not.toHaveBeenCalled();
  });

  it('should not render TableSort when sortable is not provided', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: 'name',
              label: 'Name',
            },
          ]}
          sort={sort}
          toggleSort={toggleSort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort).not.toHaveBeenCalled();
  });

  it('should not render TableSort when header value is undefined', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: undefined,
              label: 'Name',
              sortable: true,
            },
          ]}
          sort={sort}
          toggleSort={toggleSort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort).not.toHaveBeenCalled();
  });

  it('should not render TableSort when toggleSort is not provided', () => {
    render(
      <table>
        <TableHeader
          headers={[
            {
              value: 'name',
              label: 'Name',
              sortable: true,
            },
          ]}
          sort={sort}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableSort).not.toHaveBeenCalled();
  });

  it('should render an additional TableCell when action is provided', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          action={{
            text: 'Actions',
          }}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length + 1);
  });

  it('should pass action align to TableCell', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          action={{
            text: 'Actions',
            align: 'center',
          }}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[headers.length];

    expect(props.align).toBe('center');
  });

  it('should pass action text to TableCell', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          action={{
            text: 'Actions',
          }}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[headers.length];

    expect(props.children).toBe('Actions');
  });

  it('should pass header cell appearance to action TableCell', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          action={{
            text: 'Actions',
          }}
          appearance={appearance}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[headers.length];

    expect(props).toEqual(
      expect.objectContaining({
        type: 'header',
        className: 'header-cell',
      }),
    );
  });

  it('should not render an additional TableCell when action is not provided', () => {
    render(
      <table>
        <TableHeader
          headers={headers}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length);
  });
});


