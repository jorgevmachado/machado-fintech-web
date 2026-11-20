---
name: create-feature
description: Cria uma feature completa (CRUD) no app Finance seguindo o padrão real de apps/web/src/features + apps/web/src/server + apps/web/app/api. Use quando pedirem para criar, adicionar ou implementar uma feature/recurso/CRUD novo (ex. "cria a feature de fornecedor", "adiciona CRUD de receita", "implementa cartão de crédito"), sempre traduzindo o nome da feature para o inglês, ou para auditar se uma feature existente segue o padrão (domain, types, enum, mapper, service, hook, form, list, page, rota BFF, validação, i18n, testes). Inclui o driver headless que valida a feature na UI real.
---

# create-feature

Gera uma feature vertical completa no app `apps/web`, do domínio até a tela, replicando o
padrão dos CRUDs existentes (`institution`, `payer`, `beneficiary`, `category`, `account`,
`credit-card`).

Caminhos neste documento são relativos a `apps/web/` (a unidade). **Antes de qualquer coisa,
leia a §0: todo nome de feature vai em inglês**, mesmo que o pedido venha em português.

O padrão tem **três camadas** que sempre andam juntas:

```
src/features/<kebab>/                   ← cliente: domínio, mapper, service (/api), hook, UI
app/api/<recurso>/route.ts              ← BFF: rota Next que injeta token e traduz Result→HTTP
src/server/integrations/api/<kebab>/    ← servidor: service do backend real + validação do body
app/(protected)/<recurso>/page.tsx      ← rota de página (1 linha)
```

A ordem de dependência é `cliente → BFF → servidor`. Sem a rota BFF o service do cliente
recebe 404; sem a validação a rota não compila; sem o service server-only a rota não tem
para onde chamar. Sempre entregue as três camadas — e valide cada uma (§4 e §5).

---

## 0. REGRA DE NOMENCLATURA: tudo em inglês

**Todos os nomes de feature, pasta, arquivo, tipo, campo de domínio e chave de rota são em
inglês.** Se o pedido vier em português, traduza antes de criar qualquer coisa:

| Pedido (pt-BR) | Feature (inglês) | Pasta / rota |
|---|---|---|
| cartão de crédito | credit card | `credit-card` / `/credit-cards` |
| fornecedor | supplier | `supplier` / `/suppliers` |
| receita | revenue | `revenue` / `/revenues` |
| despesa | expense | `expense` / `/expenses` |
| conta bancária | bank account | `bank-account` / `/bank-accounts` |
| pagamento | payment | `payment` / `/payments` |
| categoria | category | `category` / `/categories` |
| instituição | institution | `institution` / `/institutions` |
| beneficiário | beneficiary | `beneficiary` / `/beneficiaries` |
| agendamento | scheduling | `scheduling` / `/schedulings` |
| meta financeira | financial goal | `financial-goal` / `/financial-goals` |

Isso vale para **identificadores**: `TSupplier`, `useSuppliers`, `supplierService`,
`parseSupplierPersistBody`, `supplier.name.label`. O **conteúdo traduzível** (valores de
`src/locales/*.json`, rótulos visíveis) continua no idioma de cada locale — em pt-BR a tela
mostra "Fornecedor", mas o código e as chaves são `supplier.*`.

Se o recurso já existir no backend com nome em português, **não traduza o endpoint**: use o
`path` real do backend e nomeie apenas a feature em inglês, documentando o mapeamento.

---

## 1. Antes de escrever: colete o contrato

1. Leia o recurso no backend real (OpenAPI do Finance API):

```bash
curl -s http://127.0.0.1:8000/openapi.json \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);console.log(Object.keys(j.paths).join("\n"))})'
```

2. Inspecione o schema do recurso alvo (campos, obrigatórios, tipos). Troque o caminho pelo
   recurso desejado — se ele não existir, o script avisa em vez de quebrar:

```bash
PATH_ALVO=/institutions
curl -s http://127.0.0.1:8000/openapi.json \
  | PATH_ALVO="$PATH_ALVO" node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const p=process.env.PATH_ALVO,j=JSON.parse(d);if(!j.paths[p]){console.error("endpoint inexistente: "+p);process.exit(1)}console.log(JSON.stringify(j.paths[p],null,1).slice(0,1500))})'
```

