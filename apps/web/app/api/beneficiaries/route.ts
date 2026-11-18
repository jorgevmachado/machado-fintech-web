import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { beneficiaryApiService } from '@/src/server/integrations/api/beneficiary/beneficiary.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import { beneficiaryMapper } from '@/src/features/beneficiary/mappers/beneficiary.mapper';
import {
  parseBeneficiaryPersistBody
} from '@/src/server/integrations/api/beneficiary/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = beneficiaryMapper.mapApiListResult(
      await beneficiaryApiService.fetchList(params, session.token),
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of beneficiary.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parseBeneficiaryPersistBody(request);
    const response = beneficiaryMapper.mapApiResult(
      await beneficiaryApiService.create(body, session.token),
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
      'Could not create beneficiary.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}