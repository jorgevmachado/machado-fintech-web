import { type TTone ,TEXT_TONE_CLASS_MAP ,OTone, OThemeTone } from '../../../src';

describe('tone', () => {
  it('should map tone values to class names', () => {
    (Object.keys(TEXT_TONE_CLASS_MAP) as TTone[]).forEach((value) => {
      switch (value) {
        case 'info':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-info-strong,#075985)]');
          break;
        case 'muted':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-text-subtle,#475569)]');
          break;
        case 'subtle':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-text-muted,#64748b)]');
          break;
        case 'danger':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-negative-strong,#991b1b)]');
          break;
        case 'default':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-text-strong,#020617)]');
          break;
        case 'primary':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-accent,#1d4ed8)]');
          break;
        case 'success':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-positive-strong,#065f46)]');
          break;
        case 'warning':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-warning-strong,#92400e)]');
          break;
        case 'neutral':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-text,#0f172a)]');
          break;
        case 'secondary':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-[color:var(--app-text-subtle,#475569)]');
          break;
        default:
          expect(TEXT_TONE_CLASS_MAP[value]).toBe(`text-${value}`);
          break;
      }
    });
  });

  it('should total tone values', () => {
    expect(OTone.length).toBe(12);
  });

  it('should total theme tone values', () => {
    expect(OThemeTone.length).toBe(3);
  });
});
