# Anatomia da camada BFF — `app/api/**/route.ts`

A camada `app/api` é o **contrato entre o front e o backend**. Ela não tem lógica de negócio:
só autentica, valida o payload, chama o serviço server-only e traduz `Result` → HTTP.

```
navegador (cliente)
   │  fetch via HttpClient com baseUrl '/api'      ← src/features/<n>/services/<n>.service.ts
   ▼
app/api/<R>/route.ts          GET (lista) + POST (cria)
app/api/<R>/[identifier]/route.ts   PUT + DELETE
   │  getServerSession() → token do cookie
   │  parse<N>PersistBody() / parseResourceFilterQuery()
   ▼
src/server/integrations/api/<n>/<n>.service.ts   ('server-only')
   │  Authorization: Bearer <token>
   ▼
Finance API (FINANCE_API_BASE_URL)
```

Inventário real do repo — todas as 15 rotas seguem o mesmo shape:

| Rota | Métodos |
|---|---|
| `app/api/accounts/route.ts` + `[identifier]` | GET, POST / DELETE, PUT |
| `app/api/beneficiaries/…` | idem |
| `app/api/categories/…` | idem |
| `app/api/credit-cards/…` | idem |
| `app/api/institutions/…` | idem |
| `app/api/payers/…` | idem |
| `app/api/transactions/…` | idem |
| `app/api/statement/route.ts` | GET (somente leitura) |

Convenções verificadas em todas elas:

- **Toda rota chama `getServerSession()`** e devolve 401 sem `session.token`. Não há exceção.
- O `catch` sempre passa por `requestValidationResponse(error)` antes do 500.
- Erros de domínio usam `getApiErrorStatusCode(response)` (preserva o status do backend, 422
  como fallback).
- A lista e o create **mapeiam** a resposta com `mapListResult`/`mapResult` +
  `<n>ApiDataToJson`; update/delete devolvem o `instance` cru (`{ message }`).
- `params` é `Promise` (Next 16): `await context.params`.

---

## Contrato que o cliente espera da rota

O `src/features/<n>/services/<n>.service.ts` chama exatamente estes caminhos — se a rota não
existir, o cliente recebe 404 e a tela fica vazia:

| Método do service cliente | Rota BFF | Corpo enviado | Resposta esperada |
|---|---|---|---|
| `fetchList(filters)` | `GET /api/<R>?page=&limit=&name=` | — | array ou `{ items, meta }` |
| `create(data)` | `POST /api/<R>` | `T<N>Persist` | `T<N>ApiData` |
| `update(id, data)` | `PUT /api/<R>/<id>` | `T<N>Persist` | `{ message }` |
| `delete(id)` | `DELETE /api/<R>/<id>` | — | `{ message }` |

O mapeamento acontece **na rota**, não no cliente: a rota devolve `ApiData` já normalizado
(datas ISO, campos nulos resolvidos) e o service cliente aplica `map<N>JsonResult` para virar
domínio. Por isso `<n>ApiDataToJson` aparece nas rotas — ela valida e normaliza antes de sair.

---

## `app/api/<R>/route.ts` — GET + POST

```ts
import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';

import { <n>ApiService } from '@/src/server/integrations/api/<n>/<n>.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import {
  <n>ApiDataToJson
} from '@/src/features/<n>/mappers/<n>.mapper';
import {
  parse<N>PersistBody
} from '@/src/server/integrations/api/<n>/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = mapListResult(
      await <n>ApiService.fetchList(session.token, params),
      <n>ApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of <n>.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parse<N>PersistBody(request);
    const response = mapResult(
      await <n>ApiService.create(session.token, body),
      <n>ApiDataToJson,
    );
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not create <n>.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}
```

Pontos críticos:

- **Sessão primeiro**, antes de qualquer parse — sem token → 401.
- `parseResourceFilterQuery(searchParams, [...])` tem **allowlist**: `page`, `limit`,
  `order_by`, `clean_cache`, `with_deleted` + os campos que você listar. Qualquer outro
  parâmetro lança `RequestValidationError` com `Unsupported query parameter: <x>.` — que vira
  **400** só se o `catch` chamar `requestValidationResponse` (ver o bullet abaixo).
