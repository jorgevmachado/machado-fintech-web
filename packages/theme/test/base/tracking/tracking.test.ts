import { type TTracking , TRACKING_CLASS_MAP ,OTracking } from '../../../src';

describe('tracking', () => {
  it('should map tracking values to class names', () => {
    (Object.keys(TRACKING_CLASS_MAP) as TTracking[]).forEach((value) => {
      expect(TRACKING_CLASS_MAP[value]).toBe(`tracking-${value}`);
    });
  });

  it('should total tracking values', () => {
    expect(OTracking.length).toBe(6);
  });
});
