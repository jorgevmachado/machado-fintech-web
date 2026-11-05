import React from 'react';

import { render as renderComponent, screen } from '@testing-library/react';

import { buildTableCellTheme } from '@fintech/theme';

import { TableCell } from '../../../../src/components/table/cell';

jest.mock('@fintech/theme', () => ({
  buildTableCellTheme: jest.fn(),
}));

const mockResolveChildren = jest.fn((children) => children);

jest.mock('../../../../src/lang', () => ({
  useTranslationResolver: jest.fn(() => ({
    resolveChildren: mockResolveChildren,
  })),
}));

const mockBuildTableCellTheme = buildTableCellTheme as jest.Mock;

const render = (ui: React.ReactNode) => renderComponent(ui, {
  wrapper: ({ children }) => (
    <table><tbody><tr>{children}</tr></tbody></table>
  ),
});

describe('TableCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockBuildTableCellTheme.mockReturnValue({
      cell: 'cell-class',
      content: 'content-class',
    });

    mockResolveChildren.mockImplementation((children) => children);
  });

  describe('when type is body', () => {
    it('should render a td element', () => {
      render(
        <TableCell type="body" className="custom-class">
          Content
        </TableCell>,
      );

      expect(screen.getByText('Content').closest('td')).toBeInTheDocument();
    });
  });

  describe('when type is footer', () => {
    it('should render a td element', () => {
      render(
        <TableCell type="footer" className="custom-class">
          Content
        </TableCell>,
      );

      expect(screen.getByText('Content').closest('td')).toBeInTheDocument();
    });
  });

  describe('when type is header', () => {
    it('should render a th element', () => {
      render(
        <TableCell type="header" className="custom-class">
          Content
        </TableCell>,
      );

      expect(screen.getByText('Content').closest('th')).toBeInTheDocument();
    });
  });

  it('should apply the cell class returned by buildTableCellTheme', () => {
    render(
      <TableCell type="body" className="custom-class">
        Content
      </TableCell>,
    );

    const cell = screen.getByText('Content').closest('td');

    expect(cell).toHaveClass('cell-class');
  });

  it('should apply the cell class returned by buildTableCellTheme', () => {
    const { container } = render(
      <TableCell type="body" className="custom-class">
        Content
      </TableCell>,
    );

    const cell = container.querySelector('td');

    expect(cell).toHaveClass('cell-class');
  });

  it('should apply the content class returned by buildTableCellTheme', () => {
    const { container } = render(
      <TableCell type="body" className="custom-class">
        Content
      </TableCell>,
    );

    const content = container.querySelector('td > div');

    expect(content).toHaveClass('content-class');
  });

  it('should call buildTableCellTheme with type, className and align', () => {
    render(
      <TableCell
        type="body"
        className="custom-class"
        align="right"
      >
        Content
      </TableCell>,
    );

    expect(mockBuildTableCellTheme).toHaveBeenCalledTimes(1);
    expect(mockBuildTableCellTheme).toHaveBeenCalledWith(
      'body',
      'custom-class',
      'right',
    );
  });

  it('should resolve children with depth 5', () => {
    render(
      <TableCell type="body" className="custom-class">
        Content
      </TableCell>,
    );

    expect(mockResolveChildren).toHaveBeenCalledTimes(1);
    expect(mockResolveChildren).toHaveBeenCalledWith(
      'Content',
      5,
    );
  });

  it('should render multiple children', () => {
    render(
      <TableCell type="body" className="custom-class">
        <span>First</span>
        <span>Second</span>
      </TableCell>,
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('should not render the content wrapper when children are not provided', () => {
    const { container } = render(
      <TableCell type="body" className="custom-class" />,
    );

    expect(container.querySelector('td > div')).not.toBeInTheDocument();
    expect(mockResolveChildren).not.toHaveBeenCalled();
  });

  it('should not render the content wrapper when children are null', () => {
    const { container } = render(
      <TableCell type="body" className="custom-class">
        {null}
      </TableCell>,
    );

    expect(container.querySelector('td > div')).not.toBeInTheDocument();
    expect(mockResolveChildren).not.toHaveBeenCalled();
  });

  it('should render the content wrapper only when children exist', () => {
    const { rerender, container } = render(
      <TableCell type="body" className="custom-class">
        Content
      </TableCell>,
    );

    expect(container.querySelector('td > div')).toBeInTheDocument();

    rerender(
      <TableCell type="body" className="custom-class" />,
    );

    expect(container.querySelector('td > div')).not.toBeInTheDocument();
  });
});