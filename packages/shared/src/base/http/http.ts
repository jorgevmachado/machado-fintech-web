import {
  FastApiResponseError,
  FastApiValidationDetail,
  RequestConfig ,
  ResponseError ,
} from './types';
import { HttpError } from './http-error';
import { HttpUrl } from './http-url';

export const HTTP_UNAUTHORIZED_EVENT = 'machado:http-unauthorized';

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export type HttpConfig = RequestInit & {
  token?: string;
};

export type RequestParams<B> = {
  path: string;
  method: HttpMethod;
  baseUrl: string;
  httpConfig?: HttpConfig;
  requestConfig?: RequestConfig<B>;
}

export abstract class Http {
  private readonly _url: string;
  private readonly _config: RequestInit;

  private static readonly HEADER_APPLICATION_JSON: string = 'application/json; charset=UTF-8';

  protected constructor(url: string, config?: HttpConfig) {
    this._url = url;
    this._config = Http.convertToRequestInit(config);
  }

  get url(): string {
    return this._url;
  }

  get config(): Readonly<RequestInit> {
    return this._config;
  }

  public static convertToRequestInit(config: HttpConfig = {}): RequestInit {
    const { token, ...requestConfig } = config;

    return {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    };
  }

  public static request<T, B = unknown>({
    path,
    method,
    baseUrl,
    httpConfig = {},
    requestConfig = {}
  }: RequestParams<B>): Promise<T> {
    const { body, token, params = {}, override = {} } = requestConfig;

    const url = HttpUrl.format(baseUrl, path, params );

    const config: HttpConfig = token ? { ...httpConfig, token } : httpConfig;

    return Http.send<T>(
      url,
      config,
      {
        ...override,
        body: Http.serializeBody(body),
        method
      });
  }

  private static async send<T>(url: string, config: HttpConfig, requestInit: RequestInit): Promise<T> {
    const headers = Http.buildHeaders(config, requestInit);

    Http.configureContentType(headers, requestInit.body);

    const { body, ...requestConfig } = requestInit;

    const request: RequestInit = {
      ...config,
      ...requestConfig,
      ...(body !== undefined && { body }),
      headers,
    };

    return fetch(url, request)
    .then((response) => Http.handle<T>(response))
    .catch((error: unknown) => {
      throw Http.errorMessage(error);
    });
  }

  private static buildHeaders(httpConfig: HttpConfig, requestConfig: RequestInit): Headers {
    const config = Http.convertToRequestInit(httpConfig);
    const headers = new Headers(config.headers);

    if(requestConfig.headers) {
      new Headers(requestConfig.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  private static async handle<T>(response: Response): Promise<T> {
    const data: unknown = await Http.parseResponse(response);

    if(!response.ok) {
      Http.notifyUnauthorized(response);
      if(Http.isResponseError(data)) {
        throw new HttpError(
          data.error,
          data.message,
          data.statusCode
        )
      }

      if(Http.isFastApiErrorResponse(data)) {
        throw new HttpError(
          'FastApiError',
          Http.fastApiErrorMessage(data.detail),
          response.status
        )
      }

      // As rotas BFF devolvem `{ message: { error, message, statusCode } }` quando a
      // API externa falha. Sem desaninhar, a mensagem real do backend se perdia.
      if(Http.isNestedResponseError(data)) {
        throw new HttpError(
          data.message.error,
          data.message.message,
          data.message.statusCode
        )
      }

      throw new HttpError(
        'HttpError',
        'An unexpected error occurred.',
        response.status,
      );
    }

    return data as T;
  }

  private static notifyUnauthorized(response: Response): void {
    if (response.status !== 401 || typeof window === 'undefined') {
      return;
    }

    try {
      const responseUrl = new URL(response.url);
      if (
        responseUrl.origin === window.location.origin &&
        responseUrl.pathname.startsWith('/api/')
      ) {
        window.dispatchEvent(new Event(HTTP_UNAUTHORIZED_EVENT));
      }
    } catch {
      return;
    }
  }

  private static async parseResponse(response: Response): Promise<unknown> {
    const text = await response.text();

    if(!text.trim()) {
      return undefined;
    }

    return JSON.parse(text);
  }

  private static isResponseError(value: unknown): value is ResponseError {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const error = value as Partial<ResponseError>;

    return (
      typeof error.error === 'string' &&
      typeof error.message === 'string' &&
      typeof error.statusCode === 'number'
    );
  }

  private static isNestedResponseError(
    value: unknown,
  ): value is { message: ResponseError } {
    if (!value || typeof value !== 'object' || !('message' in value)) {
      return false;
    }

    return Http.isResponseError((value as { message: unknown }).message);
  }

  private static isFastApiErrorResponse(value: unknown): value is FastApiResponseError  {
    if (typeof value !== 'object' || value === null || !('detail' in value)) {
      return false;
    }

    const { detail } = value as { detail: unknown };

    return typeof detail === 'string' || Http.isValidationDetailList(detail);
  }

  /** O 422 do FastAPI traz `detail` como lista de erros de validação, não como string. */
  private static isValidationDetailList(value: unknown): value is Array<FastApiValidationDetail> {
    return Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === 'object' && item !== null);
  }

  /**
   * O FastAPI devolve `detail` como string nas regras de negócio, mas como lista de
   * erros de validação (422) quando o payload não bate com o schema. Sem isso, o erro
   * de validação virava "An unexpected error occurred." e a causa real se perdia.
   */
  private static fastApiErrorMessage(detail: FastApiResponseError['detail']): string {
    if (typeof detail === 'string') {
      return detail;
    }

    const messages = detail
      .map((item) => Http.formatValidationDetail(item))
      .filter((message) => message !== '');

    return messages.length > 0 ? messages.join('; ') : 'An unexpected error occurred.';
  }

  private static formatValidationDetail(item: FastApiValidationDetail): string {
    const message = typeof item.msg === 'string' ? item.msg.trim() : '';
    if (!message) {
      return '';
    }

    const field = Array.isArray(item.loc)
      ? item.loc.filter((part) => part !== 'body').join('.')
      : '';

    return field ? `${field}: ${message}` : message;
  }

  private static serializeBody(body?: unknown): BodyInit | undefined {
    if (body === undefined || body === null) {
      return undefined;
    }

    if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
      return body;
    }

    return JSON.stringify(body);
  }

  private static configureContentType(headers: Headers, body?: BodyInit | null): void {
    if (body === undefined || body === null) {
      return;
    }

    if(body instanceof FormData) {
      headers.delete('content-type');
      return;
    }

    if(headers.has('content-type')) {
      return;
    }

    if(body instanceof Blob) {
      if (body.type) {
        headers.set('content-type', body.type);
        return;
      }
    }

    headers.set('content-type', Http.HEADER_APPLICATION_JSON);
  }

  private static readonly errorMessage = (error: unknown): ResponseError => {
    if (error instanceof HttpError) {
      return {
        error: error.error,
        message: error.message,
        statusCode: error.statusCode,
      };
    }

    if (error instanceof Error) {
      return {
        error: error.name,
        message: error.message,
        statusCode: 500,
      };
    }

    return {
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      statusCode: 500,
    };
  }
}