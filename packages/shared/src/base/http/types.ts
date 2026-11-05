export type ResponseError = {
  error: string;
  message: string;
  statusCode: number;
}

export type FastApiResponseError = {
  detail: string;
};

export type RequestConfig<B = unknown> = {
  body?: B;
  token?: string;
  params?: Record<string, unknown>;
  override?: Omit<RequestInit, 'body' | 'method'>;
};