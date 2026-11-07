import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  payerApiService
} from '@/src/server/integrations/api/payer/payer.service';
import {
  parsePayerPersistBody
} from '@/src/server/integrations/api/payer/validation';
import {
  requestValidationResponse
} from '@/src/server/validation/request-validation';

type PayerRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function DELETE(
  _: NextRequest,
  context: PayerRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await payerApiService.delete(session.token, identifier);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete Payer.';
    return NextResponse.json({ message }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: PayerRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parsePayerPersistBody(request);

    const response = await payerApiService.update(session.token, identifier, body);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update Payer.';
    return NextResponse.json({ message }, { status: 500 });
  }
}