- `getApiErrorStatusCode(response)` traduz o `statusCode` do backend; se não houver, 422.
- O `catch` do GET de lista **também** chama `requestValidationResponse`: o GET não parseia
  body, mas `parseResourceFilterQuery` lança `RequestValidationError` para query param fora da
  allowlist. Medido no repo, com `?bogus=1`: **6 das 7 rotas de lista devolvem 500** com
  `Unsupported query parameter: bogus.` — `accounts`, `beneficiaries`, `categories`,
  `credit-cards`, `institutions` (e `transactions`, que devolve até uma página HTML de erro).
  Só `payers` devolve **400**, porque é a única cujo `catch` do GET chama
  `requestValidationResponse`. O template abaixo é o **correto** (400); não copie o das
  outras rotas.

---

## `app/api/<R>/[identifier]/route.ts` — PUT + DELETE

```ts
import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  <n>ApiService
} from '@/src/server/integrations/api/<n>/<n>.service';
import {
  parse<N>PersistBody
} from '@/src/server/integrations/api/<n>/validation';
import {
  requestValidationResponse
} from '@/src/server/validation/request-validation';

type <n>RouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function DELETE(
  _: NextRequest,
  context: <n>RouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await <n>ApiService.delete(session.token, identifier);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete <n>.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: <n>RouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parse<N>PersistBody(request);

    const response = await <n>ApiService.update(session.token, identifier, body);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update <n>.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
```

> No Next 16 os `params` de rota são uma **Promise** (`await context.params`). Não use o
> formato antigo `{ params: { identifier } }`.

---

## Testando a rota pela borda (curl, sem UI)

Forma mais rápida de provar que a rota existe, autentica, valida e persiste — antes de
sequer abrir o browser:

```bash
TOKEN="$(cat /tmp/token.txt)"
# lista (200 com array/objeto paginado)
curl -s -w '\n%{http_code}\n' http://localhost:3001/api/<R> -H "Cookie: auth-token=$TOKEN"
# cria (200 + corpo com id)
curl -s -w '\n%{http_code}\n' -X POST http://localhost:3001/api/<R> \
  -H "Cookie: auth-token=$TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Prova"}'
# validação (400 com a mensagem do RequestValidationError)
curl -s -w '\n%{http_code}\n' -X POST http://localhost:3001/api/<R> \
  -H "Cookie: auth-token=$TOKEN" -H 'Content-Type: application/json' -d '{"name":"  "}'
# sem sessão (401)
curl -s -w '\n%{http_code}\n' http://localhost:3001/api/<R>
```

Resultados esperados, medidos neste repo: `200`, `200`, `400 name must be a non-empty
string.`, `401 Unauthorized`. Se o recurso não existir no backend, o 200 vira
`404 {"message":{"error":"FastApiError","message":"Not Found","statusCode":404}}` — sinal de
endpoint errado, não de rota mal escrita.

---

## Teste automatizado da rota

`src/server/integrations/api/<n>/test/route.test.ts`:

```ts
/** @jest-environment node */
import { NextRequest } from 'next/server';

import { GET, POST } from '@/app/api/<R>/route';
import { DELETE, PUT } from '@/app/api/<R>/[identifier]/route';
import { getServerSession } from '@/src/server/auth';

jest.mock('@/src/server/auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

const context = { params: Promise.resolve({ identifier: '<n>-1' }) };

function request(method: string, payload?: unknown) {
  const path = method === 'PUT' || method === 'DELETE' ? '/<R>/<n>-1' : '/<R>';
  return new NextRequest(`http://localhost/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });
}

describe('<n> routes', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    jest.mocked(getServerSession).mockResolvedValue({ isAuthenticated: true, token: 'test-token' });
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([]));
  });

  afterEach(() => jest.restoreAllMocks());

  it('lists <n> for an authenticated session', async () => {
    const response = await GET(request('GET'));
    expect(response.status).toBe(200);
  });

  it('returns 401 without a session', async () => {
    jest.mocked(getServerSession).mockResolvedValue({ isAuthenticated: false });
    const response = await GET(request('GET'));
    expect(response.status).toBe(401);
  });
});
```

> ⚠️ Jest não executa neste ambiente (TS 7 + ts-jest). Escreva no padrão e valide pela borda
> (curl) + driver.