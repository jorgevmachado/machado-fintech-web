export type ResponseError = {
  error: string;
  message: string;
  statusCode: number;
  /**
   * Corpo estruturado que o backend devolveu junto do erro (ex.: o conflito de
   * ocorrência no confirm de recibo). Sem ele, o discriminante `type` do 409 se
   * perdia e o chamador não conseguia distinguir conflito de erro genérico.
   */
  details?: unknown;
}

/** `detail` que o FastAPI devolve como objeto de negócio, não como texto nem lista de validação. */
export type FastApiObjectDetail = Record<string, unknown>;

export type FastApiValidationDetail = {
  loc?: Array<string | number>;
  msg?: string;
};

export type FastApiResponseError = {
  detail: string | Array<FastApiValidationDetail> | FastApiObjectDetail;
};

export type RequestConfig<B = unknown> = {
  body?: B;
  token?: string;
  params?: Record<string, unknown>;
  override?: Omit<RequestInit, 'body' | 'method'>;
};