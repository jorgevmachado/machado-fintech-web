# Shared

## Identidade

Package TypeScript principal para Value Objects, resultados, validação, HTTP e funções independentes de frameworks. Entry point: `src/index.ts`.

## Comandos

```bash
npm run build -- --filter=@fintech/shared
npm run lint --workspace=@fintech/shared
npm test --workspace=@fintech/shared -- --runInBand
```

## Padrões

- Mantenha o código independente de React, Next.js e APIs específicas do navegador.
- Organize por domínio/primitivo em `src/base/` e `src/value-object/`; siga `src/base/result/` para resultados e `src/value-object/money.vo.ts` para um Value Object concreto.
- Encapsule resultados de operações nos tipos `Result` existentes; use `src/base/http/` para comportamento de cliente HTTP reutilizável.
- Exporte APIs intencionais em `src/index.ts` e nos índices dos subdiretórios; não dependa de imports internos por consumidores.
- Preserve compatibilidade de tipos e comportamento porque `apps/finance` e packages reutilizáveis dependem deste pacote.
- Coloque testes Jest junto dos testes do package e adicione regressões para mudanças comportamentais.
- Novos utilitários genéricos pertencem aqui; evite aumentar `packages/utils` durante a migração.

## Localização e verificação

```bash
rg -n "class .* extends ValueObject|class .*Result|HttpClient" src
rg -n "export" src/index.ts src/**/index.ts
find . -path './node_modules' -prune -o -name '*.test.ts' -print
npm run lint --workspace=@fintech/shared && npm test --workspace=@fintech/shared -- --runInBand
```
