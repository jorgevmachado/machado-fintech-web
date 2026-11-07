import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  beneficiaryApiService
} from '@/src/server/integrations/api/beneficiary/beneficiary.service';
import {
  parseBeneficiaryPersistBody
} from '@/src/server/integrations/api/beneficiary/validation';
import {
  requestValidationResponse
} from '@/src/server/validation/request-validation';

type BeneficiaryRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function DELETE(
  _: NextRequest,
  context: BeneficiaryRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await beneficiaryApiService.delete(session.token, identifier);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete Beneficiary.';
    return NextResponse.json({ message }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: BeneficiaryRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseBeneficiaryPersistBody(request);

    const response = await beneficiaryApiService.update(session.token, identifier, body);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update Beneficiary.';
    return NextResponse.json({ message }, { status: 500 });
  }
}