import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { statementApiService } from '@/src/server/integrations/api/transactions/statement/statement.service';
import { parseStatementResourceFilterQuery } from '@/src/server/integrations/api/transactions/statement/validation';

import { statementMapper } from '@/src/features/transactions/statement';
import { requestValidationResponse } from '@/src/server/validation/request-validation';

const STATEMENT_FILTER_FIELDS = [
  'search',
  'status',
  'end_date',
  'start_date',
  'account_id',
  'direction',
  'credit_card_id',
  'subcategory_id',
  'only_credit_card',
] as const;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseStatementResourceFilterQuery(request.nextUrl.searchParams, STATEMENT_FILTER_FIELDS);
    const response = statementMapper.mapApiListResult(
      await statementApiService.fetchList(params, session.token),
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
    const message = error instanceof Error && error.message ? error.message : 'Could not load list of statement.';
    return NextResponse.json({ message }, { status: 500 });
  }
}