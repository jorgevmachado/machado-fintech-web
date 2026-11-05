import { beforeEach ,describe , afterEach, expect ,it ,jest } from '@jest/globals';

import { buildAlertId, removeAlertState } from '../../../../src/components/alert/hooks';

describe('Alert Business', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('removeAlertState', () => {
    it('should remove alert state by id', () => {
      const alerts = [
        { id: '1', title: 'Alert 1', variant: 'info', message: 'Message 1' },
        { id: '2', title: 'Alert 2', variant: 'error', message: 'Message 2' },
        { id: '3', title: 'Alert 3', variant: 'success', message: 'Message 3' },
      ];
      const result = removeAlertState(alerts, '2');
      expect(result).toEqual([
        { id: '1', title: 'Alert 1', variant: 'info', message: 'Message 1' },
        { id: '3', title: 'Alert 3', variant: 'success', message: 'Message 3' },
      ]);
    });
  });

  describe('buildAlertId', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should build an alert id with timestamp and random suffix', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1755000000000);
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

      const result = buildAlertId();

      expect(result).toMatch(/^1755000000000-[a-z0-9]{6}$/);
    });

    it('should generate different ids when random value changes', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1755000000000);

      jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.123456789)
      .mockReturnValueOnce(0.987654321);

      const firstId = buildAlertId();
      const secondId = buildAlertId();

      expect(firstId).not.toBe(secondId);
    });
  });
});