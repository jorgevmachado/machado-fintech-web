# Anatomia da feature (cliente) — código canônico

Extraído de `src/features/institution` (caso mínimo) e `src/features/credit-card` (caso com
enum e número). Substitua `<n>`/`<N>`/`<R>` conforme §2 do SKILL.md.

---

## `src/features/<n>/domain/types.ts`

```ts
import { TBaseFilter } from '@fintech/ui';
import {
  TTimestampedApiResource
} from '@/src/contracts/finance-api/resources.contracts';

export type T<N> = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
}

export type T<N>Filter = TBaseFilter & {
  name?: string;
};

export type T<N>ApiData = Omit<T<N>, 'created_at' | 'updated_at'> & TTimestampedApiResource;

export type T<N>Persist = {
  id?: string;
  name: string;
}
```

Com enum (`domain/enum.ts`):

```ts
export const <X>Map = {
  A: 'A',
  B: 'B',
} as const;

export type <X>Enum = typeof <X>Map[keyof typeof <X>Map];
```

Campos numéricos entram em `T<N>` como `number` e em `T<N>Persist` como `number`
(a conversão de string do form acontece no `<N>Form`).

---

## `src/features/<n>/domain/<n>.domain.ts`

```ts
import { DateVO } from '@fintech/shared';

import { T<N> } from './types';

export class <N> {
  public readonly id: string;
  public readonly name: string;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  constructor(data: T<N>) {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public static create(props: T<N>): <N> {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid <n> created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid <n> updated_at: ${updatedAtResult.error}`);
      }
    }

    return new <N>(props);
  }
}
```

Variante com lista fixa de opções (usada por `CreditCard` para o select de bandeiras):

```ts
public static get types(): Array<string> {
  return Object.values(<X>Map);
}
```

---

## `src/features/<n>/mappers/<n>.mapper.ts`

```ts
import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { T<N> ,T<N>ApiData, <N> } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function <n>ApiDataToDomain(data: T<N>ApiData): T<N> {
  return <N>.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', '<n>'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', '<n>'),
  })
}

export function <n>JsonToDomain(data: T<N>ApiData): T<N> {
  return <n>ApiDataToDomain(data);
}

