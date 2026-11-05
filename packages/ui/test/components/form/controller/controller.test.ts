import { act, renderHook } from '@testing-library/react';

import { useFormController } from '../../../../src/components/form/controller';

describe('useFormController', () => {
  it('initializes with empty data when initialValues is not provided', () => {
    const { result } = renderHook(() => useFormController());

    expect(result.current.data).toEqual({});
  });

  it('initializes with the provided initial values', () => {
    const initialValues = {
      name: 'Jorge',
      email: 'jorge@example.com',
    };

    const { result } = renderHook(() =>
      useFormController({ initialValues }),
    );

    expect(result.current.data).toEqual(initialValues);
  });

  it('returns the value of a field', () => {
    const { result } = renderHook(() =>
      useFormController({
        initialValues: {
          name: 'Jorge',
        },
      }),
    );

    expect(result.current.getValue('name')).toBe('Jorge');
  });

  it('returns an empty string when the field does not exist', () => {
    const { result } = renderHook(() => useFormController());

    expect(result.current.getValue('name')).toBe('');
  });

  it('sets a field value', () => {
    const { result } = renderHook(() =>
      useFormController({
        initialValues: {
          name: 'Jorge',
        },
      }),
    );

    act(() => {
      result.current.setValue('name', 'Carlos');
    });

    expect(result.current.data).toEqual({
      name: 'Carlos',
    });

    expect(result.current.getValue('name')).toBe('Carlos');
  });

  it('adds a new field value', () => {
    const { result } = renderHook(() =>
      useFormController({
        initialValues: {
          name: 'Jorge',
        },
      }),
    );

    act(() => {
      result.current.setValue('email', 'jorge@example.com');
    });

    expect(result.current.data).toEqual({
      name: 'Jorge',
      email: 'jorge@example.com',
    });
  });

  it('sets multiple values', () => {
    const { result } = renderHook(() =>
      useFormController({
        initialValues: {
          name: 'Jorge',
        },
      }),
    );

    const values = {
      name: 'Carlos',
      email: 'carlos@example.com',
      phone: '61999999999',
    };

    act(() => {
      result.current.setValues(values);
    });

    expect(result.current.data).toEqual(values);
  });

  it('replaces the current data when setting multiple values', () => {
    const { result } = renderHook(() =>
      useFormController({
        initialValues: {
          name: 'Jorge',
          email: 'jorge@example.com',
        },
      }),
    );

    act(() => {
      result.current.setValues({
        name: 'Carlos',
      });
    });

    expect(result.current.data).toEqual({
      name: 'Carlos',
    });
  });

  it('resets the data to the initial values', () => {
    const initialValues = {
      name: 'Jorge',
      email: 'jorge@example.com',
    };

    const { result } = renderHook(() =>
      useFormController({ initialValues }),
    );

    act(() => {
      result.current.setValue('name', 'Carlos');
      result.current.setValue('email', 'carlos@example.com');
    });

    expect(result.current.data).toEqual({
      name: 'Carlos',
      email: 'carlos@example.com',
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toEqual(initialValues);
  });

  it('resets the data to empty when initialized without values', () => {
    const { result } = renderHook(() => useFormController());

    act(() => {
      result.current.setValue('name', 'Jorge');
    });

    expect(result.current.data).toEqual({
      name: 'Jorge',
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toEqual({});
  });

  it('does not change current data when initialValues changes', () => {
    const { result, rerender } = renderHook(
      ({ initialValues }) =>
        useFormController({ initialValues }),
      {
        initialProps: {
          initialValues: {
            name: 'Jorge',
            email: 'jorge@example.com',
          },
        },
      },
    );

    act(() => {
      result.current.setValue('name', 'Carlos');
    });

    expect(result.current.data).toEqual({
      name: 'Carlos',
      email: 'jorge@example.com',
    });

    rerender({
      initialValues: {
        name: 'Pedro',
        email: 'pedro@example.com',
      },
    });

    expect(result.current.data).toEqual({
      name: 'Carlos',
      email: 'jorge@example.com',
    });
  });

  it('uses the latest initial values when reset is called', () => {
    const initialValues = {
      name: 'Jorge',
      email: 'jorge@example.com',
    };

    const { result } = renderHook(() =>
      useFormController({ initialValues }),
    );

    act(() => {
      result.current.setValues({
        name: 'Carlos',
        email: 'carlos@example.com',
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toEqual(initialValues);
  });
});