3. Confirme o padrão local copiando de um CRUD irmão já pronto:

```bash
find src/features/institution src/server/integrations/api/institution -type f | sort
```

> Se o recurso não existir no backend, pare e pergunte. Não invente endpoint.

---

## 2. Árvore exata de arquivos

`<n>` = nome do recurso em **kebab-case** (`credit-card`), `<N>` = **PascalCase** (`CreditCard`),
`<R>` = **plural kebab** usado na URL (`credit-cards`).

```
src/features/<n>/
  index.ts                          barrel público
  domain/index.ts                   export * dos dois abaixo
  domain/types.ts                   T<N>, T<N>Filter, T<N>ApiData, T<N>Persist
  domain/enum.ts                    (só se houver campo enumerado) XMap + XEnum
  domain/<n>.domain.ts              classe <N> readonly + static create() validando datas
  mappers/<n>.mapper.ts             ApiData↔Domain + map< N >JsonResult/ListResult
  services/index.ts                 export { <N>Service, <n>Service }
  services/<n>.service.ts           HttpClient com baseUrl '/api'
  hooks/index.ts                    export { default as use<N>s }
  hooks/use-<n>s.ts                 'use client' — lista, paginação, alertas, persist/remove
  components/index.ts               export { default as <N>Form/<N>List }
  components/form/index.ts          export { default } from './<N>Form'
  components/form/<N>Form.tsx       'use client' — Form do @fintech/ui
  components/list/index.ts          export { default } from './<N>List'
  components/list/<N>List.tsx       lista + ícones edit/trash + Lang empty
  pages/<n>.page.tsx                'use client' — modal create/edit/delete + paginação
  test/                             testes (ver §6)

src/server/integrations/api/<n>/
  <n>.service.ts                    'server-only' — HttpClient no FINANCE_API_BASE_URL
  validation.ts                     parse<N>PersistBody com helpers de request-validation

app/api/<R>/route.ts                GET (lista) + POST (cria)
app/api/<R>/[identifier]/route.ts   PUT + DELETE
app/(protected)/<R>/page.tsx        importa <N>Page da feature
```

Regras de nomenclatura observadas no repo:

| Item | Regra | Exemplo |
|---|---|---|
| pasta feature | kebab-case | `credit-card` |
| pasta BFF | plural kebab = URL do backend | `credit-cards` |
| arquivo de domínio | `<n>.domain.ts` | `credit-card.domain.ts` |
| arquivo de mapper | `<n>.mapper.ts` | `credit-card.mapper.ts` |
| arquivo de service | `<n>.service.ts` (igual nos dois lados) | `credit-card.service.ts` |
| hook | `use-<n>s.ts` (plural) | `use-credit-cards.ts` |
| tipos | prefixo `T` | `TCreditCardPersist` |
| campos do domínio | snake_case igual ao backend | `due_day`, `is_active` |

---

## 3. Contrato de cada camada (assinaturas que o resto do app espera)

Detalhamento completo com código canônico em:

- [`references/feature-anatomy.md`](references/feature-anatomy.md) — cliente (domain, mapper, service, hook, UI)
- [`references/bff-routes-anatomy.md`](references/bff-routes-anatomy.md) — **`app/api/**/route.ts`** (a ponte front↔back: sessão, validação, tradução de erro, contrato que o cliente consome)
- [`references/server-anatomy.md`](references/server-anatomy.md) — service server-only + validação + i18n

O essencial, na ordem em que você deve escrever:

1. **`domain/types.ts`** — quatro tipos, sempre os mesmos papéis:
   - `T<N>`: entidade de domínio, datas como `Date`.
   - `T<N>ApiData = Omit<T<N>, 'created_at'|'updated_at'> & TTimestampedApiResource`
     (o contrato de datas em string vem de `@/src/contracts/finance-api/resources.contracts`).
   - `T<N>Filter = TBaseFilter & { ...campos filtráveis }` (`TBaseFilter` vem de `@fintech/ui`).
   - `T<N>Persist = { id?: string; ...campos graváveis }`.
2. **`domain/<n>.domain.ts`** — classe com campos `public readonly`, `constructor(data: T<N>)`
   e `static create(props)` que valida `created_at`/`updated_at` com `DateVO.tryCreate` e
   lança `Invalid <n> <campo>: ...` em caso de falha.
