/**
 * Authentication service for Directus
 *
 * Handles login, logout, registration, token refresh, and user session management.
 * Uses httpOnly cookies for secure token storage (XSS protection).
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  DirectusAuthResponse,
} from '@/types/User';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

if (!DIRECTUS_URL) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}

/**
 * Login user with email and password
 * Tokens are stored in httpOnly cookies by the API route
 *
 * @param credentials - Email and password
 * @returns User object on success
 * @throws Error on invalid credentials or network error
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  return data.user;
}

/**
 * Logout user and clear session
 * Clears httpOnly cookies via API route
 */
export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

/**
 * Register new user
 *
 * @param data - Registration data (email, password, optional name)
 * @returns User object on success
 * @throws Error on validation or registration failure
 */
export async function register(data: RegisterData): Promise<User> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const result = await response.json();
  return result.user;
}

/**
 * Get current authenticated user
 * Validates session via API route (checks cookie)
 *
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Refresh access token
 * Called automatically when access token expires
 *
 * @returns true if refresh successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if user has paid subscription
 *
 * @param user - User object
 * @returns true if user has paid subscription
 */
export function isPaidUser(user: User | null): boolean {
  if (!user) return false;
  return user.subscription_status === 'paid';
}

/**
 * Check if user can access a prompt by index
 * Free users: first FREE_PROMPT_LIMIT prompts only
 * Paid users: all prompts
 *
 * @param user - User object (null = unauthenticated)
 * @param promptIndex - 0-based index of prompt in list
 * @returns true if user can access the prompt
 */
export function canAccessPrompt(user: User | null, promptIndex: number): boolean {
  // Paid users can access everything
  if (user && isPaidUser(user)) {
    return true;
  }

  // Free limit from env (default 3)
  const freeLimit = parseInt(process.env.NEXT_PUBLIC_FREE_PROMPT_LIMIT || '3', 10);

  // Free and unauthenticated users: only first N prompts
  return promptIndex < freeLimit;
}

/**
 * Server-side: Validate access token from cookie
 * Used in API routes and middleware
 *
 * @param accessToken - JWT access token
 * @returns User object if valid, null otherwise
 */
export async function validateToken(accessToken: string): Promise<User | null> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data as User;
  } catch {
    return null;
  }
}

/**
 * Server-side: Login to Directus and get tokens
 *
 * @param credentials - Email and password
 * @returns Auth response with tokens
 * @throws Error on invalid credentials
 */
export async function directusLogin(
  credentials: LoginCredentials
): Promise<DirectusAuthResponse> {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Invalid credentials');
  }

  const data = await response.json();
  return data.data as DirectusAuthResponse;
}

/**
 * Server-side: Refresh access token using refresh token
 *
 * @param refreshToken - Refresh token from cookie
 * @returns New auth response with tokens
 * @throws Error if refresh fails
 */
export async function directusRefresh(
  refreshToken: string
): Promise<DirectusAuthResponse> {
  const response = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
      mode: 'json',
    }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return data.data as DirectusAuthResponse;
}

/**
 * Server-side: Logout from Directus
 *
 * @param refreshToken - Refresh token to invalidate
 */
export async function directusLogout(refreshToken: string): Promise<void> {
  await fetch(`${DIRECTUS_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
}

/**
 * Server-side: Create new user in Directus
 *
 * @param data - Registration data
 * @returns Created user
 * @throws Error on validation failure
 */
export async function directusRegister(data: RegisterData): Promise<User> {
  const response = await fetch(`${DIRECTUS_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      subscription_status: 'free',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Registration failed');
  }

  const result = await response.json();
  return result.data as User;
}
