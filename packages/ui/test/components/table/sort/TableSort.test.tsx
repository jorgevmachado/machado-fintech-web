import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { Icon } from '../../../../src/primitives';

import { TableSort } from '../../../../src/components/table/sort';

jest.mock('../../../../src/primitives', () => ({
  Icon: jest.fn(({ onClick, ...props }) => (
    <button
      data-testid="icon"
      onClick={onClick}
      {...props}
    />
  )),
}));

const mockIcon = Icon as jest.Mock;

type Item = {
  id: number;
  name: string;
};

const toggleSort = jest.fn();

describe('TableSort', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Icon', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon).toHaveBeenCalledTimes(1);
  });

  it('should use unfold-more icon when column is not active', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].icon).toBe('unfold-more');
  });

  it('should use unfold-more icon when sort is for another column', () => {
    render(
      <TableSort
        sort={{
          value: 'id',
          direction: 'asc',
        }}
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].icon).toBe('unfold-more');
  });

  it('should use arrow-downward icon when active column direction is asc', () => {
    render(
      <TableSort
        sort={{
          value: 'name',
          direction: 'asc',
        }}
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].icon).toBe('arrow-downward');
  });

  it('should use arrow-upward icon when active column direction is desc', () => {
    render(
      <TableSort
        sort={{
          value: 'name',
          direction: 'desc',
        }}
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].icon).toBe('arrow-upward');
  });

  it('should pass cursor pointer and text color classes to Icon', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].className).toBe(
      'cursor-pointer text-slate-400',
    );
  });

  it('should pass sort column aria-label to Icon', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0]['aria-label']).toBe('Sort Column');
  });

  it('should pass an onClick handler to Icon', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    expect(mockIcon.mock.calls[0][0].onClick).toEqual(
      expect.any(Function),
    );
  });

  it('should call toggleSort with the column value when Icon is clicked', () => {
    render(
      <TableSort
        value="name"
        toggleSort={toggleSort}
      />,
    );

    fireEvent.click(
      document.querySelector('[data-testid="icon"]')!,
    );

    expect(toggleSort).toHaveBeenCalledTimes(1);
    expect(toggleSort).toHaveBeenCalledWith('name');
  });

  it('should call toggleSort with the correct value for another column', () => {
    render(
      <TableSort
        sort={{
          value: 'id',
          direction: 'asc',
        }}
        value="name"
        toggleSort={toggleSort}
      />,
    );

    fireEvent.click(
      document.querySelector('[data-testid="icon"]')!,
    );

    expect(toggleSort).toHaveBeenCalledTimes(1);
    expect(toggleSort).toHaveBeenCalledWith('name');
  });
});