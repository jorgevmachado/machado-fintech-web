import { NextRequest ,NextResponse } from 'next/server';

import { getServerSession } from '@/src/server/auth';
import { getApiErrorStatusCode } from '@/src/server/auth/api-response';

import { paymentApiService } from '@/src/server/integrations/api/payments/payment.service';

import {
  parsePaymentDashboardQuery ,
  requestValidationResponse,
} from '@/src/server/validation/request-validation';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = parsePaymentDashboardQuery(request.nextUrl.searchParams);
    const response = await paymentApiService.fetchDashboard(params, session.token);
    if (response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: getApiErrorStatusCode(response) });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const validationResponse = requestValidationResponse(error);
    if (validationResponse) {
      return validationResponse;
    }
    const message = error instanceof Error && error.message ? error.message : 'Could not load payment dashboard.';
    return NextResponse.json({ message }, { status: 500 });
  }
}