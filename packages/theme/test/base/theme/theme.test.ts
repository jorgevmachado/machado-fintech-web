import { OThemeVariant } from '../../../src';

describe('Theme', () => {
  it('should total theme variant values', () => {
    expect(OThemeVariant.length).toBe(2);
  });
});