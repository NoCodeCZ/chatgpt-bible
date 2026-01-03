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
  subscription_expires_at: string | null;

  // DEPRECATED: Stripe fields - kept for backward compatibility
  // @deprecated No longer used with one-time purchase model
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

/**
 * Premium license information (from premium_licenses collection)
 * Admin creates this record in Directus when activating a user
 */
export interface PremiumLicense {
  id: string;
  user_id: string;
  purchase_method: 'bank_transfer' | 'qr_code' | 'other';
  purchase_date: string | null;
  activated_at: string | null;
  expires_at: string | null;  // null = lifetime
  notes: string | null;
}

/**
 * User's premium status with license details
 */
export interface PremiumStatus {
  is_premium: boolean;
  expires_at: string | null;
  license: PremiumLicense | null;
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
