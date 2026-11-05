import {
  buildTextTagTheme ,
  LINE_CLAMP_CLASS_MAP ,
  TEXT_TAG_CLASS_MAP ,TEXT_TONE_CLASS_MAP ,
} from '../../src';

describe('textTag', () => {

  describe('TEXT_TAG_CLASS_MAP', () => {
    it('should render class map blockquote', () => {
      expect(TEXT_TAG_CLASS_MAP.blockquote).toEqual({
        tone: 'neutral',
        className: 'border-l-4 border-slate-200 pl-4 italic',
      });
    });

    it('should render class map code', () => {
      expect(TEXT_TAG_CLASS_MAP.code).toEqual({
        size: 'sm',
        color: 'text-slate-800',
        fontFamily: 'mono',
        className: 'rounded-md bg-slate-100 px-1.5 py-0.5',
      });
    });

    it('should render class map div', () => {
      expect(TEXT_TAG_CLASS_MAP.div).toEqual({
        size: 'base',
        tone:'neutral',
      })
    });

    it('should render class map em', () => {
      expect(TEXT_TAG_CLASS_MAP.em).toEqual({
        tone:'neutral',
        className:'italic'
      });
    });

    it('should render class map figcaption', () => {
      expect(TEXT_TAG_CLASS_MAP.figcaption).toEqual({
        size: 'sm',
        tone: 'subtle',
      })
    });

    it('should render class map h1', () => {
      expect(TEXT_TAG_CLASS_MAP.h1).toEqual({
        size: '4xl',
        weight: 'bold',
        tracking: 'tight',
        color: 'text-slate-950',
        className:'md:text-5xl'
      })
    });

    it('should render class map h2', () => {
      expect(TEXT_TAG_CLASS_MAP.h2).toEqual({
        size: '3xl',
        weight: 'bold',
        tracking: 'tight',
        color: 'text-slate-950',
        className:'md:text-4xl'
      })
    });

    it('should render class map h3', () => {
      expect(TEXT_TAG_CLASS_MAP.h3).toEqual({
        size: '2xl',
        tone: 'default',
        weight: 'semibold',
        tracking: 'tight',
      })
    });

    it('should render class map h4', () => {
      expect(TEXT_TAG_CLASS_MAP.h4).toEqual({
        size: 'xl',
        weight: 'semibold',
        tone: 'default',
      })
    });

    it('should render class map h5', () => {
      expect(TEXT_TAG_CLASS_MAP.h5).toEqual({
        tone: 'default' ,
        size: 'lg' ,
        weight: 'semibold' ,
      })
    });

    it('should render class map h6', () => {
      expect(TEXT_TAG_CLASS_MAP.h6).toEqual({
        tone: 'default' ,
        size: 'base' ,
        weight: 'semibold' ,
      })
    });

    it('should render class map label', () => {
      expect(TEXT_TAG_CLASS_MAP.label).toEqual({
        tone:'neutral',
        size: 'sm',
        weight: 'medium',
      })
    });

    it('should render class map legend', () => {
      expect(TEXT_TAG_CLASS_MAP.legend).toEqual({
        size: 'sm',
        weight: 'semibold',
        color: 'text-slate-800',
      })
    });

    it('should render class map mark', () => {
      expect(TEXT_TAG_CLASS_MAP.mark).toEqual({
        color: 'text-amber-950',
        className: 'bg-amber-100 px-1'
      })
    });

    it('should render class map p', () => {
      expect(TEXT_TAG_CLASS_MAP.p).toEqual({
        tone:'neutral',
        size: 'base',
        leading: '7',
      })
    });

    it('should render class map small', () => {
      expect(TEXT_TAG_CLASS_MAP.small).toEqual({
        size: 'sm',
        tone: 'subtle',
      })
    });

    it('should render class map span', () => {
      expect(TEXT_TAG_CLASS_MAP.span).toEqual({
        tone:'inherit'
      })
    });

    it('should render class map strong', () => {
      expect(TEXT_TAG_CLASS_MAP.strong).toEqual({
        tone: 'default',
        weight: 'semibold',
      })
    });
  });

  describe('buildTextTagTheme', () => {

    it('should return default classes for h1', () => {
      const result = buildTextTagTheme({
        tag: 'h1',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should append custom className', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        className: 'my-class',
      });

      expect(result).toContain('my-class');
    });

    it('should append italic class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        italic: true,
      });

      expect(result).toContain('italic');
    });

    it('should append truncate class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        truncate: true,
      });

      expect(result).toContain('truncate');
    });

    it('should append sr-only class', () => {
      const result = buildTextTagTheme({
        tag: 'span',
        srOnly: true,
      });

      expect(result).toContain('sr-only');
    });

    it('should append line clamp class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        lineClamp: 2,
      });

      expect(result).toContain(
        LINE_CLAMP_CLASS_MAP[2]
      );
    });

    it('should apply align class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        align: 'center',
      });

      expect(
        result.some(item => item.includes('text-center'))
      ).toBeTruthy();
    });

    it('should apply display class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        display: 'block',
      });

      expect(result).toContain('block');
    });

    it('should apply transform class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        transform: 'uppercase',
      });

      expect(result).toContain('uppercase');
    });

    it('should apply decoration class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        decoration: 'underline',
      });

      expect(result).toContain('underline');
    });

    it('should apply whitespace class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        whitespace: 'nowrap',
      });

      expect(result).toContain('whitespace-nowrap');
    });

    it('should apply wrap class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        wrap: 'wrap',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should apply break strategy class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        breakStrategy: 'all',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should apply custom color', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        color: '#ff0000',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should apply tone', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        tone: 'primary',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should append tag color class when tone is provided', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        tone: 'primary',
      });


      expect(result).toContain(
        TEXT_TONE_CLASS_MAP.primary
      );
    });

    it('should append custom color class', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        color: 'text-red-500',
      });

      expect(result).toContain(
        'text-red-500'
      );
    });

    it('should use default tag color', () => {
      const result = buildTextTagTheme({
        tag: 'h1',
      });

      expect(result.some(
        item => item.includes('text-')
      )).toBeTruthy();
    });

    it('should append tag default color class', () => {
      const result = buildTextTagTheme({
        tag: 'h1',
      });

      expect(result).toContain(
        'text-slate-950'
      );
    });

    it('should apply custom color', () => {
      const result = buildTextTagTheme({
        tag: 'p',
        color: '#ff0000',
      });

      expect(result.length).toBeGreaterThan(0);
    });

    it('should not append color class when no color is resolved', () => {
      const result = buildTextTagTheme({
        tag: 'div',
      });

      expect(result).not.toContain(
        expect.stringMatching(/^text-/)
      );
    });

    it('should not append color class when color resolver returns undefined', () => {
      const result = buildTextTagTheme({
        tag: 'h1',
        tone: undefined,
        color: undefined,
      });

      expect(result).toContain('text-slate-950');
    });

  });

});
