import { getErrorMessage } from './error-utils.ts';

// Standard CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Creates a standardized error response
 * @param error Error message string or unknown error object
 * @param status HTTP status code
 * @param details Optional error details
 * @returns Response object with error details and CORS headers
 */
export function errorResponse(error: string | unknown, status = 400, details?: any) {
  const message = typeof error === 'string' ? error : getErrorMessage(error);
  return new Response(
    JSON.stringify({
      error: message,
      details: details || null,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Creates a standardized success response
 * @param data Response data
 * @param status HTTP status code
 * @returns Response object with data and CORS headers
 */
export function successResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Handle CORS preflight requests
 * @returns Response for OPTIONS requests
 */
export function handleCors() {
  return new Response(null, { headers: corsHeaders });
}
