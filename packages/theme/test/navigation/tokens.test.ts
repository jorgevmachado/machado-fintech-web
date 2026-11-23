import { readFileSync } from 'fs';
import { join } from 'path';

import { NAVIGATION_SHELL_VARS_MAP } from '../../src';

/**
 * `src/tokens.css` é o que chega ao bundle: publica os tokens na raiz do
 * documento para que componentes em portal (Modal, Alert) e páginas fora do
 * shell também herdem o tema. A fonte de verdade continua sendo
 * `NAVIGATION_SHELL_VARS_MAP`; este teste falha se os dois divergirem, o que
 * deixaria o shell e o conteúdo em temas diferentes.
 */
const TOKENS_CSS_PATH = join(__dirname, '..', '..', 'src', 'tokens.css');

const readTokensCss = (): string => readFileSync(TOKENS_CSS_PATH, 'utf8');

/**
 * Extrai as declarações `--app-*: valor` do bloco cujo seletor casa com
 * `selector`. O seletor é ancorado no início da linha porque o comentário do
 * arquivo cita os dois seletores — um `indexOf` simples casaria dentro dele e
 * leria o bloco errado.
 */
const readBlock = (css: string, selector: string): Record<string, string> => {
  const selectorPattern = new RegExp(`^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'm');
  const selectorMatch = selectorPattern.exec(css);

  if (!selectorMatch) {
    throw new Error(`Selector "${selector}" not found in tokens.css`);
  }

  const selectorIndex = selectorMatch.index;

  const blockStart = css.indexOf('{', selectorIndex);
  const blockEnd = css.indexOf('}', blockStart);
  const block = css.slice(blockStart + 1, blockEnd);

  const declarations: Record<string, string> = {};

  for (const line of block.split('\n')) {
    const match = line.match(/(--app-[\w-]+)\s*:\s*([^;]+);/);

    if (match?.[1] && match[2]) {
      declarations[match[1]] = match[2].trim();
    }
  }

  return declarations;
};

describe('tokens.css', () => {
  it('should keep tokens.css in sync with NAVIGATION_SHELL_VARS_MAP', () => {
    const css = readTokensCss();

    const lightBlock = readBlock(css, ':root');
    const darkBlock = readBlock(css, "html[data-theme='dark']");

    expect(lightBlock).toEqual(NAVIGATION_SHELL_VARS_MAP.light);
    expect(darkBlock).toEqual(NAVIGATION_SHELL_VARS_MAP.dark);
  });

  it('should declare the same token keys for light and dark', () => {
    const css = readTokensCss();

    const lightKeys = Object.keys(readBlock(css, ':root')).sort();
    const darkKeys = Object.keys(readBlock(css, "html[data-theme='dark']")).sort();

    expect(darkKeys).toEqual(lightKeys);
    expect(lightKeys.length).toBeGreaterThan(0);
  });

  it('should set color-scheme per theme so native controls follow it', () => {
    const css = readTokensCss();

    expect(readBlock(css, ':root')).not.toHaveProperty('color-scheme');
    expect(css).toContain('color-scheme: light');
    expect(css).toContain('color-scheme: dark');
  });

  it('should scope the dark override to the html element for specificity', () => {
    // `:root` e `[data-theme='dark']` empatam em especificidade (0,1,0), então
    // quem venceria seria a ordem de escrita. `html[data-theme='dark']` é
    // (0,1,1) e torna o override determinístico.
    const css = readTokensCss();

    expect(css).toContain("html[data-theme='dark']");
  });
});