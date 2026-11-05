export class ResultError extends Error {
  readonly errors: Array<string>;

  constructor(error: string | Array<string>) {
    const errors = Array.isArray(error) ? error : [error];
    super(errors.join(', '));
    this.name = 'ResultError';
    this.errors = errors;
  }
}