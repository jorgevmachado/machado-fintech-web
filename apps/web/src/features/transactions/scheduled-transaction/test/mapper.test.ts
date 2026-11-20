import { scheduledTransactionMapper } from '../mappers/scheduled-transaction.mapper';
import type { TScheduledTransactionApiData } from '../domain';

const seriesApiData = {
  id: 'series-1',
  name: 'Aluguel',
  value: '1850.00',
  direction: 'OUT',
  kind: 'OPEN',
  frequency_unit: 'MONTH',
  frequency_interval: 1,
  start_date: '2026-01-10',
  created_at: '2026-01-01T00:00:00.000Z',
  account: { id: 'account-1', name: 'Nubank' },
};

function buildApiData(overrides: Partial<TScheduledTransactionApiData> = {}): TScheduledTransactionApiData {
  return {
    id: 'occurrence-1',
    name: 'Aluguel',
    value: '1850.00',
    status: 'PENDING',
    direction: 'OUT',
    account: { id: 'account-1', name: 'Nubank' },
    expected_on: '2026-11-10',
    occurrence_on: '2026-11-10',
    occurrence_index: 1,
    created_at: '2026-11-01T00:00:00.000Z',
    transaction_serie: seriesApiData,
    ...overrides,
  } as TScheduledTransactionApiData;
}

describe('scheduledTransactionMapper', () => {
  describe('toDomain', () => {
    it('should parse a date-only expected_on instead of rejecting it', () => {
      // O backend manda `YYYY-MM-DD`; o parser padrão exige hora e devolveria
      // undefined, o que derrubava toda leitura de ocorrência com 422.
      const occurrence = scheduledTransactionMapper.toDomain(buildApiData());

      expect(occurrence.expected_on).toEqual(new Date('2026-11-10T00:00:00.000Z'));
      expect(occurrence.occurrence_on).toEqual(new Date('2026-11-10T00:00:00.000Z'));
    });

    it('should parse a date-only settled_on', () => {
      const occurrence = scheduledTransactionMapper.toDomain(
        buildApiData({ settled_on: '2026-11-12' }),
      );

      expect(occurrence.settled_on).toEqual(new Date('2026-11-12T00:00:00.000Z'));
    });

    it('should leave settled_on undefined when the occurrence is pending', () => {
      const occurrence = scheduledTransactionMapper.toDomain(buildApiData());

      expect(occurrence.settled_on).toBeUndefined();
    });

    it('should convert the decimal value sent as a string into a number', () => {
      const occurrence = scheduledTransactionMapper.toDomain(buildApiData({ value: '1850.00' }));

      expect(occurrence.value).toBe(1850);
    });
  });

  describe('toJson', () => {
    it('should serialise date-only fields as YYYY-MM-DD', () => {
      const occurrence = scheduledTransactionMapper.toDomain(buildApiData());
      const json = scheduledTransactionMapper.toJson(occurrence);

      expect(json.expected_on).toBe('2026-11-10');
      expect(json.occurrence_on).toBe('2026-11-10');
    });

    it('should keep the settled date as YYYY-MM-DD when settling', () => {
      const occurrence = scheduledTransactionMapper.toDomain(
        buildApiData({ settled_on: '2026-11-12' }),
      );

      expect(scheduledTransactionMapper.toJson(occurrence).settled_on).toBe('2026-11-12');
    });

    it('should keep the created_at timestamp with its time', () => {
      const occurrence = scheduledTransactionMapper.toDomain(buildApiData());

      expect(scheduledTransactionMapper.toJson(occurrence).created_at)
        .toBe('2026-11-01T00:00:00.000Z');
    });
  });

  describe('round trip through the BFF', () => {
    it('should survive toDomain followed by toJson without changing the dates', () => {
      // O BFF devolve `toJson(toDomain(apiData))`: se as duas pontas discordarem
      // do formato, o cliente recebe uma data que o backend recusa.
      const json = scheduledTransactionMapper.toJson(
        scheduledTransactionMapper.toDomain(buildApiData()),
      );

      expect(json.expected_on).toBe('2026-11-10');
      expect(json.occurrence_on).toBe('2026-11-10');
    });
  });
});