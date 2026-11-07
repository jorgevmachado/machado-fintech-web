import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';

import { institutionApiService } from '@/src/server/integrations/api/institution/institution.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import {
  institutionApiDataToJson
} from '@/src/features/institution/mappers/institution.mapper';
import {
  parseInstitutionPersistBody
} from '@/src/server/integrations/api/institution/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = mapListResult(
      await institutionApiService.fetchList(session.token, params),
      institutionApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of institution.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parseInstitutionPersistBody(request);
    const response = mapResult(
      await institutionApiService.create(session.token, body),
      institutionApiDataToJson,
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
    const message = error instanceof Error && error.message ?
      error.message :
      'Could not create institution.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}