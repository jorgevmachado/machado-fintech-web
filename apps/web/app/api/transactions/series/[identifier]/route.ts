import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { transactionSeriesApiService } from '@/src/server/integrations/api/transactions/transaction-series/transaction-series.service';
import { parseTransactionSeriesPersistBody } from '@/src/server/integrations/api/transactions/transaction-series/validation';
import { requestValidationResponse } from '@/src/server/validation/request-validation';

import { transactionSeriesMapper } from '@/src/features/transactions/transaction-series';

type TransactionSeriesRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function GET(
  _: NextRequest,
  context: TransactionSeriesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = transactionSeriesMapper.mapApiResult(
      await transactionSeriesApiService.fetchById(identifier, session.token),
    );
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not load series.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: TransactionSeriesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseTransactionSeriesPersistBody(request);

    const response = await transactionSeriesApiService.update(identifier, body, session.token);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update series.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  context: TransactionSeriesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await transactionSeriesApiService.delete(identifier, session.token);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete series.';
    return NextResponse.json({ message }, { status: 500 });
  }
}