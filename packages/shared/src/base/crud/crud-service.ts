import { HttpClient } from '../http';
import { Converter } from '../mapper/converter';
import { Result } from '../result';
import type { TCrudList, TPaginatedListResponse } from './paginate';

/**
 * Base para os services CRUD do app.
 *
 * Responsabilidade única: montar a requisição HTTP e delegar a conversão. As conversões são
 * hooks no mesmo estilo de `toBody` — quem estende aponta cada um para a função que já existe
 * no mapper da feature (`map<X>JsonResult` e `map<X>JsonListResult`).
 *
 * O `token` é o último parâmetro de todo método: o cliente (`baseUrl: '/api'`) não passa
 * nada, porque o cookie é enviado pelo browser; a rota BFF passa `session.token`.
 */
export abstract class CrudService<
  TApiData,
  TEntity = TApiData,
  TFilter = unknown,
  TPersist = unknown,
> extends Converter {
  /** URL base das requisições: `'/api'` no cliente, `FINANCE_API_BASE_URL` no servidor. */
  protected abstract readonly baseUrl: string;

  /** Caminho do recurso, sempre plural (`'/beneficiaries'`). */
  protected abstract readonly pathUrl: string;

  /**
   * Converte o resultado de um item. Aponte para o `map<X>JsonResult` do mapper da feature.
   * O padrão devolve o `Result` intacto (`TEntity = TApiData`).
   */
  protected toMapperEntity(result: Result<TApiData>): Result<TEntity> {
    return result as unknown as Result<TEntity>;
  }

  /**
   * Converte o resultado de uma lista (paginada ou não). Aponte para o
   * `map<X>JsonListResult` do mapper da feature.
   * O padrão devolve o `Result` intacto (`TEntity = TApiData`).
   */
  protected toMapperEntityList(
    result: Result<TCrudList<TApiData>>,
  ): Result<TCrudList<TEntity>> {
    return result as unknown as Result<TCrudList<TEntity>>;
  }

  /** Normaliza os filtros antes de virarem query string. Sobrescreva se precisar. */
  protected toParams(filters?: TFilter): Record<string, unknown> | undefined {
    return filters === undefined ? undefined : { ...(filters as Record<string, unknown>) };
  }

  /** Normaliza o body antes do POST/PUT. O servidor sobrescreve com `mapEmptyStringsToNull`. */
  protected toBody(data: TPersist): unknown {
    return data;
  }

  /** Lista paginada ou não, conforme o que o endpoint devolver. */
  public async fetchList(
    filters?: TFilter,
    token?: string,
  ): Promise<Result<TCrudList<TEntity>>> {
    const response = await HttpClient.get<TCrudList<TApiData>>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        params: this.toParams(filters),
        ...(token ? { token } : {}),
      },
    });

    return Result.try(() => this.toMapperEntityList(response));
  }

  /** Lista uma página. Usa `limit`, que é o parâmetro aceito pelo backend. */
  public async listPaginate(
    page: number,
    filters?: TFilter,
    perPage: number = 12,
    token?: string,
  ): Promise<Result<TPaginatedListResponse<TEntity>>> {
    const response = await HttpClient.get<TPaginatedListResponse<TApiData>>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        params: { ...(this.toParams(filters) ?? {}), page, limit: perPage },
        ...(token ? { token } : {}),
      },
    });

    const mapped = Result.try(() => this.toMapperEntityList(response));

    if (mapped.isFailure) {
      return Result.fail(mapped.errors);
    }

    return Result.try(() => mapped.instance as TPaginatedListResponse<TEntity>);
  }

  /** Busca um recurso pelo identificador. */
  public async fetchById(identifier: string, token?: string): Promise<Result<TEntity>> {
    const response = await HttpClient.get<TApiData>({
      path: `${this.pathUrl}/${identifier}`,
      baseUrl: this.baseUrl,
      config: {
        ...(token ? { token } : {}),
      },
    });

    return Result.try(() => this.toMapperEntity(response));
  }

  /** Cria e devolve o recurso convertido. */
  public async create(data: TPersist, token?: string): Promise<Result<TEntity>> {
    const response = await HttpClient.post<TApiData>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data),
        ...(token ? { token } : {}),
      },
    });

    return Result.try(() => this.toMapperEntity(response));
  }

  /** Atualiza e devolve a mensagem do backend. */
  public async update(
    identifier: string,
    data: Partial<TPersist>,
    token?: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `${this.pathUrl}/${identifier}`,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data as TPersist),
        ...(token ? { token } : {}),
      },
    });
  }

  /** Remove e devolve a mensagem do backend. */
  public async delete(
    identifier: string,
    token?: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `${this.pathUrl}/${identifier}`,
      baseUrl: this.baseUrl,
      config: {
        ...(token ? { token } : {}),
      },
    });
  }
}