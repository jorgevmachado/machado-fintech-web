import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { mapListResult, mapResult } from '@/src/shared/result.mapper';

import { payerApiService } from '@/src/server/integrations/api/payer/payer.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import {
  payerApiDataToJson
} from '@/src/features/payer/mappers/payer.mapper';
import {
  parsePayerPersistBody
} from '@/src/server/integrations/api/payer/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = mapListResult(
      await payerApiService.fetchList(session.token, params),
      payerApiDataToJson,
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of payers.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parsePayerPersistBody(request);
    const response = mapResult(
      await payerApiService.create(session.token, body),
      payerApiDataToJson,
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
      'Could not create payer.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}