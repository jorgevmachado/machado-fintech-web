import React from 'react';

import { render ,screen } from '@testing-library/react';

import { TableCell } from '../../../../src/components/table/cell';
import { TableFooter } from '../../../../src/components/table/footer';

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

const mockTableCell = TableCell as jest.Mock;

type Item = {
  id: number;
  name: string;
  salary: number;
};

const items: Item[] = [
  {
    id: 1,
    name: 'João',
    salary: 300,
  },
  {
    id: 2,
    name: 'Marcos',
    salary: 200,
  },
];

const headers = [
  {
    value: 'id',
  },
  {
    value: 'name',
  },
  {
    value: 'salary',
    align: 'right' as const,
  },
];

const appearance = {
  background: 'footer-background',
  cell: 'footer-cell',
};

describe('TableFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a tfoot element', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('tfoot')).toBeInTheDocument();
  });

  it('should apply the background appearance to tfoot', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(document.querySelector('tfoot')).toHaveClass('footer-background');
  });

  it('should render one TableCell for each header', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length);
  });

  it('should render TableCell with footer type', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.type).toBe('footer');
    });
  });

  it('should pass the cell appearance to every TableCell', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    mockTableCell.mock.calls.forEach(([props]) => {
      expect(props.className).toBe('footer-cell');
    });
  });

  it('should pass the header align to TableCell', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        align: undefined,
      }),
    );

    expect(mockTableCell.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        align: undefined,
      }),
    );

    expect(mockTableCell.mock.calls[2][0]).toEqual(
      expect.objectContaining({
        align: 'right',
      }),
    );
  });

  it('should use column text as the cell content', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={[
            {
              value: 'id',
            },
          ]}
          columns={{
            id: {
              text: 'Total',
            },
          }}
          appearance={appearance}
        />
      </table>,
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('should use column render result as the cell content', () => {
    const renderColumn = jest.fn(() => 'R$ 500,00');

    render(
      <table>
        <TableFooter
          items={items}
          headers={[
            {
              value: 'salary',
            },
          ]}
          columns={{
            salary: {
              render: renderColumn,
            },
          }}
          appearance={appearance}
        />
      </table>,
    );

    expect(renderColumn).toHaveBeenCalledTimes(1);
    expect(renderColumn).toHaveBeenCalledWith(items);
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument();
  });

  it('should prefer render over text when both are provided', () => {
    const renderColumn = jest.fn(() => 'Rendered');

    render(
      <table>
        <TableFooter
          items={items}
          headers={[
            {
              value: 'salary',
            },
          ]}
          columns={{
            salary: {
              render: renderColumn,
              text: 'Text',
            },
          }}
          appearance={appearance}
        />
      </table>,
    );

    expect(renderColumn).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Rendered')).toBeInTheDocument();
    expect(screen.queryByText('Text')).not.toBeInTheDocument();
  });

  it('should render no content when the column does not have render or text', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={[
            {
              value: 'salary',
            },
          ]}
          columns={{
            salary: {},
          }}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(1);

    const [props] = mockTableCell.mock.calls[0];

    expect(props.children).toBeNull();
  });

  it('should render no content when the column is not defined', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={[
            {
              value: 'salary',
            },
          ]}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(1);

    const [props] = mockTableCell.mock.calls[0];

    expect(props.children).toBeNull();
  });

  it('should render an additional TableCell when action is provided', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
          action={{
            text: 'Actions',
          }}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length + 1);
  });

  it('should render an empty TableCell for action', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
          action={{
            text: 'Actions',
          }}
        />
      </table>,
    );

    const [props] = mockTableCell.mock.calls[headers.length];

    expect(props).toEqual(
      expect.objectContaining({
        type: 'footer',
        className: 'footer-cell',
      }),
    );

    expect(props.children).toBeUndefined();
  });

  it('should not render an additional TableCell when action is not provided', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    expect(mockTableCell).toHaveBeenCalledTimes(headers.length);
  });

  it('should render the footer inside a tr', () => {
    render(
      <table>
        <TableFooter
          items={items}
          headers={headers}
          columns={{}}
          appearance={appearance}
        />
      </table>,
    );

    const footer = document.querySelector('tfoot');

    expect(footer?.querySelector('tr')).toBeInTheDocument();
  });
});

