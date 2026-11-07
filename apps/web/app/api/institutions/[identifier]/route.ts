import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import {
  institutionApiService
} from '@/src/server/integrations/api/institution/institution.service';
import {
  parseInstitutionPersistBody
} from '@/src/server/integrations/api/institution/validation';
import {
  requestValidationResponse
} from '@/src/server/validation/request-validation';

type institutionRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function DELETE(
  _: NextRequest,
  context: institutionRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await institutionApiService.delete(session.token, identifier);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not delete institution.';
    return NextResponse.json({ message }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: institutionRouteContext
): Promise<NextResponse> {

  const session = await getServerSession();
  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseInstitutionPersistBody(request);

    const response = await institutionApiService.update(session.token, identifier, body);

    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not update institution.';
    return NextResponse.json({ message }, { status: 500 });
  }
}