import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  transactionApiService
} from '@/src/server/integrations/api/transactions/transaction/transaction.service';
import {
  parseTransactionPersistBody
} from '@/src/server/integrations/api/transactions/transaction/validation';
import {
  requestValidationResponse
} from '@/src/server/validation/request-validation';

type TransactionRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function DELETE(
  _: NextRequest,
  context: TransactionRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await transactionApiService.delete(identifier, session.token);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete Transaction.';
    return NextResponse.json({ message }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: TransactionRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseTransactionPersistBody(request, { preserveEmpty: true });

    const response = await transactionApiService.update(identifier, body, session.token);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update Transaction.';
    return NextResponse.json({ message }, { status: 500 });
  }
}