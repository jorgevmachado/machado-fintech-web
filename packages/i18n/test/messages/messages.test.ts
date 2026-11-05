import { createI18nMessage, translateI18nMessage, parseTranslationMessage, isTranslationValue, isTranslationWithUnquotedParams } from '../../src';

describe('i18n message', () => {
  describe('createI18nMessage' ,() => {
    it('creates i18n-prefixed message' ,() => {
      expect(createI18nMessage('filters.name')).toBe('i18n:filters.name');
    });
  });

  describe('translateI18nMessage' ,() => {
    it('returns the original value when the message is empty or not prefixed' ,
      () => {
        const t = jest.fn((value: string) => value);


        expect(translateI18nMessage(t ,undefined)).toBeUndefined();
        expect(translateI18nMessage(t ,'')).toBe('');
        expect(translateI18nMessage(t ,'plain message')).toBe('plain message');
        expect(t).not.toHaveBeenCalled();
      });

    it('translates prefixed message' ,() => {
      const t = jest.fn((value: string) => `translated:${ value }`);
      expect(translateI18nMessage(t ,'i18n:pokemon.type.list.title')).
      toBe('translated:pokemon.type.list.title');
      expect(t).toHaveBeenCalledWith('pokemon.type.list.title');
    });
  });

  describe('parseTranslationMessage' ,() => {
    describe('when the value contains only a translation key' ,() => {
      it('should parse a translation key with single quotes' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid'" ,
          ) ,
        ).toEqual({
          key: 'form.validation.name.invalid' ,
        });
      });

      it('should parse a translation key with double quotes' ,() => {
        expect(
          parseTranslationMessage(
            '"form.validation.name.invalid"' ,
          ) ,
        ).toEqual({
          key: 'form.validation.name.invalid' ,
        });
      });
    });

    describe('when the value contains translation parameters' ,() => {
      it('should parse a translation key with one parameter' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid.min_length', { min: 2 }" ,
          ) ,
        ).toEqual({
          key: 'form.validation.name.invalid.min_length' ,
          params: {
            min: 2 ,
          } ,
        });
      });

      it('should parse a translation key with multiple parameters' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid.length', { min: 2, max: 10 }" ,
          ) ,
        ).toEqual({
          key: 'form.validation.name.invalid.length' ,
          params: {
            min: 2 ,
            max: 10 ,
          } ,
        });
      });

      it('should parse parameters with string values' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid'" ,
          ) ,
        ).toEqual({
          key: 'form.validation.name.invalid' ,
        });
      });

      it('should parse a translation key using double quotes with parameters' ,
        () => {
          expect(
            parseTranslationMessage(
              '"form.validation.name.invalid.min_length", { min: 2 }' ,
            ) ,
          ).toEqual({
            key: 'form.validation.name.invalid.min_length' ,
            params: {
              min: 2 ,
            } ,
          });
        });
    });

    describe('when the value is invalid' ,() => {
      it('should return null when the value is empty' ,() => {
        expect(parseTranslationMessage('')).toBeNull();
      });

      it('should return null when the value is not a translation message' ,
        () => {
          expect(
            parseTranslationMessage('Invalid translation message') ,
          ).toBeNull();
        });

      it('should return null when the translation key is missing' ,() => {
        expect(
          parseTranslationMessage(', { min: 2 }') ,
        ).toBeNull();
      });

      it('should return null when the parameters are invalid JSON' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid.min_length', { min: }" ,
          ) ,
        ).toBeNull();
      });

      it('should return null when the parameters are malformed' ,() => {
        expect(
          parseTranslationMessage(
            "'form.validation.name.invalid.min_length', { min: 2" ,
          ) ,
        ).toBeNull();
      });
    });

    describe('when the value contains whitespace' ,() => {
      it('should parse parameters with whitespace between key and parameters' ,
        () => {
          expect(
            parseTranslationMessage(
              "'form.validation.name.invalid.min_length'   ,   { min: 2 }" ,
            ) ,
          ).toEqual({
            key: 'form.validation.name.invalid.min_length' ,
            params: {
              min: 2 ,
            } ,
          });
        });
    });

    it('should return null when the parsed key is empty' ,() => {
      const matchSpy = jest.spyOn(String.prototype ,'match').
      mockImplementation(() => [
        '' ,
        '' ,
        undefined ,
      ] as unknown as RegExpMatchArray);

      expect(
        parseTranslationMessage("'form.validation.name.invalid'") ,
      ).toBeNull();

      matchSpy.mockRestore();
    });
  });

  describe('isTranslationValue' ,() => {
    it('should return true for valid translation values' ,() => {
      expect(isTranslationValue('form.validation.name.invalid')).toBe(true);
      expect(isTranslationValue(
        "'form.validation.name.invalid.min_length', { min: 2 }")).toBe(true);
      expect(isTranslationValue(
        '"form.validation.name.invalid.min_length", { min: 2 }')).toBe(true);
    });

    it('should return false for invalid translation values' ,() => {
      expect(isTranslationValue('')).toBe(false);
      expect(isTranslationValue('Invalid translation message')).toBe(false);
      expect(isTranslationValue(', { min: 2 }')).toBe(false);
    });

    it('should return false for non-string values' ,() => {
      expect(isTranslationValue(123)).toBe(false);
      expect(isTranslationValue(true)).toBe(false);
      expect(isTranslationValue(null)).toBe(false);
      expect(isTranslationValue(undefined)).toBe(false);
      expect(isTranslationValue({})).toBe(false);
      expect(isTranslationValue([])).toBe(false);
    });
  });

  describe('isTranslationWithUnquotedParams', () => {
    it('should return true for valid translation values with unquoted params', () => {
      expect(isTranslationWithUnquotedParams('form.validation.name.invalid.min_length, { min: 2 }')).toBe(true);
    });

    it('should return false for invalid translation values with unquoted params', () => {
      expect(isTranslationWithUnquotedParams('')).toBe(false);
      expect(isTranslationWithUnquotedParams('Invalid translation message')).toBe(false);
      expect(isTranslationWithUnquotedParams(', { min: 2 }')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isTranslationWithUnquotedParams(123)).toBe(false);
      expect(isTranslationWithUnquotedParams(true)).toBe(false);
      expect(isTranslationWithUnquotedParams(null)).toBe(false);
      expect(isTranslationWithUnquotedParams(undefined)).toBe(false);
      expect(isTranslationWithUnquotedParams({})).toBe(false);
      expect(isTranslationWithUnquotedParams([])).toBe(false);
    });
  });
});
