import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Breadcrumb } from '../../../src';
import React from 'react';

jest.mock('../../../src/primitives', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`}>
      {icon}
    </span>
  ),
  Text: ({
    children,
    className,
    color,
  }: {
    children: React.ReactNode;
    className?: string;
    color?: string;
  }) => (
    <p className={`${color ?? ''} ${className ?? ''}`.trim()} aria-current="page">
      {children}
    </p>
  ),
}));

describe('Breadcrumb', () => {
  const breadcrumbs = [
    {
      href: '/home',
      label: 'Home',
      clickable: false,
      isCurrent: false,
      onItemClick: jest.fn(),
    },
    {
      href: '/accounts',
      label: 'Accounts',
      clickable: true,
      isCurrent: false,
      onItemClick: jest.fn(),
    },
    {
      href: '/accounts/edit',
      label: 'Edit',
      clickable: false,
      isCurrent: true,
      onItemClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render breadcrumb when breadcrumbs is empty', () => {
    render(
      <Breadcrumb breadcrumbs={[]} />
    );

    expect(
      screen.queryByRole('button', {
        name: 'Go to Home',
      })
    ).not.toBeInTheDocument();
  });

  it('should render home breadcrumb with default configuration', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );

    expect(
      screen.getByRole('button', {
        name: 'Go to Home',
      })
    ).toBeInTheDocument();
  });


  it('should not render breadcrumb item with same href as home', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );

    expect(
      screen.queryByText('Home')
    ).not.toBeInTheDocument();
  });


  it('should render all breadcrumb items except home', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );


    expect(
      screen.getByText('Accounts')
    ).toBeInTheDocument();


    expect(
      screen.getByText('Edit')
    ).toBeInTheDocument();
  });


  it('should render current breadcrumb correctly', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );


    const current = screen.getByText('Edit');


    expect(current).toHaveAttribute(
      'aria-current',
      'page'
    );
  });


  it('should render non clickable breadcrumb item as text', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );


    const item = screen.getByText('Edit');


    expect(item.tagName).toBe('P');
  });


  it('should render clickable breadcrumb item as button', () => {
    render(
      <Breadcrumb breadcrumbs={breadcrumbs} />
    );


    const item = screen.getByRole('button', {
      name: 'Accounts',
    });


    expect(item).toBeInTheDocument();
  });


  it('should call onItemClick when clicking breadcrumb item', () => {

    const onItemClick = jest.fn();

    const items = [
      {
        href: '/accounts',
        label: 'Accounts',
        clickable: true,
        isCurrent: false,
      },
    ];


    render(
      <Breadcrumb breadcrumbs={items} onItemClick={onItemClick} />
    );


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accounts',
      })
    );


    expect(onItemClick)
    .toHaveBeenCalledWith('/accounts');
  });


  it('should render custom home breadcrumb label', () => {
    render(
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        homeBreadcrumb={{
          label: 'Dashboard',
        }}
      />
    );


    expect(
      screen.getByRole('button', {
        name: 'Dashboard',
      })
    ).toBeInTheDocument();
  });


  it('should call home breadcrumb click handler', () => {

    const onItemClick = jest.fn();


    render(
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        onItemClick={onItemClick}
      />
    );


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to Home',
      })
    );


    expect(onItemClick)
    .toHaveBeenCalledWith('/home');
  });


  it('should render home label instead of icon when withIcon is false', () => {
    render(
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        homeBreadcrumb={{
          label: 'Dashboard',
          withIcon: false,
        }}
      />
    );


    expect(
      screen.getByText('Dashboard')
    ).toBeInTheDocument();
  });


  it('should remove default home breadcrumb from list', () => {

    const items = [
      {
        href: '/home',
        label: 'Home',
        clickable: false,
        isCurrent: true,
        onItemClick: jest.fn(),
      },
    ];


    render(
      <Breadcrumb breadcrumbs={items}/>
    );


    expect(
      screen.queryByText('Home')
    ).not.toBeInTheDocument();
  });

  it('should render custom home icon', () => {
    render(
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        homeBreadcrumb={{
          icon: 'dashboard',
          withIcon: true,
        }}
      />
    );


    expect(
      screen.getByTestId('icon-dashboard')
    ).toBeInTheDocument();
  });

  it('should call home onClick with home href', async () => {

    const user = userEvent.setup();

    const onItemClick = jest.fn();


    render(
      <Breadcrumb
        breadcrumbs={breadcrumbs}
        onItemClick={onItemClick}
      />
    );


    await user.click(
      screen.getByRole('button', {
        name: 'Go to Home',
      })
    );


    expect(onItemClick)
    .toHaveBeenCalledTimes(1);


    expect(onItemClick)
    .toHaveBeenCalledWith('/home');
  });

  it('should render breadcrumb item as text when clickable is false', () => {

    render(
      <Breadcrumb
        breadcrumbs={[
          {
            href: '/reports',
            label: 'Reports',
            clickable: false,
            isCurrent: false,
            onItemClick: jest.fn(),
          },
        ]}
      />
    );


    const item = screen.getByText('Reports');


    expect(item.tagName)
    .toBe('P');


    expect(item)
    .toHaveClass('text-slate-400');
  });
});