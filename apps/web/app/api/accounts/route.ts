import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';

import { accountApiService } from '@/src/server/integrations/api/account/account.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import {
  accountApiDataToJson
} from '@/src/features/account/mappers/account.mapper';
import {
  parseAccountPersistBody
} from '@/src/server/integrations/api/account/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = mapListResult(
      await accountApiService.fetchList(session.token, params),
      accountApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of account.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parseAccountPersistBody(request);
    const response = mapResult(
      await accountApiService.create(session.token, body),
      accountApiDataToJson,
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
      'Could not create account.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}