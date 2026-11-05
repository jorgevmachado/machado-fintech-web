import { HttpClient, Result } from '@fintech/shared';

import { BeneficiaryApiService } from '../beneficiary.service';
import { CategoryApiService } from '../category.service';
import { InstitutionApiService } from '../institution.service';
import { PayerApiService } from '../payer.service';
import { PaymentApiService } from '../payment.service';
import { ReceiptApiService } from '../receipt.service';

const token = 'test-access-token';
const apiBaseUrl = 'http://127.0.0.1:8000';
const params = { page: '2' };
const resource = { name: 'Utilities' };

describe('Finance API integration services', () => {
  const get = jest.spyOn(HttpClient, 'get');
  const post = jest.spyOn(HttpClient, 'post');
  const put = jest.spyOn(HttpClient, 'put');

  beforeEach(() => {
    get.mockResolvedValue(Result.ok([]));
    post.mockResolvedValue(Result.ok({}));
    put.mockResolvedValue(Result.ok({}));
  });

  afterEach(() => jest.resetAllMocks());

  it.each([
    ['payer', new PayerApiService(), '/finance/payer'],
    ['beneficiary', new BeneficiaryApiService(), '/finance/beneficiary'],
    ['category', new CategoryApiService(), '/finance/category'],
    ['institution', new InstitutionApiService(), '/finance/institution'],
  ])('sends authenticated %s resource requests to the API', async (_, service, path) => {
    await service.fetchList(token, params);
    await service.fetchById(token, 'resource-1');
    await service.create(token, resource);
    await service.update(token, 'resource-1', resource);

    expect(get).toHaveBeenNthCalledWith(1, {
      path,
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(get).toHaveBeenNthCalledWith(2, {
      path: `${path}/resource-1`,
      baseUrl: apiBaseUrl,
      config: { token },
    });
    expect(post).toHaveBeenCalledWith({
      path,
      baseUrl: apiBaseUrl,
      config: { token, body: resource },
    });
    expect(put).toHaveBeenCalledWith({
      path: `${path}/resource-1`,
      baseUrl: apiBaseUrl,
      config: { token, body: resource },
    });
  });

  it('forwards payment list, update, summary and dashboard requests', async () => {
    const service = new PaymentApiService();
    const paymentUpdate = { amount: 42 };

    await service.fetchList(token, params);
    await service.update(token, 'payment-1', paymentUpdate);
    await service.fetchCount(token, params);
    await service.fetchTotal(token, params);
    await service.fetchMax(token, params);
    await service.fetchDashboard(token, params);

    expect(get).toHaveBeenNthCalledWith(1, {
      path: '/finance/payment',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(put).toHaveBeenCalledWith({
      path: '/finance/payment/payment-1',
      baseUrl: apiBaseUrl,
      config: { token, body: paymentUpdate },
    });
    expect(get).toHaveBeenNthCalledWith(2, {
      path: '/finance/payment/summary/count',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(get).toHaveBeenNthCalledWith(3, {
      path: '/finance/payment/summary/total',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(get).toHaveBeenNthCalledWith(4, {
      path: '/finance/payment/summary/max',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(get).toHaveBeenNthCalledWith(5, {
      path: '/finance/payment/dashboard',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
  });

  it('forwards receipt list, update, batch and confirmation requests', async () => {
    const service = new ReceiptApiService();
    const formData = new FormData();
    const confirmation = {
      id: 'receipt-1',
      category: 'category-1',
      beneficiary: 'beneficiary-1',
      paid_amount: 12,
      source_institution: 'institution-1',
    };
    const { id, ...body } = confirmation;

    await service.fetchList(token, params);
    await service.update(token, confirmation);
    await service.batch(token, formData);
    await service.confirm(token, confirmation);

    expect(get).toHaveBeenCalledWith({
      path: '/finance/receipt',
      baseUrl: apiBaseUrl,
      config: { token, params },
    });
    expect(put).toHaveBeenCalledWith({
      path: `/finance/receipt/${id}`,
      baseUrl: apiBaseUrl,
      config: { token, body },
    });
    expect(post).toHaveBeenNthCalledWith(1, {
      path: '/finance/receipt/batch',
      baseUrl: apiBaseUrl,
      config: { token, body: formData },
    });
    expect(post).toHaveBeenNthCalledWith(2, {
      path: `/finance/receipt/${id}/confirm`,
      baseUrl: apiBaseUrl,
      config: { token, body },
    });
  });
});
