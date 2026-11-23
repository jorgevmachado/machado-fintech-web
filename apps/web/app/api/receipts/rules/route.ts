import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { receiptRulesApiService } from '@/src/server/integrations/api/receipts/receipt-rules.service';
import {
  parseReceiptRulesCreateBody,
  parseReceiptRulesFilterQuery,
} from '@/src/server/integrations/api/receipts/receipt-rules.validation';
import {
  requestValidationResponse,
} from '@/src/server/validation/request-validation';
import { receiptRulesMapper } from '@/src/features/receipts/rules/mappers/receipt-rules.mapper';
import type { TReceiptRulesPersist } from '@/src/features/receipts/rules/domain';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parseReceiptRulesFilterQuery(request.nextUrl.searchParams);
    const response = receiptRulesMapper.mapApiListResult(
      await receiptRulesApiService.fetchList(params, session.token),
    );
    if (response.isFailure) {
      return NextResponse.json(
        { message: response.error },
        { status: getApiErrorStatusCode(response) },
      );
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Could not load list of receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await parseReceiptRulesCreateBody(request);
    const response = receiptRulesMapper.mapApiResult(
      await receiptRulesApiService.create(
        body as unknown as TReceiptRulesPersist,
        session.token,
      ),
    );
    if (response.isFailure) {
      return NextResponse.json(
        { message: response.error },
        { status: getApiErrorStatusCode(response) },
      );
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Could not create receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}