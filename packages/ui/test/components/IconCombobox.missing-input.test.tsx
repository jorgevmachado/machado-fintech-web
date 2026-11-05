import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../src/components/input', () => ({
  __esModule: true,
  default: (props: { onClear?: (event: never) => void }) => {
    props.onClear?.({} as never);
    return null;
  },
}));

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolve: <T,>(value: T) => value,
    resolveChildren: (value: React.ReactNode) => value,
  }),
}));

import IconCombobox from '../../src/components/icon-combobox';

describe('<IconCombobox /> without a mounted input', () => {
  it('throws when selection is attempted before the input ref is available', () => {
    expect(() => render(<IconCombobox name="icon" />))
      .toThrow('IconCombobox input is not mounted');
  });
});
