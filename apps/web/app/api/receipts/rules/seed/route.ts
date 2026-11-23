import { NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';
import { receiptRulesApiService } from '@/src/server/integrations/api/receipts/receipt-rules.service';

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await receiptRulesApiService.seed(session.token);
    if (response.isFailure) {
      return NextResponse.json(
        { message: response.error },
        { status: getApiErrorStatusCode(response) },
      );
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Could not seed receipt rules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}