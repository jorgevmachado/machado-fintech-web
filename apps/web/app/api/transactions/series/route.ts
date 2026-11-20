import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { transactionSeriesApiService } from '@/src/server/integrations/api/transactions/transaction-series/transaction-series.service';
import {
  parseTransactionSeriesFilterQuery ,
  parseTransactionSeriesPersistBody,
} from '@/src/server/integrations/api/transactions/transaction-series/validation';
import { requestValidationResponse } from '@/src/server/validation/request-validation';

import { transactionSeriesMapper } from '@/src/features/transactions/transaction-series';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseTransactionSeriesFilterQuery(request.nextUrl.searchParams);
    const response = transactionSeriesMapper.mapApiListResult(
      await transactionSeriesApiService.fetchList(params, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of series.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await parseTransactionSeriesPersistBody(request);
    const response = transactionSeriesMapper.mapApiResult(
      await transactionSeriesApiService.create(body, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not create series.';
    return NextResponse.json({ message }, { status: 500 });
  }
}