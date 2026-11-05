const DEFAULT_FINANCE_API_BASE_URL = 'http://127.0.0.1:8000';

export type FinanceApiEnvironment = {
  API_BASE_URL?: string;
  NODE_ENV?: string;
};

export function resolveFinanceApiBaseUrl(
  environment: FinanceApiEnvironment,
): string {
  const configuredUrl = environment.API_BASE_URL?.trim();

  if (!configuredUrl) {
    if (environment.NODE_ENV === 'production') {
      throw new Error('API_BASE_URL must be configured in production.');
    }

    return DEFAULT_FINANCE_API_BASE_URL;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw new Error('API_BASE_URL must be a valid absolute HTTP or HTTPS URL.');
  }

  if (
    (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') ||
    !parsedUrl.hostname
  ) {
    throw new Error('API_BASE_URL must be a valid absolute HTTP or HTTPS URL.');
  }

  return configuredUrl;
}