3. **`mappers/<n>.mapper.ts`** — `apiDataToDomain` (usa `parseDate(...)` de
   `@/src/shared/result.mapper`), `jsonToDomain`, `domainToJson`, `apiDataToJson`,
   `map<N>JsonResult`, `map<N>JsonListResult`.
4. **`services/<n>.service.ts`** — classe + singleton exportado. `fetchList` usa
   `baseUrl: '/api'`, `path: '/<R>'`; `create`/`update`/`delete` idem. `fetchList` e `create`
   devolvem `Result<Domain>` (mapeado); `update`/`delete` devolvem
   `Result<{ message: string }>` **sem** mapear.
5. **`hooks/use-<n>s.ts`** — `'use client'`; estado `meta`/`items`; `fetchList` com
   `limit: '10'` quando há `page` e não há `limit`; `goToPage` com clamp; `create`/`update`
   via `persist`; `remove`; todos chamando `executeServiceAlert({ messagePrefix: '<n>', ... })`.
   Retorne `{ meta, persist, refresh, goToPage, isLoading, items, fetchList, remove }`.
6. **`components/form/<N>Form.tsx`** — `Form` de `@fintech/ui` com `initialValues`,
   `fields`, `actions` (`form.action.save` / `form.action.cancel`), `onSuccess` convertendo
   `Record<string,string>` → `T<N>Persist` (números com `parseInt`/`Number`, booleanos com
   default) e `onError` com `showAlert({ variant: 'error', ... })`.
7. **`components/list/<N>List.tsx`** — `Lang langKey="<n>.empty"` quando vazio; `<ul>` com
   avatar (primeira letra), nome e `Icon icon="edit"|"trash"` disparando `onEdit`/`onDelete`.
8. **`pages/<n>.page.tsx`** — `'use client'`; `useModal`; `openModalForm(item?)` com
   `<N>Form key={item?.id ?? 'new'}`; `openModalDelete` com `<Delete>` de `@/src/components`;
   `useEffect(() => { void fetchList({ page: '1' }) }, [fetchList])`; `Pagination` quando
   `meta && items.length`; renderiza `{modal}`.
9. **`index.ts`** do feature — barrel:
   ```ts
   export * from './components';
   export * from './domain';
   export * from './hooks';
   export * from './mappers/<n>.mapper';
   export { default as <N>Page } from './pages/<n>.page';
   export * from './services';
   ```
10. **`src/server/integrations/api/<n>/<n>.service.ts`** — `import 'server-only'`, recebe
   `token: string` como primeiro parâmetro de todo método, usa `FINANCE_API_BASE_URL` e
   `mapEmptyStringsToNull(...)` no body. Exporta singleton `<n>ApiService`.
11. **`.../validation.ts`** — `parse<N>PersistBody(request)` usando `readJsonObject`,
    `requiredString`, `optionalString`, `optionalNumber`, `requiredNumber`,
    `RequestValidationError` de `@/src/server/validation/request-validation`. Tipar o retorno
    como `Omit<T<N>Persist, 'id'>` ou `T<N>PersistApiData`.
12. **`app/api/<R>/route.ts`** — `GET` + `POST`. Sessão primeiro
    (`getServerSession()` → 401). **Os dois `catch` chamam `requestValidationResponse(error)`**
    antes do fallback 500 (`'Could not load list of <n>.'` / `'Could not create <n>.'`) — no GET
    é o que transforma query param inválido em 400. Use
    `parseResourceFilterQuery(request.nextUrl.searchParams, ['name', ...])` no GET e
    `mapListResult(await <n>ApiService.fetchList(...), <n>ApiDataToJson)`.
13. **`app/api/<R>/[identifier]/route.ts`** — `PUT` + `DELETE`, com
    `type <n>RouteContext = { params: Promise<{ identifier: string }> }` e
    `const { identifier } = await context.params`.
14. **`app/(protected)/<R>/page.tsx`** — três linhas:
    ```tsx
    import { <N>Page } from '@/src/features/<n>';

    export default function <N>RouterPage() {
      return <<N>Page />
    }
    ```
