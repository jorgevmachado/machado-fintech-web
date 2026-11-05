import { type TTone ,TEXT_TONE_CLASS_MAP ,OTone, OThemeTone } from '../../../src';

describe('tone', () => {
  it('should map tone values to class names', () => {
    (Object.keys(TEXT_TONE_CLASS_MAP) as TTone[]).forEach((value) => {
      switch (value) {
        case 'info':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-sky-600');
          break;
        case 'muted':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-slate-600');
          break;
        case 'subtle':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-slate-500');
          break;
        case 'danger':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-red-600');
          break;
        case 'default':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-slate-900');
          break;
        case 'primary':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-blue-600');
          break;
        case 'success':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-emerald-600');
          break;
        case 'warning':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-amber-600');
          break;
        case 'neutral':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-slate-700');
          break;
        case 'secondary':
          expect(TEXT_TONE_CLASS_MAP[value]).toBe('text-violet-600');
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
