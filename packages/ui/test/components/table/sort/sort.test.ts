import { act, renderHook } from '@testing-library/react';

import { useTableSort } from '../../../../src/components/table/sort';

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
    salary: 100,
  },
  {
    id: 3,
    name: 'Ana',
    salary: 200,
  },
];

describe('useTableSort', () => {
  it('should initialize without sort', () => {
    const { result } = renderHook(() => useTableSort(items));

    expect(result.current.sort).toBeUndefined();
  });

  it('should return the original items when there is no sort', () => {
    const { result } = renderHook(() => useTableSort(items));

    expect(result.current.sortedItems).toBe(items);
  });

  it('should return toggleSort function', () => {
    const { result } = renderHook(() => useTableSort(items));

    expect(result.current.toggleSort).toEqual(
      expect.any(Function),
    );
  });

  it('should set ascending sort when a column is selected', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.sort).toEqual({
      value: 'name',
      direction: 'asc',
    });
  });

  it('should set ascending sort when selecting another column', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(result.current.sort).toEqual({
      value: 'salary',
      direction: 'asc',
    });
  });

  it('should change sort from ascending to descending', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.sort).toEqual({
      value: 'name',
      direction: 'desc',
    });
  });

  it('should remove sort when toggling an already descending column', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.sort).toBeUndefined();
  });

  it('should sort string values in ascending order', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.sortedItems).toEqual([
      {
        id: 3,
        name: 'Ana',
        salary: 200,
      },
      {
        id: 1,
        name: 'João',
        salary: 300,
      },
      {
        id: 2,
        name: 'Marcos',
        salary: 100,
      },
    ]);
  });

  it('should sort string values in descending order', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      result.current.toggleSort('name');
    });

    expect(result.current.sortedItems).toEqual([
      {
        id: 2,
        name: 'Marcos',
        salary: 100,
      },
      {
        id: 1,
        name: 'João',
        salary: 300,
      },
      {
        id: 3,
        name: 'Ana',
        salary: 200,
      },
    ]);
  });

  it('should sort numeric values in ascending order', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(result.current.sortedItems).toEqual([
      {
        id: 2,
        name: 'Marcos',
        salary: 100,
      },
      {
        id: 3,
        name: 'Ana',
        salary: 200,
      },
      {
        id: 1,
        name: 'João',
        salary: 300,
      },
    ]);
  });

  it('should sort numeric values in descending order', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('salary');
    });

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(result.current.sortedItems).toEqual([
      {
        id: 1,
        name: 'João',
        salary: 300,
      },
      {
        id: 3,
        name: 'Ana',
        salary: 200,
      },
      {
        id: 2,
        name: 'Marcos',
        salary: 100,
      },
    ]);
  });

  it('should return zero when values are equal', () => {
    const equalItems: Item[] = [
      {
        id: 1,
        name: 'João',
        salary: 200,
      },
      {
        id: 2,
        name: 'Ana',
        salary: 200,
      },
    ];

    const { result } = renderHook(() => useTableSort(equalItems));

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(result.current.sortedItems).toEqual(equalItems);
  });

  it('should not mutate the original items when sorting', () => {
    const originalItems = [...items];

    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(items).toEqual(originalItems);
    expect(result.current.sortedItems).not.toBe(items);
  });

  it('should return the original items again when sort is removed', () => {
    const { result } = renderHook(() => useTableSort(items));

    act(() => {
      result.current.toggleSort('salary');
    });

    act(() => {
      result.current.toggleSort('salary');
    });

    act(() => {
      result.current.toggleSort('salary');
    });

    expect(result.current.sort).toBeUndefined();
    expect(result.current.sortedItems).toBe(items);
  });

  it('should update sorted items when items change', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useTableSort(items),
      {
        initialProps: {
          items,
        },
      },
    );

    act(() => {
      result.current.toggleSort('salary');
    });

    const updatedItems: Item[] = [
      {
        id: 4,
        name: 'Carlos',
        salary: 50,
      },
      {
        id: 5,
        name: 'Pedro',
        salary: 400,
      },
    ];

    rerender({
      items: updatedItems,
    });

    expect(result.current.sortedItems).toEqual([
      {
        id: 4,
        name: 'Carlos',
        salary: 50,
      },
      {
        id: 5,
        name: 'Pedro',
        salary: 400,
      },
    ]);
  });
});