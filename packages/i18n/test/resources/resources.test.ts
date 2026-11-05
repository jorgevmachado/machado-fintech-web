import { initializeResources ,registerLocales , registerLocalesFiles, resources, mergeLocaleFiles } from '../../src';
import { i18n } from '../../src/instance';

describe('Resources', () => {
  it('returns resources', () => {
    expect(Object.keys(resources)).toEqual(['en-US', 'pt-BR', 'es-UE']);
  });

  describe('registerLocales', () => {
    it('should register a new namespace for a locale', () => {

      registerLocales(
        'pt-BR',
        'filters',
        {
          clear: 'Limpar',
          apply: 'Aplicar',
        },
      );


      expect(
        resources['pt-BR'],
      ).toHaveProperty(
        'filters',
        {
          clear: 'Limpar',
          apply: 'Aplicar',
        }
      );

    });


    it('should not affect other locales', () => {

      registerLocales(
        'pt-BR',
        'filters',
        {
          clear: 'Limpar',
        },
      );


      expect(
        resources['en-US'].filters,
      ).toBeUndefined();


      expect(
        resources['es-UE'].filters,
      ).toBeUndefined();

    });


    it('should allow multiple namespaces', () => {

      registerLocales(
        'pt-BR',
        'filters',
        {
          clear: 'Limpar',
        },
      );


      registerLocales(
        'pt-BR',
        'modal',
        {
          close: 'Fechar',
        },
      );


      expect(
        resources['pt-BR'],
      ).toMatchObject({
        filters: {
          clear: 'Limpar',
        },

        modal: {
          close: 'Fechar',
        },
      });

    });
  });

  describe('initializeResources', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });


    it('should register all default locale resources', () => {

      const addResourceBundleSpy =
        jest.spyOn(
          i18n,
          'addResourceBundle',
        );


      initializeResources();


      expect(
        addResourceBundleSpy,
      ).toHaveBeenCalledWith(
        'en-US',
        'translation',
        resources['en-US'],
        true,
        true,
      );


      expect(
        addResourceBundleSpy,
      ).toHaveBeenCalledWith(
        'pt-BR',
        'translation',
        resources['pt-BR'],
        true,
        true,
      );


      expect(
        addResourceBundleSpy,
      ).toHaveBeenCalledWith(
        'es-UE',
        'translation',
        resources['es-UE'],
        true,
        true,
      );

    });


    it('should register dynamic namespaces', () => {

      resources['pt-BR'].filters = {
        clear: 'Limpar',
        apply: 'Aplicar',
      };


      const addResourceBundleSpy =
        jest.spyOn(
          i18n,
          'addResourceBundle',
        );


      initializeResources();


      expect(
        addResourceBundleSpy,
      ).toHaveBeenCalledWith(
        'pt-BR',
        'translation',
        expect.objectContaining({
          filters: {
            clear: 'Limpar',
            apply: 'Aplicar',
          },
        }),
        true,
        true,
      );

    });

  });

  describe('registerLocalesFiles', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should register all locales and namespaces', () => {

      registerLocalesFiles({
        'pt-BR': {
          navigation: {
            home: 'Home',
          },
          filters: {
            apply: 'Aplicar',
            clear: 'Limpar',
          },
        },
        'en-US': {
          navigation: {
            home: 'Home',
          },
        },
      });

      expect(resources['pt-BR']).toHaveProperty(
        'navigation',
        { home: 'Home' }
      );

    });
  });

  describe('mergeLocaleFiles', () => {
    it('should merge different namespaces of the same locale', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              apply: 'Aplicar',
            },
          },
        },
        {
          'pt-BR': {
            user: {
              name: 'Nome',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            apply: 'Aplicar',
          },
          user: {
            name: 'Nome',
          },
        },
      });
    });

    it('should merge messages from the same namespace', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              apply: 'Aplicar',
            },
          },
        },
        {
          'pt-BR': {
            filter: {
              clear: 'Limpar',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            apply: 'Aplicar',
            clear: 'Limpar',
          },
        },
      });
    });

    it('should deep merge nested objects', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              buttons: {
                apply: 'Aplicar',
              },
            },
          },
        },
        {
          'pt-BR': {
            filter: {
              buttons: {
                clear: 'Limpar',
              },
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            buttons: {
              apply: 'Aplicar',
              clear: 'Limpar',
            },
          },
        },
      });
    });

    it('should overwrite existing values', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              apply: 'Aplicar',
            },
          },
        },
        {
          'pt-BR': {
            filter: {
              apply: 'Salvar',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            apply: 'Salvar',
          },
        },
      });
    });

    it('should merge multiple locales independently', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              apply: 'Aplicar',
            },
          },
        },
        {
          'en-US': {
            filter: {
              apply: 'Apply',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            apply: 'Aplicar',
          },
        },
        'en-US': {
          filter: {
            apply: 'Apply',
          },
        },
      });
    });

    it('should replace arrays instead of merging them', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              values: ['A', 'B'],
            },
          },
        },
        {
          'pt-BR': {
            filter: {
              values: ['C'],
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            values: ['C'],
          },
        },
      });
    });

    it('should return an empty object when locale list is empty', () => {
      expect(mergeLocaleFiles([])).toEqual({});
    });

    it('should merge more than two locale files', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': {
            filter: {
              apply: 'Aplicar',
            },
          },
        },
        {
          'pt-BR': {
            filter: {
              clear: 'Limpar',
            },
          },
        },
        {
          'pt-BR': {
            user: {
              name: 'Nome',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'pt-BR': {
          filter: {
            apply: 'Aplicar',
            clear: 'Limpar',
          },
          user: {
            name: 'Nome',
          },
        },
      });
    });

    it('should ignore locale without namespaces', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': undefined,
        } as TLocalesFiles,
      ]);

      expect(result).toEqual({});
    });

    it('should skip undefined namespaces and keep valid locales', () => {
      const result = mergeLocaleFiles([
        {
          'pt-BR': undefined,
        } as TLocalesFiles,
        {
          'en-US': {
            filter: {
              apply: 'Apply',
            },
          },
        },
      ]);

      expect(result).toEqual({
        'en-US': {
          filter: {
            apply: 'Apply',
          },
        },
      });
    });
  });
});