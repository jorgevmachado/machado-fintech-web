import { act, renderHook } from '@testing-library/react';

import { useFilter, type FiltersProps } from '../../../src'

describe('useFilter', () => {
  const initialFilters = {
    name: '',
    type: '',
  };

  const initialInputFilters: FiltersProps['filters'] = [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Search name' },
    { name: 'type', label: 'Type', type: 'text', value: 'fire', placeholder: 'Search type' },
  ];

  it('applies and clears filters', () => {
    const fetchRequest = jest.fn();

    const { result } = renderHook(() =>
      useFilter<{ name: string; type: string }>({
        fetchRequest,
        initialFilters,
        initialInputFilters,
      }),
    );

    expect(result.current.filters).toEqual(initialFilters);
    expect(result.current.inputFilters).toEqual([
      { name: 'name', label: 'Name', type: 'text', value: '' , placeholder: 'Search name' },
      { name: 'type', label: 'Type', type: 'text', value: 'fire', placeholder: 'Search type' },
    ]);

    act(() => {
      result.current.applyFilters({ name: 'ash', type: 'water' });
    });

    expect(fetchRequest).toHaveBeenCalledWith({ name: 'ash', type: 'water' });
    expect(result.current.filters).toEqual({ name: 'ash', type: 'water' });

    act(() => {
      result.current.clearFilters();
    });

    expect(fetchRequest).toHaveBeenLastCalledWith(initialFilters);
    expect(result.current.filters).toEqual(initialFilters);
  });

  it('normalizes input filters, updates them, and clears them', () => {
    const fetchRequest = jest.fn();
    const normalizeFilters = jest.fn((nextFilters: { name: string; type: string }) => ({
      name: nextFilters.name.trim(),
      type: nextFilters.type.toUpperCase(),
    }));

    const { result } = renderHook(() =>
      useFilter<{ name: string; type: string }>({
        fetchRequest,
        initialFilters,
        normalizeFilters,
        initialInputFilters,
      }),
    );

    act(() => {
      result.current.applyInputFilters({ name: ' misty ', type: '' });
    });

    expect(normalizeFilters).toHaveBeenCalledWith({ name: ' misty ', type: '' });
    expect(fetchRequest).toHaveBeenCalledWith({ name: 'misty', type: '' });
    expect(result.current.inputFilters.map((filter) => filter.value)).toEqual([' misty ', '']);

    act(() => {
      result.current.updateInputFilters([
        { name: 'name', label: 'Name', type: 'text', value: 'brock', placeholder: 'Search name' },
      ]);
    });

    expect(result.current.inputFilters.map((filter) => filter.value)).toEqual(['brock', '']);

    act(() => {
      result.current.clearInputFilters();
    });

    expect(fetchRequest).toHaveBeenLastCalledWith(initialFilters);
    expect(result.current.inputFilters.map((filter) => filter.value)).toEqual(['', '']);
  });
});