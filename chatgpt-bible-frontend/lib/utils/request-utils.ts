/**
 * Request utilities for timeout handling and retry logic
 * 
 * Provides:
 * - Request timeout wrapper using AbortController
 * - Exponential backoff retry logic
 * - Error handling for network/timeout failures
 */

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second base delay

/**
 * Creates an AbortController that will abort after the specified timeout
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  // Clear timeout if manually aborted
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
  });
  
  return controller;
}

/**
 * Wraps a request function with timeout handling
 * 
 * @param requestFn - The request function to wrap
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns Promise that rejects with timeout error if exceeded
 */
export async function withTimeout<T>(
  requestFn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = createTimeoutController(timeoutMs);
  
  try {
    const result = await requestFn(controller.signal);
    controller.abort(); // Clear timeout on success
    return result;
  } catch (error) {
    controller.abort();
    
    // Check if error was due to timeout
    if (controller.signal.aborted && error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    
    throw error;
  }
}

/**
 * Retry configuration options
 */
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryable?: (error: unknown) => boolean;
}

/**
 * Wraps a request function with exponential backoff retry logic
 * 
 * @param requestFn - The request function to wrap
 * @param options - Retry configuration options
 * @returns Promise that retries on failure with exponential backoff
 * 
 * @example
 * ```typescript
 * const result = await requestWithRetry(
 *   async () => directus.request(readItems('prompts')),
 *   { maxRetries: 3, baseDelay: 1000 }
 * );
 * ```
 */
export async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelay = DEFAULT_RETRY_DELAY,
    maxDelay = 10000,
    retryable = (error: unknown) => {
      // Retry on network errors, timeouts, and 5xx errors
      if (error instanceof Error) {
        return (
          error.message.includes('timeout') ||
          error.message.includes('network') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT')
        );
      }
      return false;
    },
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Don't retry if error is not retryable
      if (!retryable(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      console.warn(
        `Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`,
        error instanceof Error ? error.message : String(error)
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted
  throw lastError;
}

/**
 * Combines timeout and retry logic for robust request handling
 * 
 * @param requestFn - The request function to wrap
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @param retryOptions - Retry configuration options
 * @returns Promise with timeout and retry handling
 * 
 * @example
 * ```typescript
 * const result = await requestWithTimeoutAndRetry(
 *   async (signal) => directus.request(readItems('prompts'), { signal }),
 *   10000,
 *   { maxRetries: 3 }
 * );
 * ```
 */
export async function requestWithTimeoutAndRetry<T>(
  requestFn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return requestWithRetry(
    () => withTimeout(requestFn, timeoutMs),
    retryOptions
  );
}

