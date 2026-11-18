import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';


import { categoryApiService } from '@/src/server/integrations/api/category/category.service';

import { parseResourceFilterQuery, requestValidationResponse } from '@/src/server/validation/request-validation';
import { categoryMapper } from '@/src/features/category/mappers/category.mapper';
import {
  parseCategoryPersistBody
} from '@/src/server/integrations/api/category/validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseResourceFilterQuery(request.nextUrl.searchParams, ['name']);
    const response = categoryMapper.mapApiListResult(
      await categoryApiService.fetchList(params, session.token),
    );
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of category.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' } ,{ status: 401 });
  }

  try {
    const body = await parseCategoryPersistBody(request);
    const response = categoryMapper.mapApiResult(
      await categoryApiService.create(body, session.token),
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
      'Could not create category.';
    return NextResponse.json({ message } ,{ status: 500 });
  }
}