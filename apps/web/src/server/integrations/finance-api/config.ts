import 'server-only';

import { resolveFinanceApiBaseUrl } from './config-utils';

export const FINANCE_API_BASE_URL = resolveFinanceApiBaseUrl({
  API_BASE_URL: process.env.API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
});
