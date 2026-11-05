import { Description } from '../../src';

describe('Description', () => {
  test('should create valid description with tryCreate', () => {
    const result = Description.tryCreate('Valid description');
    expect(result.isOk).toBeTruthy();
    expect(result.instance).toBeInstanceOf(Description);
  });

  test('should create valid description with create', () => {
    const description = Description.create('Valid description');
    expect(description).toBeInstanceOf(Description);
  });
})