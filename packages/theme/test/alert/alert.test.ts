import { OAlertVariant ,type TAlertVariant ,ALERT_VARIANT_CLASS_MAP, ALERT_VARIANT_ICON_MAP } from '../../src';

describe('Button Theme', () => {
  it('should map alert variant values to class names', () => {
    (Object.keys(ALERT_VARIANT_CLASS_MAP) as TAlertVariant[]).forEach((variant) => {
      if(variant === 'info') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-blue-500 bg-blue-50 text-blue-900');
      } else if(variant === 'error') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-red-500 bg-red-50 text-red-900');
      } else if(variant === 'success') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-green-500 bg-green-50 text-green-900');
      } else if(variant === 'warning') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-yellow-500 bg-yellow-50 text-yellow-900');
      }
    });
  });

  it('should map alert variant values to icon names', () => {
    (Object.keys(ALERT_VARIANT_ICON_MAP) as TAlertVariant[]).forEach((variant) => {
      if(variant === 'success') {
        expect(ALERT_VARIANT_ICON_MAP[variant]).toBe('check');
      } else {
        expect(ALERT_VARIANT_ICON_MAP[variant]).toBe(variant);
      }
    });
  });

  it('should total alert variant values', () => {
    expect(OAlertVariant.length).toBe(4);
  });
});