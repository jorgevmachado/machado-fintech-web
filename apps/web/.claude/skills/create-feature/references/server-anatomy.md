# Anatomia do servidor — código canônico

Extraído de `src/server/integrations/api/institution/*` e `app/api/institutions/**`.
A camada de servidor fala com o Finance API real (token do cookie); a rota BFF — documentada
em [`bff-routes-anatomy.md`](bff-routes-anatomy.md) — é a única ponte que o cliente enxerga.

---

## `src/server/integrations/api/<n>/<n>.service.ts`

```ts
import 'server-only';

import { HttpClient } from '@fintech/shared';
import type { Result, TPaginatedListResponse } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  T<N>ApiData ,
  T<N>Persist,
} from '@/src/features/<n>/domain';
import { mapEmptyStringsToNull } from '@/src/shared/result.mapper';

export class <N>ApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<TPaginatedListResponse<T<N>ApiData> | Array<T<N>ApiData>>> {
    return HttpClient.get<
      TPaginatedListResponse<T<N>ApiData> | Array<T<N>ApiData>
    >({
      path: '/<R>',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchById(token: string, identifier: string): Promise<Result<T<N>ApiData>> {
    return HttpClient.get<T<N>ApiData>({
      path: `/<R>/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }

  public async create(token: string, data: Omit<T<N>Persist, 'id'>): Promise<Result<T<N>ApiData>> {
    return HttpClient.post<T<N>ApiData>({
      path: '/<R>',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async update(
    token: string,
    identifier: string,
    data: Partial<T<N>Persist>,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `/<R>/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body: mapEmptyStringsToNull(data) },
    });
  }

  public async delete(
    token: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `/<R>/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token },
    });
  }
}

export const <n>ApiService = new <N>ApiService();
```

Regras que se repetem em todos os serviços do repo:

- `import 'server-only'` na primeira linha — impede vazamento para o bundle do cliente.
- `token` é **sempre** o primeiro parâmetro (a rota BFF injeta `session.token`).
- `FINANCE_API_BASE_URL` vem de `../config` (nunca `process.env` direto).
- `mapEmptyStringsToNull(...)` no body de create/update, para que campos opcionais vazios
  virem `null` explícito no backend.
- Singleton exportado no fim.

> Variante legada: `src/server/integrations/finance-api/<n>.service.ts` usa
> `FINANCE_API_BASE_URL` de `./config` e contratos em `./contracts/<n>.contracts.ts`
> (`XApiResponse`, `XWriteRequest`). Prefira o padrão `integrations/api/<n>/` — é o que as
> rotas novas usam.

---

## `src/server/integrations/api/<n>/validation.ts`

Caso mínimo (só `name`):

```ts
import {
  readJsonObject ,
  requiredString ,
} from '@/src/server/validation/request-validation';
import type { T<N>Persist } from '@/src/features/<n>/domain';

export async function parse<N>PersistBody(request: Pick<Request, 'json'>): Promise<Omit<T<N>Persist, 'id'>> {
  const body = await readJsonObject(request);
  const name = requiredString(body, 'name');
  return { name };
}
```

Caso com opcionais e enum (padrão de `credit-card/validation.ts`):

```ts
import { T<N>Persist } from '@/src/features/<n>/domain';
import { <X>Map } from '@/src/features/<n>/domain/enum';
import {
  optionalNumber ,
  optionalString ,
  readJsonObject ,requiredNumber ,
  requiredString ,
  RequestValidationError,
} from '@/src/server/validation/request-validation';

