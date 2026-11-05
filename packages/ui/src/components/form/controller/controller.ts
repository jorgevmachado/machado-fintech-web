'use client';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import type {
  FormController,
  FormControllerData,
} from './types';

type UseFormControllerProps = {
  initialValues?: FormControllerData;
};

const EMPTY_VALUES: FormControllerData = {};

export const useFormController = ({
  initialValues = EMPTY_VALUES,
}: UseFormControllerProps = {}): FormController => {
  const [data, setData] = useState<FormControllerData>(initialValues);

  const getValue = useCallback((name: string) => {
    return data[name] ?? '';
  }, [data]);

  const setValue = useCallback((name: string, value: string) => {
    setData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }, []);

  const setValues = useCallback((values: FormControllerData) => {
    setData(values);
  }, []);

  const reset = useCallback(() => {
    setData(initialValues);
  }, [initialValues]);

  return useMemo(() => ({
    data,
    getValue,
    setValue,
    setValues,
    reset,
  }), [
    data,
    getValue,
    setValue,
    setValues,
    reset,
  ]);
};
