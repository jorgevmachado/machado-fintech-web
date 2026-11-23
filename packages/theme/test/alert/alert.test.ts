import { OAlertVariant ,type TAlertVariant ,ALERT_VARIANT_CLASS_MAP, ALERT_VARIANT_ICON_MAP } from '../../src';

describe('Button Theme', () => {
  it('should map alert variant values to class names', () => {
    (Object.keys(ALERT_VARIANT_CLASS_MAP) as TAlertVariant[]).forEach((variant) => {
      if(variant === 'info') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-[color:var(--app-info,#0369a1)] bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] text-[color:var(--app-info-strong,#075985)]');
      } else if(variant === 'error') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-[color:var(--app-negative,#dc2626)] bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] text-[color:var(--app-negative-strong,#991b1b)]');
      } else if(variant === 'success') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-[color:var(--app-positive,#059669)] bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] text-[color:var(--app-positive-strong,#065f46)]');
      } else if(variant === 'warning') {
        expect(ALERT_VARIANT_CLASS_MAP[variant]).toBe('border-[color:var(--app-warning,#b45309)] bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] text-[color:var(--app-warning-strong,#92400e)]');
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