export function <n>DomainToJson(data: T<N>): T<N>ApiData {
  return {
    id: data.id,
    name: data.name,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function <n>ApiDataToJson(data: T<N>ApiData): T<N>ApiData {
  return <n>DomainToJson(<n>ApiDataToDomain(data));
}

export function map<N>JsonResult(result: TResult<T<N>ApiData>): TResult<<N>> {
  return mapResult(result, <n>JsonToDomain);
}

export function map<N>JsonListResult(
  result: TResult<TPaginatedListResponse<T<N>ApiData>| Array<T<N>ApiData>>,
): TResult<TPaginatedListResponse<<N>> | Array<<N>>> {
  return mapListResult(result, <n>JsonToDomain);
}
```

`parseDate` lança em data inválida; `mapResult` converte o throw em `Result.fail`, então
`map<N>JsonResult(Result.ok({... created_at: 'lixo'}))` devolve falha com
`Invalid <n> created_at: lixo`.

---

## `src/features/<n>/services/<n>.service.ts` + `services/index.ts`

```ts
import { Result ,TPaginatedListResponse, HttpClient } from '@fintech/shared';

import { <N> ,T<N>ApiData ,T<N>Filter, T<N>Persist } from '../domain';
import {
  map<N>JsonResult,
  map<N>JsonListResult
} from '@/src/features/<n>/mappers/<n>.mapper';

export class <N>Service {
  public async fetchList(filters?: T<N>Filter): Promise<Result<TPaginatedListResponse<<N>> | Array<<N>>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<T<N>ApiData> | Array<T<N>ApiData>
    >({
      path: '/<R>',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return map<N>JsonListResult(result);
  }

  public async create(data: T<N>Persist): Promise<Result<<N>>> {
    const result = await HttpClient.post<T<N>ApiData>({
      path: '/<R>',
      baseUrl: '/api',
      config: { body: data },
    });
    return map<N>JsonResult(result);
  }

  public async update(identifier: string, data: T<N>Persist): Promise<Result<{ message: string }>> {
    return await HttpClient.put<{ message: string }>({
      path: `/<R>/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/<R>/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const <n>Service = new <N>Service();
```

```ts
// services/index.ts
export { <N>Service, <n>Service } from './<n>.service';
```

---

## `src/features/<n>/hooks/use-<n>s.ts` + `hooks/index.ts`

```ts
'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { <N> ,T<N>Filter ,T<N>Persist } from '../domain';
import { <n>Service } from '../services';

const messagePrefix = '<n>';

export default function use<N>s() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<<N>>>([]);

  const fetchList = useCallback(async (params?: T<N>Filter, options?: TAlertActionOptions) => {
    await execute(async () => {
      const response = await <n>Service.fetchList({
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {}),
      });
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });

      const instance = response.instance;
      if (!instance) {
        return;
      }

      if (Array.isArray(instance)) {
        setItems(instance);
        return;
      }
      setMeta(instance.meta);
      setItems(instance.items);
    })
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (
    page: number,
    params?: T<N>Filter,
    options?: TAlertActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: page.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }
    await fetchList();
  }, [fetchList, isLoading]);

  const create = useCallback(async (item: T<N>Persist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await <n>Service.create(item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'create',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const update = useCallback(async (item: T<N>Persist, options?: TAlertActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? '<n>.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }

    return execute(async () => {
      const response = await <n>Service.update(identifier, item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (item: T<N>Persist, options?: TAlertActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  const remove = useCallback(async (identifier: string, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await <n>Service.delete(identifier);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'delete',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList, remove };
}
```

```ts
// hooks/index.ts
export { default as use<N>s } from './use-<n>s';
```

---

## `src/features/<n>/components/form/<N>Form.tsx`

```tsx
'use client';
import { useCallback, useMemo } from 'react';

import { type FormProps ,type FormValidation ,useAlert, Form } from '@fintech/ui';

import { <N> ,T<N>Persist } from '@/src/features/<n>';

type <N>FormProps = {
  item?: <N>;
  onSubmit: (item: T<N>Persist) => void;
  onCancel: () => void;
};

export default function <N>Form({ item, onSubmit, onCancel }: <N>FormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    name: item?.name ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: '<n>.name.label',
      placeholder: '<n>.name.placeholder',
      required: true,
      value: initialValues.name ?? '',
    },
  ], [initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    onSubmit({
      id: item?.id,
      name: data.name ?? '',
    });
  }, [item, onSubmit]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'auth.form.validation.error',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <Form
      fields={fields}
      actions={{
        justify: 'end',
        submit: {
          children: 'form.action.save',
        },
        cancel: {
          children: 'form.action.cancel',
          onClick: onCancel,
        },
      }}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      className="space-y-4"
      initialValues={initialValues}
    />
  );
}
```

Tipos de campo disponíveis (`packages/ui/src/components/form/field/types.ts`):
`text`, `name`, `fullname`, `date`, `money`, `description`, `password`,
`password_confirmation`, `email`, `phone`, `select`, `autocomplete`, `color`, `icon-combobox`.
Para `select`, passe `options: [{ value, label }]`. Não existe campo `number`/`switch` —
números usam `text` + `parseInt` no `onSuccess`, booleanos vêm com default.

`layout` opcional (grid de 2 colunas), como em `AccountForm`:

```tsx
layout={{
  cols: 2,
  fields: [
    { name: 'name', span: 2 },
    { name: 'due_day', span: 1 },
  ],
}}
```

---

## `src/features/<n>/components/list/<N>List.tsx`

```tsx
import { Icon ,Lang } from '@fintech/ui';

import { <N> } from '@/src/features/<n>';

type <N>ListProps = {
  items: <N>[];
  onEdit: (<n>: <N>) => void;
  onDelete: (<n>: <N>) => void;
}

export default function <N>List({ items, onEdit, onDelete }: <N>ListProps) {
  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="<n>.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-account px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: '#6366f1' }}
            >
              <span className="text-xs font-bold" style={{ color: '#FFF' }}>
                {item.name[0]?.toUpperCase()}
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Icon icon="edit" onClick={() => onEdit(item)} className="cursor-pointer transition-colors text-amber-700 hover:bg-amber-50" />
            <Icon icon="trash" onClick={() => onDelete(item)} className="cursor-pointer transition-colors text-red-700 hover:bg-red-50" />
          </div>
        </li>
      ))}
    </ul>
  )
}
```

Barrels:

```ts
// components/form/index.ts
export { default } from './<N>Form';
// components/list/index.ts
export { default } from './<N>List';
// components/index.ts
export { default as <N>Form } from './form';
export { default as <N>List } from './list';
```

---

## `src/features/<n>/pages/<n>.page.tsx`

```tsx
'use client';
import { useEffect } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import use<N>s from '@/src/features/<n>/hooks/use-<n>s';
import { <N> ,T<N>Persist } from '@/src/features/<n>/domain';
import { Delete } from '@/src/components';

import { <N>Form ,<N>List } from '@/src/features/<n>/components';

export default function <N>Page() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = use<N>s();

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: <N>) => {
    openModal({
      title: `<n>.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const openModalForm = (item?: <N>) => {
    openModal({
      title: item?.id ? `<n>.edit.title, {name: ${item.name}}` : '<n>.create.title',
      children: <<N>Form key={item?.id ?? 'new'} item={item} onSubmit={handleSubmit} onCancel={closeModal} />,
    });
  }

  const handleSubmit = async (item: T<N>Persist) => {
    await persist(item);
    closeModal();
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold"><n>.title</Text>
        <Button onClick={() => openModalForm()}><n>.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground"><n>.loading</Text>
      ) : (
        <>
          <<N>List items={items} onEdit={openModalForm} onDelete={openModalDelete} />
          {meta && items.length && (
            <div className="mt-5 sm:mt-6">
              <Pagination
                isLoading={isLoading}
                totalPages={meta.total_pages}
                currentPage={meta.current_page}
                onPageChange={(page) => goToPage(page)}
              />
            </div>
          )}
        </>
      )}
      {modal}
    </div>
  )
}
```

Variante página-em-lugar-de-modal usada por `payer` (troca `mode` entre `list` e `form`).
Escolha modal (padrão da maioria) salvo se a feature tiver formulário grande.

---

## `src/features/<n>/index.ts`

```ts
export * from './components';
export * from './domain';
export * from './hooks';
export * from './mappers/<n>.mapper';
export { default as <N>Page } from './pages/<n>.page';
export * from './services';
```

> Cuidado com colisão de nomes no barrel: `export *` de `components` e `domain` convive bem,
> mas se dois arquivos exportarem o mesmo símbolo o TypeScript reclama. Prefira nomes únicos
> (`<N>Form`, `<N>List`, `<N>`, `<N>Page`, `<N>Service`).