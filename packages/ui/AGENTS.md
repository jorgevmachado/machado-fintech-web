# UI

## Identidade

Biblioteca reutilizável React 19 / TypeScript para componentes, hooks, providers e estilos. Entrypoint público em `src/index.ts`; package consumido por `apps/finance`.

## Comandos

Execute da raiz:

```bash
npm run build -- --filter=@fintech/ui
npm run lint --workspace=@fintech/ui
npm test --workspace=@fintech/ui -- --runInBand
```

`build` compila componentes e CSS; `build:components` usa `tsc -b`, `build:styles` executa Tailwind.

## Padrões

- Componentes ficam em `src/components/<nome>/`, primitivos em `src/primitives/`, hooks junto do componente/feature e providers em `src/providers/`.
- Use APIs públicas tipadas e props extensíveis a partir dos tipos React quando fizer sentido. `src/components/input/types.ts` e `Input.tsx` são referências para tipagem e comportamento de input.
- Componentes que suportam controle externo devem respeitar `value`/callbacks; não duplique estado derivável.
- Mantenha acessibilidade, estados disabled/loading/error e comportamento de teclado no componente; prefira os primitives existentes, como `src/primitives/icon/Icon.tsx`.
- Use `@fintech/theme` para variantes/tokens, `@fintech/icons` para ícones, e `@fintech/i18n` para strings de usuário traduzíveis.
- Mantenha regras de negócio de Finance em `apps/finance`; evite dependências de `next/*` neste package.
- Exporte novos componentes/hooks pelos índices apropriados até `src/index.ts`.
- Testes estão em `test/` no package, por exemplo `src/components/...` e `test/`; atualize testes junto com mudanças comportamentais.
- Não adicione stories: este checkout não contém `apps/docs` nem configuração Storybook; confirme a infraestrutura antes de documentar visualmente um componente.

## Navegação

```bash
rg -n "export.*(function|const)|forwardRef" src/components src/primitives
rg -n "useState|useCallback|useMemo" src/components src/providers
find test src -type f \( -name '*.test.ts' -o -name '*.test.tsx' \)
```

## Verificação

```bash
npm run lint --workspace=@fintech/ui && npm test --workspace=@fintech/ui -- --runInBand
```
