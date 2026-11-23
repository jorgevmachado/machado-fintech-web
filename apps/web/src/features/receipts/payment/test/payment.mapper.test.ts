import { Result } from '@fintech/shared';

import { paymentMapper } from '../mappers/payment.mapper';
import type { TPaymentApiData ,TPaymentDashboardApiData } from '../domain';

const UUID = '7e57c000-0000-4000-8000-000000000001';

const payerApiData = {
  id: UUID,
  name: 'Maria Silva',
  name_code: 'maria_silva',
  created_at: '2026-11-01T00:00:00Z',
  updated_at: null,
};

const institutionApiData = {
  id: UUID,
  name: 'Itaú Unibanco',
  name_code: 'itau_unibanco',
  created_at: '2026-11-01T00:00:00Z',
  updated_at: null,
};

const receiptApiData = {
  id: UUID,
  created_at: '2026-11-01T00:00:00Z',
  updated_at: null,
};

const subcategoryApiData = {
  id: UUID,
  name: 'Supermercado',
  color: '#ff0000',
  order: 1,
  is_active: true,
  created_at: '2026-11-01T00:00:00Z',
  updated_at: null,
};

const beneficiaryApiData = {
  id: UUID,
  name: 'Enel Energia',
  name_code: 'enel_energia',
  created_at: '2026-11-01T00:00:00Z',
  updated_at: null,
};

const paymentApiData = {
  id: UUID,
  amount: '233.75',
  payment_date: '2026-11-20',
  created_at: '2026-11-20T10:00:00Z',
  updated_at: null,
  payer: payerApiData,
  receipt: receiptApiData,
  subcategory: subcategoryApiData,
  beneficiary: beneficiaryApiData,
  source_institution: institutionApiData,
  destination_institution: null,
} as unknown as TPaymentApiData;

describe('paymentMapper.toDomain', () => {
  it('parses the decimal-string amount into a number', () => {
    const payment = paymentMapper.toDomain(paymentApiData);

    expect(payment.amount).toBe(233.75);
  });

  it('parses the date-only payment_date without shifting the day', () => {
    const payment = paymentMapper.toDomain(paymentApiData);

    expect(payment.payment_date.toISOString()).toBe('2026-11-20T00:00:00.000Z');
  });

  it('keeps the nested payer, beneficiary, subcategory and institution', () => {
    const payment = paymentMapper.toDomain(paymentApiData);

    expect(payment.payer.name).toBe('Maria Silva');
    expect(payment.beneficiary.name).toBe('Enel Energia');
    expect(payment.subcategory.name).toBe('Supermercado');
    expect(payment.source_institution.name).toBe('Itaú Unibanco');
  });

  it('leaves destination_institution undefined when the API sends null', () => {
    const payment = paymentMapper.toDomain(paymentApiData);

    expect(payment.destination_institution).toBeUndefined();
  });
});

describe('paymentMapper.toJson', () => {
  it('writes payment_date back as a date-only string, not an ISO timestamp', () => {
    const json = paymentMapper.toJson(paymentMapper.toDomain(paymentApiData));

    expect(json.payment_date).toBe('2026-11-20');
  });
});

describe('paymentMapper.toDashboardDomain', () => {
  const dashboardApiData = {
    period: { start_date: '2026-06-01', end_date: '2026-11-30' },
    summary: { total: '2061.17', count: 6, average: '343.53', highest: '890.00' },
    monthly: [{ period: '2026-11', total: '1183.65', count: 3 }],
    institutions: [{ institution: 'Nu Pagamentos', total: '1017.40', count: 2 }],
    subcategories: [
      { subcategory_id: UUID, name: 'Telefone Celular', total: '1017.40', count: 2 },
    ],
    payers: [{ payer_id: UUID, name: 'Maria Silva', total: '1640.12', count: 3 }],
    beneficiaries: [
      { beneficiary_id: UUID, name: 'Enel Energia', total: '1640.12', count: 3 },
    ],
  } as unknown as TPaymentDashboardApiData;

  it('converts every decimal string into a number', () => {
    const dashboard = paymentMapper.toDashboardDomain(dashboardApiData);

    expect(dashboard.summary).toEqual({
      total: 2061.17,
      count: 6,
      average: 343.53,
      highest: 890,
    });
    expect(dashboard.monthly[0]?.total).toBe(1183.65);
    expect(dashboard.institutions[0]?.total).toBe(1017.4);
    expect(dashboard.payers[0]?.total).toBe(1640.12);
  });

  it('keeps the monthly period as a YYYY-MM label instead of a Date', () => {
    const dashboard = paymentMapper.toDashboardDomain(dashboardApiData);

    expect(dashboard.monthly[0]?.period).toBe('2026-11');
  });

  it('parses the period bounds as date-only values', () => {
    const dashboard = paymentMapper.toDashboardDomain(dashboardApiData);

    expect(dashboard.period.start_date?.toISOString()).toBe('2026-06-01T00:00:00.000Z');
    expect(dashboard.period.end_date?.toISOString()).toBe('2026-11-30T00:00:00.000Z');
  });
});

describe('paymentMapper.mapDashboardResult', () => {
  it('maps a successful result into the dashboard domain', () => {
    const result = Result.ok({
      period: { start_date: '2026-06-01', end_date: '2026-11-30' },
      summary: { total: '10.00', count: 1, average: '10.00', highest: '10.00' },
      monthly: [],
      institutions: [],
      subcategories: [],
      payers: [],
      beneficiaries: [],
    } as unknown as TPaymentDashboardApiData);

    const mapped = paymentMapper.mapDashboardResult(result);

    expect(mapped.isOk).toBe(true);
    expect(mapped.instance.summary.total).toBe(10);
  });

  it('propagates a failed result without touching the payload', () => {
    const result = Result.fail<TPaymentDashboardApiData>('boom');

    const mapped = paymentMapper.mapDashboardResult(result);

    expect(mapped.isFailure).toBe(true);
    expect(mapped.error).toBe('boom');
  });
});