export async function parse<N>PersistBody(
  request: Pick<Request, 'json'>,
): Promise<Omit<T<N>Persist, 'id'>> {
  const body = await readJsonObject(request);

  const name = requiredString(body, 'name');
  const description = optionalString(body, 'description');
  const limit = optionalNumber(body, 'limit');
  const due_day = requiredNumber(body, 'due_day');
  const is_active = body['is_active'] === undefined ? true : Boolean(body['is_active']);

  const kindValue = requiredString(body, 'kind');
  const kind = Object.values(<X>Map).find((value) => value === kindValue);
  if (!kind) {
    throw new RequestValidationError('kind must be a supported <n> kind.');
  }

  return {
    name,
    kind,
    due_day,
    is_active,
    ...(description === undefined ? {} : { description }),
    ...(limit === undefined ? {} : { limit }),
  };
}
```

Helpers disponíveis em `src/server/validation/request-validation.ts`:

| Helper | Uso |
|---|---|
| `readJsonObject(request)` | lê e valida que o body é objeto JSON |
| `requiredString(body, 'f')` | string não vazia |
| `optionalString(body, 'f')` | string ou `undefined` |
| `requiredNumber` / `optionalNumber` | número finito |
| `optionalBoolean` | booleano |
| `validateDateString(value, 'f')` | data ou ISO date-time |
| `parseResourceFilterQuery(searchParams, ['name'])` | allowlist de query params |
| `requestValidationResponse(error)` | `NextResponse` 400 se for `RequestValidationError` |
| `RequestValidationError` | erro de validação (vira 400) |

> Campos opcionais usam spread condicional (`...(x === undefined ? {} : { x })`) para não
> enviar `undefined` no body. Campos vazios de formulário viram `null` no serviço.

---

> **As rotas `app/api/**` não são duplicadas aqui.** O código canônico de
> `app/api/<R>/route.ts` (GET+POST) e `app/api/<R>/[identifier]/route.ts` (PUT+DELETE) vive
> só em [`bff-routes-anatomy.md`](bff-routes-anatomy.md) — ter o template em dois arquivos
> foi o que permitiu que eles divergissem.

## `app/(protected)/<R>/page.tsx`

```tsx
import { <N>Page } from '@/src/features/<n>';

export default function <N>RouterPage() {
  return <<N>Page />
}
```

O layout `app/(protected)/layout.tsx` já redireciona para `/join` quando não há sessão; a
rota BFF revalida a sessão de qualquer forma.

---

## Testes de servidor

`src/server/integrations/api/<n>/test/validation.test.ts`:

```ts
/** @jest-environment node */
import { parse<N>PersistBody } from '../validation';

describe('<n> persist validation', () => {
  it('accepts the required payload', async () => {
    await expect(parse<N>PersistBody({
      json: async () => ({ name: 'Acme' }),
    })).resolves.toEqual({ name: 'Acme' });
  });

  it('rejects a blank name', async () => {
    await expect(parse<N>PersistBody({
      json: async () => ({ name: '  ' }),
    })).rejects.toThrow('name must be a non-empty string.');
  });
});
```

> ⚠️ Jest não executa neste ambiente (TS 7 + ts-jest). Escreva no padrão, valide pelo driver.

---

## i18n

`src/locales/pt-BR.json` (idem `en-US`, `es-UE`). O grupo da feature fica na **raiz** do JSON
(não dentro de `finance` — só `beneficiary`, `payer`, `institution`, `receipt` e `payment`
estão lá, e por isso usam chaves `finance.<n>.*`), e a navegação precisa das **duas** chaves —
`<n>` para o `menu.ts` e `<R>` (slug da rota) para o breadcrumb:

```json
{
  "navigation": {
    "...": "...",
    "<n>": "Rótulo do menu",
    "<R>": "Rótulo do breadcrumb"
  },
  "<n>": {
    "title": "Título da tela",
    "loading": "Carregando...",
    "empty": "Nada encontrado.",
    "create": {
      "title": "Nova entidade",
      "success": "Criado com sucesso.",
      "error": "Erro ao criar."
    },
    "edit": { "title": "Editar: {{name}}" },
    "update": {
      "success": "Atualizado com sucesso.",
      "error": "Erro ao atualizar.",
      "no_id": "Identificador ausente."
    },
    "delete": {
      "confirm": "Excluir {{name}}?",
      "success": "Excluído com sucesso.",
      "error": "Erro ao excluir."
    },
    "list": { "error": "Erro ao carregar." },
    "name": {
      "label": "Nome",
      "placeholder": "Informe o nome"
    }
  }
}
```

As chaves usadas no código são exatamente `messagePrefix + '.' + type` no `executeServiceAlert`
(`<n>.create.success`, `<n>.update.error`, `<n>.delete.success`, `<n>.list.error`). Se faltar
alguma, o alerta mostra a chave crua — sinal de i18n incompleto.

> **Não adicione `form.action.*` nem `form.validation.*` em `src/locales/`.** Essas chaves
> vêm de `packages/ui/src/components/form/locales/*.json`, injetadas pelo `UIProvider`
> (`formLocales` em `packages/ui/src/components/form/index.ts`). Nos locales do app você só
> adiciona o grupo `<n>` e as chaves `navigation.*`.

`src/app-shell/menu.ts`:

```ts
{
  href: '/<R>',
  icon: '<ícone>',   // ícones disponíveis em packages/icons
  label: 'navigation.<n>',
},
```