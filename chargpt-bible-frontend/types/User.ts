/**
 * User type matching Directus directus_users collection
 * Extended with subscription fields for freemium model
 */
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  role: string;
  subscription_status: 'free' | 'paid';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_expires_at: string | null;
}

/**
 * Authenticated user with token information
 */
export interface AuthUser extends User {
  access_token: string;
  refresh_token: string;
  expires: number;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Auth response from Directus /auth/login
 */
export interface DirectusAuthResponse {
  access_token: string;
  refresh_token: string;
  expires: number;
}

/**
 * Auth state for context
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
