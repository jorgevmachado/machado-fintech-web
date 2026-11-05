export type HttpUrlConfig = {
  path?: string;
  params?: Record<string, unknown>;
}

export class HttpUrl {
  private static readonly INVALID_HTTP_URL = 'INVALID_HTTP_URL';
  private readonly _url: string;
  constructor(
    readonly value?: string,
    readonly config?: HttpUrlConfig,
  ) {
    const normalized = value?.trim();
    if(!normalized || !HttpUrl.isValid(normalized)) {
      throw new Error(HttpUrl.INVALID_HTTP_URL);
    }
    const { path, params } = config ?? {};
    this._url = !path ? normalized : HttpUrl.format(normalized, path, params);
  }

  get url(): string {
    return this._url;
  }

  get domain(): string {
    return new globalThis.URL(this._url).hostname;
  }

  get protocol(): string {
    return new globalThis.URL(this._url).protocol;
  }

  get pathname(): string {
    return new globalThis.URL(this._url).pathname;
  }

  get parameters(): Record<string, string> {
    const params = new globalThis.URL(this._url).searchParams;
    return Object.fromEntries(params.entries());
  }

  public static queryString(data: Record<string, unknown>, page?: number, limit?: number): string {
    const params = new URLSearchParams(page ? {
      page: String(page),
      limit: String(limit),
    } : {});

    Object.entries(data as Record<string, string | undefined>).forEach(([key, value]) => {
      if (!value) {
        return;
      }
      params.set(key, value);
    });

    return params.toString();
  }

  public static isValid(value: string): boolean {
    try {
      const parsed = new globalThis.URL(value);
      return /^https?:$/.test(parsed.protocol);
    } catch {
      return false;
    }
  }

  private static serialize(value?: Record<string, unknown>): string | undefined {
    if (!value || Object.keys(value).length === 0) {
      return undefined;
    }

    return HttpUrl.queryString(value);
  }

  public static format(value: string, path: string, params?: Record<string, unknown>): string {
    const urlPath = path.startsWith('/') ? path.substring(1) : path;
    const url = value.trim().endsWith('/') ? value.trim().slice(0, -1) : value.trim();
    const query = HttpUrl.serialize(params);
    const filteredUrl = [url, urlPath].filter(Boolean).join('/');

    return query ? `${filteredUrl}?${query}` : filteredUrl;
  }
}