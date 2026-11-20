export type ResponseError = {
  error: string;
  message: string;
  statusCode: number;
}

export type FastApiValidationDetail = {
  loc?: Array<string | number>;
  msg?: string;
};

export type FastApiResponseError = {
  detail: string | Array<FastApiValidationDetail>;
};

export type RequestConfig<B = unknown> = {
  body?: B;
  token?: string;
  params?: Record<string, unknown>;
  override?: Omit<RequestInit, 'body' | 'method'>;
};