15. **i18n** — adicione o grupo `<n>` **na raiz** dos três arquivos
    `src/locales/{pt-BR,en-US,es-UE}.json` (não dentro de `finance.*` — ver Gotchas) e a
    entrada em `src/app-shell/menu.ts` (`{ href: '/<R>', icon: '<ícone>', label: 'navigation.<n>' }`),
    mais **duas** chaves de navegação nos três locales. **Não** adicione `form.action.*` nem
    `form.validation.*`: vêm do `packages/ui` (§Gotchas).

    ```json
    "navigation": {
      "<n>": "Rótulo do menu",
      "<R>": "Rótulo do breadcrumb"
    }
    ```

    `<n>` é o usado pelo `menu.ts`; `<R>` é o slug da rota, porque o breadcrumb do
    `AppShell` deriva a chave de `navigation.${segmento-da-url}` (§Gotchas).

> **A camada BFF não é opcional nem "cola".** Ela define o contrato que o cliente consome
> (`GET/POST /api/<R>`, `PUT/DELETE /api/<R>/<id>`), é a única que conhece o token do cookie e
> a única que traduz `Result`→HTTP. Os 4 métodos do service cliente **só existem se** as 4
> funções da rota existirem, com os mesmos caminhos. Detalhes, tabela de contrato e teste por
> curl em [`references/bff-routes-anatomy.md`](references/bff-routes-anatomy.md).

---

## 4. Verificação (rode antes de dizer "pronto")

**4a. Estático** — lint e tipos:

```bash
# lint só no que você tocou (falha o comando se houver warning)
node_modules/.bin/eslint \
  src/features/<n> src/server/integrations/api/<n> app/api/<R> \
  --max-warnings 0

# typecheck do app inteiro; compare com o baseline (ver Gotchas)
node_modules/.bin/tsc --noEmit
```

**4b. A camada BFF pela borda** — prova que a rota existe, autentica, valida e persiste,
antes de abrir o browser:

```bash
TOKEN="$(cat /tmp/token.txt)"
curl -s -w '\n%{http_code}\n' http://localhost:3001/api/<R> -H "Cookie: auth-token=$TOKEN"
curl -s -w '\n%{http_code}\n' -X POST http://localhost:3001/api/<R> \
  -H "Cookie: auth-token=$TOKEN" -H 'Content-Type: application/json' -d '{"name":"Prova"}'
curl -s -w '\n%{http_code}\n' -X POST http://localhost:3001/api/<R> \
  -H "Cookie: auth-token=$TOKEN" -H 'Content-Type: application/json' -d '{"name":"  "}'
curl -s -w '\n%{http_code}\n' http://localhost:3001/api/<R>
```

Esperado: `200` (lista), `200` (com `id`), `400 name must be a non-empty string.`, `401
Unauthorized`. `404 FastApiError` significa endpoint inexistente no backend — não é bug da
rota.

**4c. A UI real** — o driver (§5) contra o app rodando, os três fluxos: criar (recarregar e
ver o item), editar (nome novo na lista) e excluir (lista vazia).

---

## 5. Driver headless (a forma de ver a feature funcionando)

`.claude/skills/create-feature/scripts/driver.mjs` abre o Chrome headless, injeta o cookie de
sessão e executa comandos na página. Não depende de Playwright/Puppeteer — usa CDP direto no
`/usr/bin/google-chrome`.

Pré-requisitos, verificados neste ambiente:

- **App rodando em `http://localhost:3001`** — o script `dev` de `apps/web` é
  `next dev --port 3001`. Já existe uma instância ativa aqui; o Next 16 recusa uma segunda
  ("Another next dev server is already running"), então reaproveite a que está no ar em vez
  de subir outra.
- **Backend Finance em `http://127.0.0.1:8000`** (é o `API_BASE_URL` default). Confirme com
  `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8000/openapi.json` → `200`.
