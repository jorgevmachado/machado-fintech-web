# Theme

## Identidade

Package de configurações visuais e variantes consumido pela biblioteca `packages/ui`. Não contém componentes React completos.

## Comandos

```bash
pnpm run build -- --filter=@fintech/theme
pnpm run lint --workspace=@fintech/theme
pnpm test --workspace=@fintech/theme -- --runInBand
```

## Padrões

- Tokens e funções de tema ficam organizados por componente ou categoria em `src/`; veja `src/button/`, `src/input/` e `src/base/`.
- Use nomes semânticos e as convenções existentes de composição/variantes em vez de duplicar classes e valores dentro dos componentes UI.
- Mantenha o package sem dependência de `packages/ui` e sem regras específicas do Finance.
- Exporte definições públicas em `src/index.ts` e índices relacionados; confira consumidores antes de renomear/remover.
- Cubra alterações de mapeamento de tema com testes do package e confira os consumidores UI.

## Busca e verificação

```bash
rg -n "export|build.*Theme|Variant|Tone" src
pnpm run lint --workspace=@fintech/theme && pnpm test --workspace=@fintech/theme -- --runInBand
```
