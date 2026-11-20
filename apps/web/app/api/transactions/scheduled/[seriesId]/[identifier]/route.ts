import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { scheduledTransactionApiService } from '@/src/server/integrations/api/transactions/scheduled-transaction/scheduled-transaction.service';
import { parseScheduledTransactionPersistBody } from '@/src/server/integrations/api/transactions/scheduled-transaction/validation';
import { requestValidationResponse } from '@/src/server/validation/request-validation';

import { scheduledTransactionMapper } from '@/src/features/transactions/scheduled-transaction';

type ScheduledOccurrenceRouteContext = {
  params: Promise<{ seriesId: string; identifier: string }>;
};

export async function GET(
  _: NextRequest,
  context: ScheduledOccurrenceRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId, identifier } = await context.params;
    const response = scheduledTransactionMapper.mapApiResult(
      await scheduledTransactionApiService.fetchOccurrence(seriesId, identifier, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not load the occurrence.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: ScheduledOccurrenceRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId, identifier } = await context.params;
    const body = await parseScheduledTransactionPersistBody(request);

    const response = await scheduledTransactionApiService.updateOccurrence(
      seriesId,
      identifier,
      body,
      session.token,
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
    const message = error instanceof Error && error.message ? error.message : 'Could not update the occurrence.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/** Discards the stored occurrence, so it follows the series again. */
export async function DELETE(
  _: NextRequest,
  context: ScheduledOccurrenceRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId, identifier } = await context.params;
    const response = await scheduledTransactionApiService.deleteOccurrence(
      seriesId,
      identifier,
      session.token,
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
    const message = error instanceof Error && error.message ? error.message : 'Could not revert the occurrence.';
    return NextResponse.json({ message }, { status: 500 });
  }
}