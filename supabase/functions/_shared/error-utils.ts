/**
 * Safely extract error message from unknown error type
 */
export function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

/**
 * Check if error has a specific name property
 */
export function hasErrorName(error: unknown, name: string): boolean {
  return error instanceof Error && error.name === name;
}
