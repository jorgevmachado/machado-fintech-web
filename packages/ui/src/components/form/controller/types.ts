export type FormControllerData = Record<string, string>;

export type FormController = {
  data: FormControllerData;
  reset: () => void;
  getValue: (name: string) => string;
  setValue: (name: string, value: string) => void;
  setValues: (data: FormControllerData) => void;
};