# I18n

## Identidade

Infraestrutura compartilhada de tradução usando i18next/react-i18next. É consumida principalmente por `packages/ui`; não acople o package ao Next.js.

## Comandos

```bash
pnpm run build -- --filter=@fintech/i18n
pnpm run lint --workspace=@fintech/i18n
pnpm test --workspace=@fintech/i18n -- --runInBand
```

## Padrões

- Configuração e locales suportados: `src/config/config.ts`; recursos de idioma em `src/locales/{en-US,pt-BR,es-UE}.json`.
- Instância, hooks, provider e registro de recursos ficam em `src/instance.ts`, `src/useAppTranslation.ts`, `src/provider/` e `src/resources/`.
- Ao adicionar ou alterar texto de usuário, mantenha as chaves correspondentes consistentes nos três locales e preserve a estrutura de namespaces.
- Use `registerLocales`/`registerLocalesFiles` existentes para registrar recursos; não crie uma segunda infraestrutura de tradução.
- Exporte a API por `src/index.ts`; alterações devem preservar os consumidores públicos em UI e Finance.
- Adicione testes para normalização, resolução e registro de recursos conforme o comportamento alterado.

## Busca e verificação

```bash
rg -n "SUPPORTED_LOCALES|registerLocales|useAppTranslation" src
rg -n '"keyName"|keyName:' src/locales src
pnpm run lint --workspace=@fintech/i18n && pnpm test --workspace=@fintech/i18n -- --runInBand
```
