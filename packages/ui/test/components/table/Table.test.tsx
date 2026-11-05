import React from 'react';

import { render } from '@testing-library/react';

import { buildTableTheme } from '@fintech/theme';

import Table from '../../../src/components/table';
import { useTableSort } from '../../../src/components/table/sort';
import { TableHeader } from '../../../src/components/table/header';
import { TableBody } from '../../../src/components/table/body';
import { TableFooter } from '../../../src/components/table/footer';

jest.mock('@fintech/theme', () => ({
  buildTableTheme: jest.fn(),
}));

jest.mock('../../../src/components/table/sort', () => ({
  useTableSort: jest.fn(),
}));

jest.mock('../../../src/components/table/header', () => ({
  TableHeader: jest.fn(() => (
    <thead data-testid="table-header" />
  )),
}));

jest.mock('../../../src/components/table/body', () => ({
  TableBody: jest.fn(() => (
    <tbody data-testid="table-body" />
  )),
}));

jest.mock('../../../src/components/table/footer', () => ({
  TableFooter: jest.fn(() => (
    <tfoot data-testid="table-footer" />
  )),
}));

const mockBuildTableTheme = buildTableTheme as jest.Mock;
const mockUseTableSort = useTableSort as jest.Mock;
const mockTableHeader = TableHeader as jest.Mock;
const mockTableBody = TableBody as jest.Mock;
const mockTableFooter = TableFooter as jest.Mock;

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
    name: 'Maria',
    salary: 200,
  },
];

const sortedItems: Item[] = [
  {
    id: 2,
    name: 'Maria',
    salary: 200,
  },
  {
    id: 1,
    name: 'João',
    salary: 300,
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
    sortable: true,
  },
];

const actions = {
  text: 'Actions',
  align: 'right' as const,
  icons: [
    {
      icon: 'edit',
      label: 'Edit',
    },
  ],
};

const footer = {
  id: {
    text: 'Total',
  },
  salary: {
    render: (items: Item[]) => items.reduce(
      (total, item) => total + item.salary,
      0,
    ),
  },
};

const appearance = {
  table: 'table-class',
};

const tableAppearance = {
  table: 'table-class',
  content: 'table-content-class',
  header: {
    background: 'header-background',
    cell: 'header-cell',
  },
  body: {
    background: 'body-background',
    border: 'body-border',
    cell: 'body-cell',
  },
  footer: {
    background: 'footer-background',
    cell: 'footer-cell',
  },
};

const sort = {
  value: 'salary' as keyof Item,
  direction: 'asc' as const,
};

const toggleSort = jest.fn();

describe('Table', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockBuildTableTheme.mockReturnValue(tableAppearance);

    mockUseTableSort.mockReturnValue({
      sort,
      toggleSort,
      sortedItems,
    });
  });

  it('should render the table wrapper', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(container.firstChild).toHaveClass('table-class');
  });

  it('should render the table content', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(container.querySelector('table')).toHaveClass(
      'table-content-class',
    );
  });

  it('should call useTableSort with items', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockUseTableSort).toHaveBeenCalledTimes(1);
    expect(mockUseTableSort).toHaveBeenCalledWith(items);
  });

  it('should call buildTableTheme with appearance', () => {
    render(
      <Table
        items={items}
        headers={headers}
        appearance={appearance}
      />,
    );

    expect(mockBuildTableTheme).toHaveBeenCalledTimes(1);
    expect(mockBuildTableTheme).toHaveBeenCalledWith(appearance);
  });

  it('should render TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader).toHaveBeenCalledTimes(1);
  });

  it('should pass sort to TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].sort).toBe(sort);
  });

  it('should pass toggleSort to TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].toggleSort).toBe(toggleSort);
  });

  it('should pass headers to TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].headers).toBe(headers);
  });

  it('should pass header appearance to TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].appearance).toBe(
      tableAppearance.header,
    );
  });

  it('should pass undefined action to TableHeader when actions are not provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].action).toBeUndefined();
  });

  it('should pass basic action to TableHeader', () => {
    render(
      <Table
        items={items}
        headers={headers}
        actions={actions}
      />,
    );

    expect(mockTableHeader.mock.calls[0][0].action).toEqual({
      text: 'Actions',
      align: 'right',
    });
  });

  it('should render TableBody', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableBody).toHaveBeenCalledTimes(1);
  });

  it('should pass sorted items to TableBody', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableBody.mock.calls[0][0].items).toBe(sortedItems);
  });

  it('should pass headers to TableBody', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableBody.mock.calls[0][0].headers).toBe(headers);
  });

  it('should pass actions to TableBody', () => {
    render(
      <Table
        items={items}
        headers={headers}
        actions={actions}
      />,
    );

    expect(mockTableBody.mock.calls[0][0].actions).toBe(actions);
  });

  it('should pass undefined actions to TableBody when actions are not provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableBody.mock.calls[0][0].actions).toBeUndefined();
  });

  it('should pass body appearance to TableBody', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableBody.mock.calls[0][0].appearance).toBe(
      tableAppearance.body,
    );
  });

  it('should not render TableFooter when footer is not provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
      />,
    );

    expect(mockTableFooter).not.toHaveBeenCalled();
  });

  it('should render TableFooter when footer is provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter).toHaveBeenCalledTimes(1);
  });

  it('should pass sorted items to TableFooter', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].items).toBe(sortedItems);
  });

  it('should pass footer columns to TableFooter', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].columns).toBe(footer);
  });

  it('should pass headers to TableFooter', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].headers).toBe(headers);
  });

  it('should pass footer appearance to TableFooter', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].appearance).toBe(
      tableAppearance.footer,
    );
  });

  it('should pass basic action to TableFooter', () => {
    render(
      <Table
        items={items}
        headers={headers}
        actions={actions}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].action).toEqual({
      text: 'Actions',
      align: 'right',
    });
  });

  it('should pass undefined action to TableFooter when actions are not provided', () => {
    render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    expect(mockTableFooter.mock.calls[0][0].action).toBeUndefined();
  });

  it('should render header, body and footer inside table', () => {
    const { container } = render(
      <Table
        items={items}
        headers={headers}
        footer={footer}
      />,
    );

    const table = container.querySelector('table');

    expect(table).toContainElement(
      container.querySelector('[data-testid="table-header"]'),
    );

    expect(table).toContainElement(
      container.querySelector('[data-testid="table-body"]'),
    );

    expect(table).toContainElement(
      container.querySelector('[data-testid="table-footer"]'),
    );
  });
});