- **`/usr/bin/google-chrome`** presente (o driver não usa Playwright/Puppeteer).
- **O app precisa responder 200** numa página qualquer antes de culpar o driver:
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/account`. Se der 500, o
  dev server está com import quebrado (ver Gotchas) — o driver vai imprimir `TEXT>>` vazio.

Obtenha um token de teste (usuário descartável; não use credencial real):

```bash
BASE=http://127.0.0.1:8000
TS="$(date +%s)"
EMAIL="skill-probe-$TS@example.com"
curl -s -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d "{\"name\":\"Skill Probe\",\"email\":\"$EMAIL\",\"username\":\"skillprobe$TS\",\"date_of_birth\":\"1990-01-01T00:00:00\",\"password\":\"Probe123!\"}" >/dev/null
curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' \
  -d "{\"credential\":\"$EMAIL\",\"password\":\"Probe123!\"}" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.parse(d).access_token))' > /tmp/token.txt
```

> O cookie se chama `auth-token` e o driver o define sozinho via `Network.setCookie`.

Fluxo de criação, exatamente como foi validado (feature `account`):

```bash
node .claude/skills/create-feature/scripts/driver.mjs \
  --token "$(cat /tmp/token.txt)" \
  --url http://localhost:3001/account \
  --do "click=Nova conta" \
  --do "wait=1200" \
  --do "fill=account.name.label:Conta Skill" \
  --do "fill=account.type.label:CHECKING" \
  --do "click=Salvar" \
  --do "wait=2500" \
  --do "goto=http://localhost:3001/account" \
  --do "wait=2000" \
  --do "text" \
  --shot /tmp/after-create.png
```

Saída esperada (trecho): `CLICK Nova conta`, `FILL name`, `FILL type`, `CLICK Salvar`, e no
`TEXT>>` final o item criado com o tipo traduzido (`Conta Skill` / `Conta corrente`). **Abra o
PNG e confira** — se a tela estiver vazia ou em erro, a feature não está pronta.

Editar e excluir, também validados (a lista tem ícones sem texto — clique por seletor CSS):

```bash
# EDITAR: o 1o span.cursor-pointer e o lápis; o 2o e a lixeira
node .claude/skills/create-feature/scripts/driver.mjs \
  --token "$(cat /tmp/token.txt)" --url http://localhost:3001/account \
  --do "wait=2500" \
  --do "click=css:span.cursor-pointer" \
  --do "wait=1500" \
  --do "fill=account.name.label:Conta Editada" \
  --do "click=Salvar" --do "wait=2500" \
  --do "goto=http://localhost:3001/account" --do "wait=2000" \
  --do "text" --shot /tmp/after-edit.png

# EXCLUIR: abre a confirmacao no 2o icone e confirma
node .claude/skills/create-feature/scripts/driver.mjs \
  --token "$(cat /tmp/token.txt)" --url http://localhost:3001/account \
  --do "wait=2500" \
  --do "eval=(()=>{const s=[...document.querySelectorAll('span.cursor-pointer')];s[1].click();return 'opened'})()" \
  --do "wait=1200" \
  --do "click=Delete" --do "wait=2500" \
  --do "goto=http://localhost:3001/account" --do "wait=2000" \
  --do "text" --shot /tmp/after-delete.png
