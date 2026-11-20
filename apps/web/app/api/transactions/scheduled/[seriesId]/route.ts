import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { scheduledTransactionApiService } from '@/src/server/integrations/api/transactions/scheduled-transaction/scheduled-transaction.service';
import { parseScheduledTransactionPersistBody } from '@/src/server/integrations/api/transactions/scheduled-transaction/validation';
import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';

import { scheduledTransactionMapper } from '@/src/features/transactions/scheduled-transaction';

type ScheduledTransactionRouteContext = {
  params: Promise<{ seriesId: string }>;
};

export async function GET(
  request: NextRequest,
  context: ScheduledTransactionRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId } = await context.params;
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = scheduledTransactionMapper.mapApiListResult(
      await scheduledTransactionApiService.fetchListBySeries(seriesId, params, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of occurrences.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/** Stores a projected occurrence: the series plus `occurrence_index` tell which one it is. */
export async function POST(
  request: NextRequest,
  context: ScheduledTransactionRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId } = await context.params;
    const body = await parseScheduledTransactionPersistBody(request);
    const response = scheduledTransactionMapper.mapApiResult(
      await scheduledTransactionApiService.createOccurrence(seriesId, body, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not store the occurrence.';
    return NextResponse.json({ message }, { status: 500 });
  }
}