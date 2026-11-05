import { Result, UseCase } from '../../../src';

// ─── Concrete subclass for testing ───────────────────────────────────────────
class TestUseCase implements UseCase<string, number> {
  async execute(input: string): Promise<Result<number>> {
    if (!input) return Result.fail('EMPTY_INPUT');

    return Result.ok(input.length);
  }
}

describe('UseCase', () => {
  test('should return Result.ok on success', async () => {
    const useCase = new TestUseCase();
    const result = await useCase.execute('hello');

    expect(result.isOk).toBeTruthy();
    expect(result.instance).toBe(5);
  });

  test('should return Result.fail on failure', async () => {
    const useCase = new TestUseCase();
    const result = await useCase.execute('');

    expect(result.isFailure).toBeTruthy();
  });
});