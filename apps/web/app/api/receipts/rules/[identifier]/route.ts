import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { receiptRulesApiService } from '@/src/server/integrations/api/receipts/receipt-rules.service';
import { parseReceiptRulesUpdateBody } from '@/src/server/integrations/api/receipts/receipt-rules.validation';
import { requestValidationResponse } from '@/src/server/validation/request-validation';
import { receiptRulesMapper } from '@/src/features/receipts/rules/mappers/receipt-rules.mapper';
import type { TReceiptRulesPersist } from '@/src/features/receipts/rules/domain';

type ReceiptRulesRouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function GET(
  _: NextRequest,
  context: ReceiptRulesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = receiptRulesMapper.mapApiResult(
      await receiptRulesApiService.fetchById(identifier, session.token),
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
        : 'Could not load receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: ReceiptRulesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const body = await parseReceiptRulesUpdateBody(request);
    const response = await receiptRulesApiService.update(
      identifier,
      body as Partial<TReceiptRulesPersist>,
      session.token,
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
        : 'Could not update receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  context: ReceiptRulesRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { identifier } = await context.params;
    const response = await receiptRulesApiService.delete(identifier, session.token);
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
        : 'Could not delete receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}