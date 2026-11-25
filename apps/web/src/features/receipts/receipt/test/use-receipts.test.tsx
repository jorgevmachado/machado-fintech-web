import { act, renderHook } from '@testing-library/react';

import { Result } from '@fintech/shared';
import { useAlert, useLoading } from '@fintech/ui';

import useReceipts from '../hooks/use-receipts';
import { receiptService } from '../services';
import type { TReceiptConfirm } from '../domain';

jest.mock('@fintech/ui', () => ({
  useLoading: jest.fn(),
  useAlert: jest.fn(),
}));

jest.mock('../services', () => ({
  receiptService: {
    confirm: jest.fn(),
    fetchList: jest.fn(),
  },
}));

const confirmPayload: TReceiptConfirm = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: 'Usuario Teste',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: new Date('2026-11-02T00:00:00.000Z'),
  source_institution: 'Nubank',
  name: 'Claro Net',
  account_id: '3b3f1c1e-1111-4222-8333-444455556666',
};

const conflict = {
  type: 'OCCURRENCE_EXISTS',
  existing: { id: 'abc', settled_on: '2026-10-26', value: '55.90' },
  occurrence: { occurrence_index: 3 },
};

describe('useReceipts confirm', () => {
  const executeServiceAlert = jest.fn();
  const execute = jest.fn();

  beforeEach(() => {
    // `resetAllMocks` limpa a implementação, então o passthrough é redefinido a cada teste.
    execute.mockImplementation(async (callback: () => Promise<unknown>) => callback());
    jest.mocked(useLoading).mockReturnValue({ execute, isLoading: false } as never);
    jest.mocked(useAlert).mockReturnValue({ executeServiceAlert } as never);
    jest.mocked(receiptService.fetchList).mockResolvedValue(Result.ok([]));
  });

  afterEach(() => jest.resetAllMocks());

  it('reports the created entry when the confirmation succeeds', async () => {
    const result = { payment: { id: 'pay-1' }, transaction: { id: 'tx-1' } };
    jest.mocked(receiptService.confirm).mockResolvedValue(Result.ok(result as never));

    const { result: hook } = renderHook(() => useReceipts());
    const outcome = await act(() => hook.current.confirm(confirmPayload));

    expect(outcome).toEqual({ status: 'confirmed', result });
    expect(executeServiceAlert).toHaveBeenCalledWith(
      expect.objectContaining({ isOk: true, type: 'confirm' }),
    );
  });

  it('returns the conflict instead of treating it as a generic error', async () => {
    jest.mocked(receiptService.confirm).mockResolvedValue(
      Result.fail([{
        error: 'FastApiError',
        message: 'The occurrence already has an entry',
        statusCode: 409,
        details: conflict,
      } as unknown as string]),
    );

    const { result: hook } = renderHook(() => useReceipts());
    const outcome = await act(() => hook.current.confirm(confirmPayload));

    expect(outcome).toEqual({ status: 'conflict', conflict });
    expect(executeServiceAlert).not.toHaveBeenCalled();
  });

  it('alerts and reports a failure for a 409 without a conflict body', async () => {
    jest.mocked(receiptService.confirm).mockResolvedValue(
      Result.fail([{
        error: 'FastApiError',
        message: 'Receipt is not ready for confirmation',
        statusCode: 409,
      } as unknown as string]),
    );

    const { result: hook } = renderHook(() => useReceipts());
    const outcome = await act(() => hook.current.confirm(confirmPayload));

    expect(outcome).toEqual({ status: 'failed' });
    expect(executeServiceAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        isOk: false,
        message: 'Receipt is not ready for confirmation',
      }),
    );
  });

  it('alerts and reports a failure for any other rejection', async () => {
    jest.mocked(receiptService.confirm).mockResolvedValue(
      Result.fail([{
        error: 'FastApiError',
        message: 'subcategory_id: invalid',
        statusCode: 422,
      } as unknown as string]),
    );

    const { result: hook } = renderHook(() => useReceipts());
    const outcome = await act(() => hook.current.confirm(confirmPayload));

    expect(outcome).toEqual({ status: 'failed' });
    expect(executeServiceAlert).toHaveBeenCalledTimes(1);
  });

  it('does not refresh the list when the confirmation is refused', async () => {
    jest.mocked(receiptService.confirm).mockResolvedValue(
      Result.fail([{
        error: 'FastApiError',
        message: 'nope',
        statusCode: 422,
      } as unknown as string]),
    );

    const { result: hook } = renderHook(() => useReceipts());
    await act(() => hook.current.confirm(confirmPayload));

    expect(receiptService.fetchList).not.toHaveBeenCalled();
  });
});