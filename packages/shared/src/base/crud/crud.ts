import { Result } from '../result';
import { HttpClient } from '../http';
import type { TPaginatedListResponse } from './paginate';

export abstract class Crud<T, C = unknown, U = unknown> extends HttpClient {
  readonly pathUrl: string;

  protected constructor(baseUrl: string, pathUrl: string, token?: string) {
    super(baseUrl, { token });
    this.pathUrl = pathUrl;
  }

  async listPaginate(
    page: number,
    filters?: Record<string, unknown>,
    perPage: number = 12
  ): Promise<Result<TPaginatedListResponse<T>>> {
    const params = { ...filters, page, per_page: perPage };
    const config = { params };
    return this.get<TPaginatedListResponse<T>>(this.pathUrl, config);
  }

  async list(filters?: Record<string, unknown>): Promise<Result<Array<T>>> {
    const config = filters ? { params: filters } : {};
    return this.get<Array<T>>(this.pathUrl, config);
  }

  async detail(identifier: string, params?: Record<string, unknown>): Promise<Result<T>> {
    const config = params ? { params } : {};
    return this.get<T>(`${this.pathUrl}/${identifier}`, config);
  }

  async create(payload: C): Promise<Result<T>> {
    const config = { body: payload };
    return this.post<T, C>(this.pathUrl, config);
  }

  async update(identifier: string, payload: U): Promise<Result<T>> {
    const config = { body: payload };
    return this.put<T, U>(`${this.pathUrl}/${identifier}`, config);
  }

  async delete<R = unknown>(identifier: string): Promise<Result<R>> {
    return this.remove<R>(`${this.pathUrl}/${identifier}`);
  }
}