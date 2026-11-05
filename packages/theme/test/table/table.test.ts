import {
  OTableAlign ,
  TABLE_CONTENT_ALIGN_CLASS_MAP ,
  TABLE_TEXT_ALIGN_CLASS_MAP ,
  buildTableAppearanceTheme ,
  DEFAULT_TABLE_APPEARANCE_THEME,
  tableCellTheme,
  tableCellContentTheme,
  buildTableCellTheme,
  buildTableTheme,
  buildTableActionTheme
} from '../../src';

describe('Table Theme', () => {
    describe('Align', () => {
      it('should have a class mapping for every text align', () => {
        OTableAlign.forEach((align) => {
          expect(TABLE_TEXT_ALIGN_CLASS_MAP[align]).toEqual(`text-${align}`);
          expect(typeof TABLE_TEXT_ALIGN_CLASS_MAP[align]).toEqual('string');
        })
      });
      it('should have a class mapping for every content align', () => {
        expect(TABLE_CONTENT_ALIGN_CLASS_MAP['left']).toEqual('justify-start');
        expect(TABLE_CONTENT_ALIGN_CLASS_MAP['center']).toEqual('justify-center');
        expect(TABLE_CONTENT_ALIGN_CLASS_MAP['right']).toEqual('justify-end');
      });
      it('should length onTableAlign', () => {
        expect(OTableAlign.length).toEqual(3);
      });
    });

    describe('Appearance', () => {
      it('should return table appearance theme default', () => {
        const tableAppearance = buildTableAppearanceTheme();
        expect(tableAppearance).toEqual(DEFAULT_TABLE_APPEARANCE_THEME);
      });

      it('should return table appearance theme custom', () => {
        const customTableAppearance = {
          body: {
            background: 'bg-white' ,
            cell: 'text-slate-700' ,
            border: 'border-b border-slate-200' ,
          } ,
          border: 'border-slate-300' ,
          footer: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
          header: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
          background: 'bg-slate-100' ,
        }
        const tableAppearance = buildTableAppearanceTheme(customTableAppearance);
        expect(tableAppearance).toEqual(customTableAppearance);
      });
    });

    describe('Cell', () => {
      describe('tableCellTheme', () => {
        it('should build table cell theme with only required fields', () => {
          const expectedResult = 'px-4 py-3 text-xs text-left text-white';
          const result = tableCellTheme({ className: 'text-white'});
          expect(result).toEqual(expectedResult);
        });

        it('should build table cell theme with weight', () => {
          const expectedResult = 'px-4 py-3 text-xs text-left font-semibold text-white';
          const result = tableCellTheme({ weight: 'semibold', className: 'text-white'});
          expect(result).toEqual(expectedResult);
        });

        it('should build table cell theme with tracking', () => {
          const expectedResult = 'px-4 py-3 text-xs text-left font-semibold tracking-wide text-white';
          const result = tableCellTheme({ weight: 'semibold', tracking: 'wide', className: 'text-white'});
          expect(result).toEqual(expectedResult);
        });

        it('should build table cell theme with whitespace', () => {
          const expectedResult = 'px-4 py-3 text-xs text-left font-semibold tracking-wide whitespace-nowrap text-white';
          const result = tableCellTheme({ weight: 'semibold', tracking: 'wide', whitespace: 'nowrap', className: 'text-white'});
          expect(result).toEqual(expectedResult);
        });

        it('should build table cell theme with align', () => {
          const expectedResult = 'px-4 py-3 text-xs text-right font-semibold tracking-wide whitespace-nowrap text-white';
          const result = tableCellTheme({ align: 'right', weight: 'semibold', tracking: 'wide', whitespace: 'nowrap', className: 'text-white'});
          expect(result).toEqual(expectedResult);
        });
      });

      describe('tableCellContentTheme', () => {
        it('should build table cell content theme with default values', () => {
          const expectedResult = 'flex items-center gap-1 justify-start';
          const result = tableCellContentTheme();
          expect(result).toEqual(expectedResult);
        });
        it('should build table cell content theme with custom align', () => {
          const expectedResult = 'flex items-center gap-1 justify-center';
          const result = tableCellContentTheme('center');
          expect(result).toEqual(expectedResult);
        });
      });

      describe('buildTableCellTheme', () => {
        it('should build table cell theme header', () => {
          const cell = 'px-4 py-3 text-sm text-left font-semibold tracking-wide text-white';
          const cellContent = 'flex items-center gap-1 justify-start';
          const result = buildTableCellTheme('header', 'text-white');
          expect(result.cell).toEqual(cell);
          expect(result.content).toEqual(cellContent);
        });

        it('should build table cell theme footer', () => {
          const cell = 'px-4 py-3 text-sm text-right font-semibold tracking-wide text-white';
          const cellContent = 'flex items-center gap-1 justify-end';
          const result = buildTableCellTheme('footer', 'text-white', 'right');
          expect(result.cell).toEqual(cell);
          expect(result.content).toEqual(cellContent);
        });

        it('should build table cell theme body', () => {
          const cell = 'px-4 py-3 text-xs text-left whitespace-nowrap text-white';
          const result = buildTableCellTheme('body', 'text-white');
          expect(result.cell).toEqual(cell);
          expect(result.content).toEqual('');
        });
      });
    });

    describe('Table', () => {
      describe('buildTableTheme', () => {
        it('should build table theme without params', () => {
          const header = DEFAULT_TABLE_APPEARANCE_THEME.header;
          const body = {
            ...DEFAULT_TABLE_APPEARANCE_THEME.body,
            border: `${DEFAULT_TABLE_APPEARANCE_THEME.body.border} last:border-b-0`
          };
          const footer = DEFAULT_TABLE_APPEARANCE_THEME.footer;
          const table = `min-w-max overflow-hidden rounded-xl border shadow-sm ${DEFAULT_TABLE_APPEARANCE_THEME.border} ${DEFAULT_TABLE_APPEARANCE_THEME.background}`;
          const result = buildTableTheme();
          expect(result.header).toEqual(header);
          expect(result.body).toEqual(body);
          expect(result.footer).toEqual(footer);
          expect(result.table).toEqual(table);
          expect(result.content).toEqual('min-w-full');
        });
        it('should build table theme with custom appearance', () => {
          const customTableAppearance = {
            body: {
              background: 'bg-white' ,
              cell: 'text-slate-700' ,
              border: 'border-b border-slate-200' ,
            } ,
            border: 'border-slate-300' ,
            footer: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
            header: { background: 'bg-slate-700' ,cell: 'text-white'  } ,
            background: 'bg-slate-100' ,
          }
          const header = customTableAppearance.header;
          const body = {
            ...customTableAppearance.body,
            border: `${customTableAppearance.body.border} last:border-b-0`
          };
          const footer = customTableAppearance.footer;
          const table = `min-w-max overflow-hidden rounded-xl border shadow-sm ${customTableAppearance.border} ${customTableAppearance.background}`;
          const result = buildTableTheme(customTableAppearance);
          expect(result.header).toEqual(header);
          expect(result.body).toEqual(body);
          expect(result.footer).toEqual(footer);
          expect(result.table).toEqual(table);
          expect(result.content).toEqual('min-w-full');
        });
      });
    });

    describe('Action', () => {
      it('should return default table action theme', () => {
        const expectedResult = 'cursor-pointer transition-colors';
        expect(buildTableActionTheme()).toEqual(expectedResult);
      });

      it('should return table action default show theme', () => {
        const expectedResult = 'cursor-pointer transition-colors text-sky-700 hover:bg-sky-50';
        expect(buildTableActionTheme('show')).toEqual(expectedResult);
      });

      it('should return table action custom show theme', () => {
        const expectedResult = 'cursor-pointer transition-colors text-red-700 hover:bg-red-50';
        expect(buildTableActionTheme('show', 'text-red-700 hover:bg-red-50')).toEqual(expectedResult);
      });

      it('should return table action default show theme', () => {
        const expectedResult = 'cursor-pointer transition-colors text-amber-700 hover:bg-amber-50';
        expect(buildTableActionTheme('edit')).toEqual(expectedResult);
      });

      it('should return table action default delete theme', () => {
        const expectedResult = 'cursor-pointer transition-colors text-red-700 hover:bg-red-50';
        expect(buildTableActionTheme('delete')).toEqual(expectedResult);
      });
    });
});