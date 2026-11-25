export class HttpError extends Error {
  constructor(
    public readonly error: string,
    message: string,
    public readonly statusCode: number,
    /**
     * Corpo estruturado devolvido pelo backend junto do erro. Usado para
     * transportar o conflito discriminado do confirm de recibo até o chamador.
     */
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}