```

Resultado esperado: `after-edit.png` mostra `Conta Editada`; `after-delete.png` mostra
`Nenhuma conta encontrada.`

Quatro detalhes que fazem esse fluxo falhar se ignorados:

- **`click=` recebe o texto RENDERIZADO**, não a chave i18n. `click=Nova conta` funciona;
  `click=account.create.title` só funciona se o i18n estiver quebrado (a chave crua aparece
  na tela). Rode `--do "text"` antes para ler os rótulos reais.
- **`fill=` em `<select>` recebe o `value` da opção**, não o rótulo: `CHECKING`, `SAVINGS`,
  `CASH`, `INVESTMENT`, `OTHER` (maiúsculas).
- **Ícones de editar/excluir não têm texto nem `aria-label`** — `click=Editar` não existe. Use
  `click=css:span.cursor-pointer` (1º = lápis) ou o `eval` acima para escolher o 2º. O
  `:nth-of-type()` não funciona aqui porque cada ícone está num wrapper próprio.
- **A lista não se atualiza sozinha após criar** (ver Gotchas): o `goto=` de volta para a
  mesma URL é o que prova que o item foi persistido.

Comandos de `--do`:

| Comando | Efeito |
|---|---|
| `goto=<url>` | navega |
| `wait=<ms>` | espera |
| `text` / `text=<css>` | imprime innerText do body / do elemento |
| `click=<texto>` | clica no 1º `button/a/[role=button]` cujo texto contém `<texto>` |
| `click=css:<seletor>` | clica por seletor CSS |
| `fill=<label>=<valor>` | preenche o campo do label (comparação sem caixa) e dispara input/change |
| `eval=<js>` | avalia JS e imprime o JSON |
| `shot=<path>` | screenshot PNG |

O exit code é `!= 0` se qualquer comando falhar — falha é explícita, nunca silenciosa.

---

## 6. Testes

Padrão do repo (Jest, `testMatch: **/test/**/*.test.ts(x)`):

- `src/features/<n>/test/<N>Form.test.tsx` — renderiza o form, verifica validação de campo
  obrigatório e o payload enviado em `onSubmit` (criação e edição com `id`).
- `src/features/<n>/test/<n>.mapper.test.ts` — datas inválidas viram `Result` de falha.
- `src/server/integrations/api/<n>/test/validation.test.ts` — `parse<N>PersistBody` rejeita
  campos faltando/inválidos e aceita o caso feliz.
- `src/server/integrations/api/<n>/test/route.test.ts` — `/** @jest-environment node */`,
  mocka `@/src/server/auth` e `../../config`, importa `GET/POST` de `@/app/api/<R>/route`.

> ⚠️ **Neste ambiente o Jest não executa** (TypeScript 7 + ts-jest). Ver Gotchas. Escreva os
> testes no padrão acima mesmo assim; valide a feature pelo driver.

---

## 7. Checklist de conclusão

- [ ] `domain/types.ts` com os 4 tipos + `TTimestampedApiResource`
- [ ] classe de domínio validando datas com `DateVO`
- [ ] mapper com os 6 exports (`apiDataToDomain`, `jsonToDomain`, `domainToJson`, `apiDataToJson`, `map*JsonResult`, `map*JsonListResult`)
- [ ] service cliente com `baseUrl: '/api'` e singleton
- [ ] hook `use-<n>s` retornando `{ meta, persist, refresh, goToPage, isLoading, items, fetchList, remove }`
- [ ] `<N>Form` e `<N>List` + barrels (`components/index.ts`, `form/index.ts`, `list/index.ts`)
- [ ] `<n>.page.tsx` com modais e paginação
- [ ] `index.ts` do feature exportando tudo
- [ ] `server/integrations/api/<n>/{<n>.service.ts,validation.ts}` com `'server-only'`
- [ ] `app/api/<R>/route.ts` (GET/POST) e `app/api/<R>/[identifier]/route.ts` (PUT/DELETE)
- [ ] `app/(protected)/<R>/page.tsx`
- [ ] i18n nos 3 locales (grupo `<n>` na **raiz**) + `menu.ts` + `navigation.<n>` e `navigation.<R>`
- [ ] endpoint do recurso confirmado no OpenAPI do backend
- [ ] `GET /api/<R>?bogus=1` devolve **400**, não 500 (catch do GET com `requestValidationResponse`)
- [ ] `eslint --max-warnings 0` limpo nos arquivos novos
- [ ] `tsc --noEmit` sem erros novos
- [ ] driver: criar item, recarregar a lista e vê-lo na tela (screenshot conferido)
- [ ] driver: editar (nome novo aparece) e excluir (lista vazia)

---

## Gotchas (erros reais encontrados neste repo)

- **Use `localhost`, não `127.0.0.1`, ao dirigir o app.** O dev server do Next 16 bloqueia
  recursos `/_next/*` quando a origem é `127.0.0.1` (aviso `Blocked cross-origin request to
  Next.js dev resource /_next/hmr`). O HTML renderiza, mas o React **não hidrata**: nenhum
  clique funciona e `document.querySelectorAll('input').length` fica 0. Com
  `http://localhost:3001` a hidratação acontece e os cliques passam.
- **Rótulos do `Form` aparecem em CAIXA ALTA** (`uppercaseLabel`). Por isso o `fill=` compara
  labels ignorando caixa; se você buscar por `institution.name.label` no DOM encontrará
  `INSTITUTION.NAME.LABEL`.
- **Jest não roda com TypeScript 7 neste ambiente**: `ts-jest` falha com
  `The TypeScript compiler "typescript" (version 7.0.2) does not expose the JavaScript
  compiler API required by ts-jest`. Não é bug da sua feature — não tente "consertar" mudando
  `typescript`. Valide pelo driver.
- **`tsc --noEmit` já tem erros no baseline (12, medidos em 2026-11-17)** em
  `app/api/transactions/*`, `features/transactions/statement/mappers/*` e em testes de
  validação que importam `parseAccountPersistBody` de módulos errados. Compare a contagem
  antes/depois; só os erros novos são seus. O baseline muda se o repo estiver no meio de um
  refactor — recontar é parte do trabalho.
- **O dev server pode estar globalmente quebrado por trabalho em andamento.** Em 2026-11-17
  `app/api/transactions/route.ts` importava `@/src/features/transaction/*`, que havia sido
  movido para `src/features/transactions/transaction/`. Resultado: **toda** página devolve
  500 (`_error`) e o driver não vê nada, mesmo com a sua feature correta. Verifique antes de
  culpar seu código: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/account`
  deve dar 200; se der 500, olhe `grep "Module not found" .next/dev/logs/next-development.log`.
- **Não há script `test` no `package.json` do app** e o binário `jest` não está em
  `apps/web/node_modules/.bin`. Se precisar invocar: `../../packages/jest-config/node_modules/.bin/jest`
  (vai falhar pelo motivo acima).
- **`update`/`delete` não devolvem o domínio**, apenas `Result<{ message: string }>`; só
  `fetchList` e `create` mapeiam. Depois de criar/atualizar o hook chama `refresh()`.
- **`parseResourceFilterQuery` só aceita campos em allowlist** (`page`, `limit`, `order_by`,
  `clean_cache`, `with_deleted` + os que você passar). Campo não listado lança
  `RequestValidationError` — e a rota só devolve 400 se o `catch` chamar
  `requestValidationResponse(error)`.
- **`app/(protected)/layout.tsx` redireciona para `/join` sem cookie.** Sem `--token`, o
  driver sempre cai no login.
- **Grupo de i18n da feature vai na RAIZ do JSON, não em `finance.*`.** Estado medido nos três
  locales: na raiz existem só `navigation`, `auth`, `card`, `account`, `transaction`, `category`
  e `finance`; `beneficiary`, `payer`, `institution`, `receipt` e `payment` vivem **apenas**
  dentro de `finance`. Por isso o código delas usa a chave literal `finance.payer.name.label`,
  enquanto `account`/`category` usam `account.name.label`. Para feature nova use a raiz e
  chaves `<n>.<campo>`: aninhar em `finance` faz a tela renderizar a chave crua
  (`supplier.title` em vez de "Fornecedores"). Validei na UI — só com o grupo na raiz os
  textos aparecem.
- **`form.action.save` / `form.action.cancel` NÃO ficam em `src/locales/`.** Essas chaves
  vêm de `packages/ui/src/components/form/locales/{pt-BR,en-US,es-UE}.json` (junto com
  `form.validation.required`, `form.label.*`, `form.placeholder.*`). Não as duplique nos
  locales do app — só adicione lá o grupo `<n>` e as chaves `navigation.*`.
- **O breadcrumb deriva a chave do slug da URL, não do label do menu.**
  `AppShell.tsx:50` faz `return 'navigation.' + value`, onde `value` é o segmento da rota
  (`/suppliers` → `navigation.suppliers`). Com exceções hardcoded só para
  `institution`, `institution/source`, `institution/destination` e `credit card`. Por isso
  uma rota plural precisa de `navigation.<R>` (plural) **além** de `navigation.<n>` (menu).
  Sintoma: o menu mostra "Fornecedor" e o breadcrumb mostra `navigation.suppliers`.
- **A lista não se atualiza depois de criar.** O `create` do hook faz `await refresh()`, mas
  `refresh()` sai na primeira linha porque `isLoading` ainda é `true` (está dentro do mesmo
  `execute`). Comportamento idêntico em todos os hooks do repo (`account`, `payer`,
  `category`, `institution`, `credit-card`, `beneficiary`, `transaction`) — é convenção
  existente, não bug da sua feature. Consequência prática: para provar a criação, recarregue
  a página (`--do "goto=<mesma url>"`). O alerta `.<n>.create.success` aparece normalmente.
- **`click=` casa com o texto renderizado, não com a chave i18n.** Se o i18n estiver correto,
  `click=account.create.title` não encontra nada (a tela mostra "Nova conta"); se encontrar,
  é sinal de chave crua na tela. Use `--do "text"` para ler os rótulos antes de clicar.
- **`fill=` em `<select>` precisa do `value` da opção, não do rótulo** (`CHECKING`, `SAVINGS`,
  `CASH`, `INVESTMENT`, `OTHER` em `account.type`). O driver dispara `change`, mas o `Form`
  valida o valor da opção — rótulo minúsculo (`checking`) faz o campo continuar "obrigatório".
- **Recurso inexistente no backend devolve 404 `FastApiError`**, não um erro de código. Antes
  de gerar a feature, confirme o endpoint no OpenAPI (§1). O caminho feliz para provar o
  encanamento sem backend novo: apontar temporariamente os `path:` dos dois services para um
  recurso existente (`/institutions`) e validar na UI; depois reverter.
- **`institution` é um mau exemplo para copiar i18n.** O grupo está em `finance.institution`
  e só tem `title/source/destination`, então a tela renderiza `institution.title`,
  `institution.create.title`, `institution.empty` crus. Use `account` ou `category` como
  referência de i18n — os grupos estão na raiz e completos.
- **Barrels de `account` e `credit-card` estão incompletos (cópia malfeita no repo).**
  `src/features/account/hooks/index.ts` exporta `useCreditCards` apontando para
  `./use-accounts`; o `index.ts` de `account` e `credit-card` só exporta `domain` e `Page`,
  sem `components`/`hooks`/`services`. Os barrels corretos são os de `beneficiary`,
  `institution` e `payer` — use esses como referência (§3 item 9).
- **O `errorMessage` do `update` sem `id` aponta para outra feature.** Todos os hooks
  (`account`, `beneficiary`, `category`, `credit-card`, `institution`, `payer`) usam
  `'finance.payer.update.error.no_id'`. Na feature nova use a sua própria chave
  (`'<n>.update.no_id'`), não copie o literal — e não "conserte" os outros (fora de escopo).

---

## Troubleshooting

| Sintoma | Causa / correção |
|---|---|
| **Todas** as páginas devolvem 500 e o body é `__NEXT_DATA__` com `"page":"/_error"` | não é a sua feature: algum arquivo do app tem import quebrado. Veja `tail -50 .next/dev/logs/next-development.log \| grep "Module not found"`. Já aconteceu aqui com um refactor de `src/features/transaction/` → `transactions/transaction/` em curso |
| Driver imprime `FAIL [click=...] no clickable with text` | texto não existe na tela (feature não renderizou) ou está em outro idioma — o app está em pt-BR por padrão; use o texto do locale pt-BR |
| Clique não abre modal, `inputs=0` | origem `127.0.0.1` em vez de `localhost` (ver Gotchas) |
| `fill=` responde `no field for:` | label divergente do usado no `Form`; rode `--do "text"` para ver o texto renderizado. O driver já tenta `aria-label`, `name`/`id`, `<label for>` e, por fim, o nome do campo derivado da chave (`supplier.name.label` → `name`) |
| Modal abre mas `input.value` não muda | campos controlados pelo `Form`: use `fill=` (dispara `input`+`change` via setter nativo), não `eval` com `el.value = ...` |
| Menu traduzido mas breadcrumb mostra `navigation.<x>` | falta a chave `navigation.<R>` (slug plural) — ver Gotchas |
| Tela mostra `supplier.title` cru em vez do texto | grupo i18n aninhado em `finance.*` — mova para a raiz do JSON |
| `GET/POST /api/<R>` devolve 401 | cookie ausente/expirado — gere token novo |
| `GET /api/<R>?x=1` devolve **500** com `Unsupported query parameter: x.` | falta `requestValidationResponse(error)` no `catch` do GET — deve ser **400** (ver `bff-routes-anatomy.md`) |
| `GET /api/<R>` devolve 400 `Unsupported query parameter` | query param fora da allowlist de `parseResourceFilterQuery` |
| `POST /api/<R>` devolve 500 `Could not create ...` | backend recusou; inspecione o body exigido no OpenAPI (§1) |