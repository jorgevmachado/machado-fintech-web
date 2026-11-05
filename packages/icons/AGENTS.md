# Icons

## Identidade

Inventário centralizado de ícones React baseado em `react-icons`, usado por `packages/ui` e aplicações.

## Comandos

```bash
npm run build -- --filter=@fintech/icons
npm run lint --workspace=@fintech/icons
npm test --workspace=@fintech/icons -- --runInBand
```

## Padrões

- Grupos e mapeamentos ficam em `src/groups/`; veja `src/groups/fa/`, `src/groups/md/` e `src/groups/io/`.
- Mantenha nomes e tipos de ícones consistentes com `src/types.ts`, `src/options/` e `src/service/`.
- Exporte novos ícones pelo grupo e entrypoints públicos (`src/groups/index.ts` e `src/index.ts`).
- Consumidores devem importar o package centralizado em vez de adicionar imports diretos dispersos de `react-icons`.
- Preserve compatibilidade da API consumida por `Icon` em `packages/ui/src/primitives/icon/Icon.tsx`.
- Este package não deve depender de `packages/ui` nem conter componentes genéricos de UI.

## Busca e verificação

```bash
rg -n "export|IconType|react-icons" src
npm run lint --workspace=@fintech/icons && npm test --workspace=@fintech/icons -- --runInBand
```
