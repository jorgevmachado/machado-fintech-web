import { Result } from '../result';
import { Http ,type HttpConfig ,RequestParams } from './http';
import { RequestConfig } from './types';

type HttpClientRequest<C> = {
  path: string;
  config?: C;
  baseUrl?: string;
}

export class HttpClient extends Http {
  public static DEFAULT_API_BASE_URL: string = 'http://127.0.0.1:8000';

  constructor(
    url: string = HttpClient.DEFAULT_API_BASE_URL,
    config?: HttpConfig,
  ) {
    super(url, config);
  }

  public get<T>(path: string, config?: Omit<RequestConfig, 'body'>): Promise<Result<T>> {
    return HttpClient.execute<T>({
      path,
      method: 'GET',
      baseUrl: this.url,
      httpConfig: this.config,
      requestConfig: config,
    });
  }

  public remove<T>(path: string, config?: Omit<RequestConfig, 'body'>): Promise<Result<T>> {
    return HttpClient.execute<T>({
      path,
      method: 'DELETE',
      baseUrl: this.url,
      httpConfig: this.config,
      requestConfig: config
    });
  }

  public post<T = unknown, B = unknown>(path: string, config?: RequestConfig<B>): Promise<Result<T>> {
    return HttpClient.execute<T, B>({
      path,
      method: 'POST',
      baseUrl: this.url,
      httpConfig: this.config,
      requestConfig: config
    });
  }

  public put<T = unknown, B = unknown>(path: string, config?: RequestConfig<B>): Promise<Result<T>> {
    return HttpClient.execute<T, B>({
      path,
      method: 'PUT',
      baseUrl: this.url,
      httpConfig: this.config,
      requestConfig: config
    });
  }

  public patch<T = unknown, B = unknown>(path: string, config?: RequestConfig<B>): Promise<Result<T>> {
    return HttpClient.execute<T, B>({
      path,
      method: 'PATCH',
      baseUrl: this.url,
      httpConfig: this.config,
      requestConfig: config
    });
  }

  public static get<T = unknown>({
    path,
    config,
    baseUrl = HttpClient.DEFAULT_API_BASE_URL,
  }: HttpClientRequest<Omit<RequestConfig, 'body'>>): Promise<Result<T>> {
    return HttpClient.execute<T>({
      path,
      method: 'GET',
      baseUrl,
      requestConfig: config,
    });
  }

  public static remove<T = unknown>({
    path,
    config,
    baseUrl = HttpClient.DEFAULT_API_BASE_URL,
  }: HttpClientRequest<Omit<RequestConfig, 'body'>>): Promise<Result<T>> {
    return Result.tryAsync(() => HttpClient.request<T>({
      path,
      method: 'DELETE',
      baseUrl,
      requestConfig: config,
    }));
  }

  public static post<T = unknown, B = unknown>({
    path,
    config,
    baseUrl = HttpClient.DEFAULT_API_BASE_URL,
  }: HttpClientRequest<RequestConfig<B>>): Promise<Result<T>> {
    return Result.tryAsync(() => HttpClient.request<T>({
      path,
      method: 'POST',
      baseUrl,
      requestConfig: config,
    }));
  }

  public static put<T = unknown, B = unknown>({
    path,
    config,
    baseUrl = HttpClient.DEFAULT_API_BASE_URL,
  }: HttpClientRequest<RequestConfig<B>>): Promise<Result<T>> {
    return Result.tryAsync(() => HttpClient.request<T>({
      path,
      method: 'PUT',
      baseUrl,
      requestConfig: config,
    }));
  }

  public static patch<T = unknown, B = unknown>({
    path,
    config,
    baseUrl = HttpClient.DEFAULT_API_BASE_URL,
  }: HttpClientRequest<RequestConfig<B>>): Promise<Result<T>> {
    return Result.tryAsync(() => HttpClient.request<T>({
      path,
      method: 'PATCH',
      baseUrl,
      requestConfig: config,
    }));
  }

  private static execute<T, B = unknown>(params: RequestParams<B>): Promise<Result<T>> {
    return Result.tryAsync(() => HttpClient.request<T, B>(params));
  }
}