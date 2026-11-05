# Finance

## Identidade

Aplicação principal Next.js 16 / React 19. Contém páginas, fluxos financeiros, autenticação, rotas BFF e integração server-side com a API externa. Mantenha regras específicas da aplicação aqui; componentes reutilizáveis pertencem a `packages/ui`.

## Regra obrigatória para Next.js

> [!IMPORTANT]
> Esta versão do Next.js pode ter APIs e convenções diferentes das versões anteriores. Antes de escrever ou alterar código Next.js, leia os guias relevantes em `node_modules/next/dist/docs/` e respeite avisos de depreciação.

## Comandos

Execute da raiz:

```bash
npm run dev --workspace=finance
npm run build -- --filter=finance...
npm run lint --workspace=finance
npm run test:coverage --workspace=finance -- --runInBand
```

Configure `API_BASE_URL` em `apps/finance/.env.local` usando `.env.example` como referência. É obrigatória em produção; resolução e validação ficam em `src/server/integrations/finance-api/config-utils.ts`.

## Organização e padrões

- Rotas e layouts do App Router ficam em `app/`; rotas do BFF ficam em `app/api/**/route.ts`.
- Features ficam em `src/features/<feature>/`, com `domain`, `services`, `mappers`, `hooks`, `components`, `pages` e `test` conforme necessário. Use `receipt` ou `payment` como exemplos reais.
- Mantenha autenticação e acesso a cookies no servidor (`src/server/auth/`). Confira `src/server/auth/session.ts` antes de alterar sessão ou cookie.
- A integração externa é server-only em `src/server/integrations/finance-api/`; use os serviços existentes, como `receipt.service.ts`, em vez de chamar o backend externo de componentes cliente.
- Rotas BFF verificam a sessão e traduzem resultados/erros; use `app/api/receipt/batch/route.ts` como referência.
- Clientes das features chamam rotas locais `/api` pelos serviços do domínio, como `src/features/receipt/services/service.ts`; hooks de UI orquestram estado/alertas, como `useReceipts.ts`.
- Use aliases `@/` para imports da aplicação e importe packages por suas APIs públicas.
- Testes Jest ficam próximos da feature em `test/`; há testes de rotas e auth em `src/server/**/test/`.
- Atualize `.env.example` para novas configurações, nunca adicione credenciais.

## Arquivos-chave e busca

- Layout e providers: `app/layout.tsx`, `app/(protected)/layout.tsx`
- Sessão: `src/server/auth/session.ts`
- Cliente/backend Finance: `src/server/integrations/finance-api/`
- Exemplos de feature: `src/features/receipt/`, `src/features/payment/`

```bash
rg -n "export async function (GET|POST|PUT|DELETE)" app/api
rg -n "HttpClient\\.(get|post|put|patch)|baseUrl: '/api'" src/features
find src app -type f \( -name '*.test.ts' -o -name '*.test.tsx' \)
```

## Verificação

```bash
npm run lint --workspace=finance && npm run test:coverage --workspace=finance -- --runInBand
```

Para alterações de rotas, autenticação ou integração, execute também o build `npm run build -- --filter=finance...`.
