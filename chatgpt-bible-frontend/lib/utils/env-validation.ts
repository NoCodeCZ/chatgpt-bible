/**
 * Environment variable validation utilities
 * 
 * Validates required environment variables and provides helpful error messages
 * for development and production environments.
 */

interface EnvVar {
  name: string;
  value: string | undefined;
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

/**
 * Validate environment variables
 * 
 * @param vars - Array of environment variable definitions
 * @throws Error if validation fails
 */
export function validateEnvVars(vars: EnvVar[]): void {
  const missing = vars
    .filter((v) => v.required && !v.value)
    .map((v) => v.name);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  // Validate format if validator provided
  const invalid = vars
    .filter((v) => v.value && v.validator && !v.validator(v.value))
    .map((v) => v.name);

  if (invalid.length > 0) {
    const messages = invalid.map((name) => {
      const varDef = vars.find((v) => v.name === name);
      return varDef?.errorMessage || `Invalid format for ${name}`;
    });

    throw new Error(messages.join('\n'));
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get environment variable with validation
 * 
 * @param name - Environment variable name
 * @param required - Whether variable is required
 * @param defaultValue - Default value if not required and not set
 * @returns Environment variable value
 * @throws Error if required and missing
 */
export function getEnvVar(
  name: string,
  required: boolean = true,
  defaultValue?: string
): string {
  const value = process.env[name];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  return value || defaultValue || '';
}

