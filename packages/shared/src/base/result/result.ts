import { ResultValidator } from './result-validator';

declare global {
  interface String {
    readonly code: string;
    readonly value: string;
    equals(other: string | { value: string }): boolean;
  }
}

export class Result<T> {
  constructor(
    private readonly _instance?: T | null,
    private _errors?: Array<string>,
  ) {}

  static ok<T>(instance?: T): Result<T> {
    return new Result<T>(instance ?? null);
  }

  static fail<T>(event: string | Array<string>): Result<T> {
    const error = typeof event === 'string' ? [event] : event;
    return new Result<T>(undefined, Array.isArray(error) ? error : [error]);
  }

  static empty<T>(): Result<T> {
    return new Result<T>(null);
  }

  static async tryAsync<T>(fn: () => Promise<Result<T>>): Promise<Result<T>>;
  static async tryAsync<T>(fn: () => Promise<T>): Promise<Result<T>>;
  static async tryAsync(fn: () => Promise<void>): Promise<Result<void>>;
  static async tryAsync<T>(fn: () => Promise<Result<T> | T | void>): Promise<Result<T | void>> {
    try {
      const result = await fn();
      if (result instanceof Result) {
        return result;
      }

      return Result.ok(result);
    } catch (e: any) {
      const error = e instanceof Error ? e.message : e;
      return Result.fail<T | void>(error);
    }
  }

  static try<T>(fn: () => Result<T>): Result<T>;
  static try<T>(fn: () => T): Result<T>;
  static try<T>(fn: () => Result<T> | T): Result<T> {
    try {
      const result = fn();
      if(result instanceof Result) {
        return result;
      }
      return Result.ok<T>(result);
    }catch (e: any) {
      const error = e instanceof Error ? e.message : e;
      return Result.fail<T>(error);
    }
  }

  get instance(): T {
    return this._instance!;
  }

  get errors(): Array<string> {
    const noErrors = !this._errors || this._errors.length === 0;
    if(noErrors && this._instance === undefined) {
      return ['RESULT_UNDEFINED'];
    }
    return this._errors as Array<string>;
  }

  get isOk(): boolean {
    return !this._errors || this._errors.length === 0;
  }

  get isFailure(): boolean {
    return !this.isOk;
  }

  get error(): string {
    return this._errors?.[0] ?? '';
  }

  get validator(): ResultValidator<T, Result<T>> {
    return new ResultValidator<T, Result<T>>(this);
  }

  toString(): string {
    if (this.isOk) {
      return `Result.ok(${JSON.stringify(this._instance)})`;
    } else {
      return `Result.fail(${JSON.stringify(this._errors)})`;
    }
  }
}