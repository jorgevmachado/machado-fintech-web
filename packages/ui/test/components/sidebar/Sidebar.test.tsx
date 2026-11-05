import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Sidebar, type TMenuItem } from '../../../src';


jest.mock('../../../src/primitives', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`}>
      {icon}
    </span>
  ),
}));


const menuItems: Array<TMenuItem> = [
  {
    href: '/home',
    label: 'Home',
    icon: 'home',
  },
  {
    href: '/category',
    label: 'Category',
    icon: 'category',
    children: [
      {
        href: '/category/subcategory',
        label: 'Subcategory',
        icon: 'subcategory',
      },
    ],
  },
];


const renderSidebar = (
  props?: Partial<React.ComponentProps<typeof Sidebar>>,
) => {

  const defaultProps = {
    items: menuItems,
    variant: 'dark' as const,
    pathname: '/home',
    isCollapsed: false,

    logout: {
      label: 'Logout',
      onClick: jest.fn(),
    },

    onItemClick: jest.fn(),
  };


  return render(
    <Sidebar
      {...defaultProps}
      {...props}
    />,
  );
};


describe('Sidebar', () => {


  it('should render sidebar menu items', () => {

    renderSidebar({ tone: 'secondary' });


    expect(
      screen.getByText('Home'),
    ).toBeInTheDocument();


    expect(
      screen.getByText('Category'),
    ).toBeInTheDocument();

  });



  it('should render logout button', () => {

    renderSidebar();


    expect(
      screen.getByRole('button', {
        name: 'Logout',
      }),
    ).toBeInTheDocument();

  });



  it('should call onItemClick when clicking a menu item', () => {

    const onItemClick = jest.fn();


    renderSidebar({
      onItemClick,
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Home',
      }),
    );


    expect(onItemClick)
    .toHaveBeenCalledWith({
      href: '/home',
      label: 'Home',
      icon: 'home',
    });

  });



  it('should call logout callback when clicking logout', () => {

    const onLogout = jest.fn();


    renderSidebar({
      logout: {
        label: 'Logout',
        onClick: onLogout,
      },
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Logout',
      }),
    );


    expect(onLogout)
    .toHaveBeenCalledTimes(1);

  });



  it('should expand submenu when clicking toggle', () => {

    renderSidebar();


    expect(
      screen.queryByText('Subcategory'),
    )
    .not
    .toBeInTheDocument();



    fireEvent.click(
      screen.getByRole('button', {
        name: /Navigation Expand Section Category/i,
      }),
    );


    const childButton =
      screen.getByRole('button', {
        name: 'Subcategory',
      });


    expect(childButton)
    .toBeInTheDocument();

  });



  it('should mark active menu item based on pathname', () => {

    renderSidebar({
      pathname: '/home',
    });


    const homeButton =
      screen.getByRole('button', {
        name: 'Home',
      });


    expect(homeButton)
    .toHaveAttribute(
      'aria-current',
      'page',
    );

  });



  it('should hide labels when sidebar is collapsed', () => {

    renderSidebar({
      isCollapsed: true,
    });


    expect(
      screen.queryByText('Home'),
    )
    .not
    .toBeInTheDocument();


    expect(
      screen.queryByText('Logout'),
    )
    .not
    .toBeInTheDocument();

  });



  it('should apply primary dark theme classes', () => {

    const { container } = renderSidebar({
      tone: 'primary',
      variant: 'dark',
    });


    expect(
      container.firstChild,
    )
    .toHaveClass(
      'from-[#111d38]',
    );

  });

  it('should apply secondary light theme classes', () => {

    const { container } = renderSidebar({
      tone: 'secondary',
      variant: 'light',
    });


    expect(
      container.firstChild,
    )
    .toHaveClass(
      'from-[#faf5ff]',
    );

  });

  it('should call onItemClick when clicking submenu item', () => {

    const onItemClick = jest.fn();


    renderSidebar({
      onItemClick,
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: /Navigation Expand Section Category/i,
      }),
    );


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Subcategory',
      }),
    );


    expect(onItemClick)
    .toHaveBeenCalledWith({
      href: '/category/subcategory',
      label: 'Subcategory',
      icon: 'subcategory',
    });

  });

  it('should mark submenu item as active based on pathname', () => {

    renderSidebar({
      pathname: '/category/subcategory',
    });


    const childButton =
      screen.getByRole('button', {
        name: 'Subcategory',
      });


    expect(childButton)
    .toHaveAttribute(
      'aria-current',
      'page',
    );

  });

  it('should not mark inactive submenu item as current', () => {

    renderSidebar({
      pathname: '/category',
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: /Navigation Expand Section Category/i,
      }),
    );


    const childButton =
      screen.getByRole('button', {
        name: 'Subcategory',
      });


    expect(childButton)
    .not
    .toHaveAttribute(
      'aria-current',
    );

  });

  it('should call onItemClick when clicking submenu item', () => {
    const onItemClick = jest.fn();

    renderSidebar({
      onItemClick,
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: /Navigation Expand Section Category/i,
      }),
    );


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Subcategory',
      }),
    );


    expect(onItemClick)
    .toHaveBeenCalledWith({
      href: '/category/subcategory',
      icon: 'subcategory',
      label: 'Subcategory',
    });

  });

  it('should mark child item as active based on pathname', () => {

    renderSidebar({
      pathname: '/category/subcategory',
    });


    const childButton =
      screen.getByRole('button', {
        name: 'Subcategory',
      });


    expect(childButton)
    .toHaveAttribute(
      'aria-current',
      'page',
    );

  });

  it('should not mark inactive child item as current', () => {

    renderSidebar({
      pathname: '/category',
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: /Navigation Expand Section Category/i,
      }),
    );


    const childButton =
      screen.getByRole('button', {
        name: 'Subcategory',
      });


    expect(childButton)
    .not
    .toHaveAttribute(
      'aria-current',
    );

  });

  it('should disable menu items marked as disabled', () => {
    renderSidebar({
      items: [
        {
          href: '/restricted',
          label: 'Restricted',
          icon: 'lock',
          disabled: true,
        },
      ],
    });

    expect(
      screen.getByRole('button', { name: 'Restricted' }),
    ).toBeDisabled();
  });

});