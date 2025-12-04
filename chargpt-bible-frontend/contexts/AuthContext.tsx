'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginCredentials, RegisterData, AuthState } from '@/types/User';
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getCurrentUser,
  isPaidUser as checkIsPaidUser,
  canAccessPrompt as checkCanAccessPrompt,
} from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
  isPaidUser: boolean;
  canAccessPrompt: (promptIndex: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Provides authentication state and methods to the app
 *
 * Features:
 * - Automatic session restoration on mount
 * - Login/logout/register methods
 * - Subscription status helpers (isPaidUser, canAccessPrompt)
 * - Loading state management
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  // Note: Redirect is handled by the calling component (e.g., login page)
  // to support returnUrl functionality
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authLogin(credentials);
      setUser(loggedInUser);
      // Don't redirect here - let the calling component handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authLogout();
      setUser(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Register handler
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const newUser = await authRegister(data);
      setUser(newUser);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  // Subscription helpers
  const isPaidUser = checkIsPaidUser(user);

  const canAccessPrompt = useCallback(
    (promptIndex: number) => checkCanAccessPrompt(user, promptIndex),
    [user]
  );

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshUser,
    isPaidUser,
    canAccessPrompt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context from any component
 *
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
