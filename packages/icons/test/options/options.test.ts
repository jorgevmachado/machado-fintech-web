import { OIconPosition, OIcon, OIconGroup } from '../../src';

describe('options', () => {
  it('should map icon positions', () => {
    const result = OIconPosition;
    expect(result).toBeTruthy();
    expect(result.length).toBe(2);
  });

  it('should map icon options', () => {
    const iconLength = OIcon.length;
    const result = OIcon;
    expect(result).toBeTruthy();
    expect(result.length).toBe(iconLength);
  });

  it('should map icon groups', () => {
    const groupLength = OIconGroup.length;
    const result = OIconGroup;
    expect(result).toBeTruthy();
    expect(result.length).toBe(groupLength);
  });
});