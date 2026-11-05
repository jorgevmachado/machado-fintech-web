export class HttpError extends Error {
  constructor(
    public readonly error: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}