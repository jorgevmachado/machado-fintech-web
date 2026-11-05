import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Pagination } from '../../../src';

jest.mock('@fintech/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string, params?: { page?: number }) => {
      if (params?.page) {
        return `${key}-${params.page}`;
      }

      return key;
    },
  }),
}));


jest.mock('@fintech/theme', () => ({
  buildButtonPaginationTheme: jest.fn(() => 'pagination-class'),
}));


jest.mock('../../../src/primitives', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}));


jest.mock('../../../src/components/pagination/business', () => ({
  clampPage: jest.fn(
    (page: number, totalPages: number) =>
      Math.min(Math.max(page, 1), totalPages),
  ),

  buildVisiblePages: jest.fn(() => [1, 2, 3]),
}));


describe('<Pagination />', () => {

  it('should not render when totalPages is less than or equal to one', () => {
    const { container } = render(
      <Pagination
        totalPages={1}
        currentPage={1}
      />,
    );

    expect(container.firstChild).toBeNull();
  });


  it('should render pagination navigation', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
      />,
    );


    expect(
      screen.getByRole('navigation'),
    ).toBeInTheDocument();


    expect(
      screen.getByLabelText('pagination.previous'),
    ).toBeInTheDocument();


    expect(
      screen.getByLabelText('pagination.next'),
    ).toBeInTheDocument();
  });

  it('should render the ellipsis when a previous page entry is missing', () => {
    const pages = [1, 2, 10];
    delete pages[1];
    jest
      .mocked(
        require('../../../src/components/pagination/business')
          .buildVisiblePages,
      )
      .mockReturnValueOnce(pages);

    render(<Pagination totalPages={10} currentPage={1} />);

    expect(screen.getByText('...')).toBeInTheDocument();
  });


  it('should use default pagination aria label', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
        ariaLabel="Pagination"
      />,
    );


    expect(
      screen.getByRole('navigation'),
    ).toHaveAttribute(
      'aria-label',
      'pagination.label',
    );
  });


  it('should use custom aria label', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
        ariaLabel="Custom pagination"
      />,
    );


    expect(
      screen.getByRole('navigation'),
    ).toHaveAttribute(
      'aria-label',
      'Custom pagination',
    );
  });


  it('should apply custom className', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
        className="custom-class"
      />,
    );


    expect(
      screen.getByRole('navigation'),
    ).toHaveClass(
      'custom-class',
    );
  });


  it('should disable current page button', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
      />,
    );


    const currentButton =
      screen.getByRole('button', {
        name: 'pagination.goToPage-2',
      });


    expect(currentButton)
    .toBeDisabled();


    expect(currentButton)
    .toHaveAttribute(
      'aria-current',
      'page',
    );
  });


  it('should disable previous button on first page', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={1}
      />,
    );


    expect(
      screen.getByLabelText('pagination.previous'),
    )
    .toBeDisabled();
  });


  it('should disable next button on last page', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={5}
      />,
    );


    expect(
      screen.getByLabelText('pagination.next'),
    )
    .toBeDisabled();
  });


  it('should call onPageChange when clicking a page', () => {
    const onPageChange = jest.fn();


    render(
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={onPageChange}
      />,
    );


    fireEvent.click(
      screen.getByRole('button', {
        name: 'pagination.goToPage-3',
      }),
    );


    expect(onPageChange)
    .toHaveBeenCalledWith(3);
  });


  it('should call onPageChange when clicking next', () => {
    const onPageChange = jest.fn();


    render(
      <Pagination
        totalPages={5}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );


    fireEvent.click(
      screen.getByLabelText('pagination.next'),
    );


    expect(onPageChange)
    .toHaveBeenCalledWith(3);
  });


  it('should call onPageChange when clicking previous', () => {
    const onPageChange = jest.fn();


    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    );


    fireEvent.click(
      screen.getByLabelText('pagination.previous'),
    );


    expect(onPageChange)
    .toHaveBeenCalledWith(2);
  });


  it('should not call onPageChange when loading', () => {
    const onPageChange = jest.fn();


    render(
      <Pagination
        totalPages={5}
        currentPage={2}
        isLoading
        onPageChange={onPageChange}
      />,
    );


    fireEvent.click(
      screen.getByLabelText('pagination.next'),
    );


    expect(onPageChange)
    .not
    .toHaveBeenCalled();
  });


  it('should disable all controls when loading', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        isLoading
      />,
    );


    screen
    .getAllByRole('button')
    .forEach(button => {
      expect(button)
      .toBeDisabled();
    });
  });


  it('should not throw without onPageChange', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
      />,
    );


    fireEvent.click(
      screen.getByLabelText('pagination.next'),
    );


    expect(
      screen.getByRole('navigation'),
    ).toBeInTheDocument();
  });


  it('should render ellipsis between pages', () => {
    jest
    .mocked(
      require('../../../src/components/pagination/business')
        .buildVisiblePages,
    )
    .mockReturnValue([
      1,
      2,
      10,
    ]);


    render(
      <Pagination
        totalPages={10}
        currentPage={2}
      />,
    );


    expect(
      screen.getByText('...'),
    )
    .toBeInTheDocument();
  });


  it('should render navigation icons', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={2}
      />,
    );


    expect(
      screen.getByTestId(
        'icon-chevron-left',
      ),
    )
    .toBeInTheDocument();


    expect(
      screen.getByTestId(
        'icon-chevron-right',
      ),
    )
    .toBeInTheDocument();
  });


  it('should clamp current page below minimum', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={0}
      />,
    );


    expect(
      screen.getByRole('button', {
        name: 'pagination.goToPage-1',
      }),
    )
    .toBeDisabled();
  });

});