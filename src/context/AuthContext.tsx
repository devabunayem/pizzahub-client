'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { authClient } from '@/lib/auth-client';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  image?: string;
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan: 'free' | 'premium';
  subscriptionExpiresAt?: string;
  createdAt?: string;
}

export interface GoogleLoginOptions {
  role?: 'customer' | 'vendor';
  businessName?: string;
  redirectTo?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  loginWithGoogle: (options?: GoogleLoginOptions) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user from token or sync active Better Auth Google OAuth session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('pizzahub_token');

        if (storedToken) {
          setToken(storedToken);
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              return;
            }
          }

          // Invalid or expired token
          localStorage.removeItem('pizzahub_token');
          document.cookie = 'token=; path=/; max-age=0';
          setToken(null);
          setUser(null);
        }

        // Check if a Better Auth Google OAuth session is active
        const sessionRes = await fetch('/api/auth/get-session', {
          credentials: 'include',
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          const socialUser = sessionData?.user;

          if (socialUser?.email) {
            let meta: GoogleLoginOptions = {};
            try {
              const rawMeta = localStorage.getItem('pizzahub_oauth_meta');
              if (rawMeta) {
                meta = JSON.parse(rawMeta);
                localStorage.removeItem('pizzahub_oauth_meta');
              }
            } catch {
              // ignore parse error
            }

            const syncRes = await fetch(`${API_BASE}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: socialUser.name,
                email: socialUser.email,
                image: socialUser.image,
                role: meta.role || 'customer',
                businessName: meta.businessName,
              }),
            });

            const syncData = await syncRes.json();
            if (syncRes.ok && syncData.success && syncData.token && syncData.user) {
              setToken(syncData.token);
              setUser(syncData.user);
              localStorage.setItem('pizzahub_token', syncData.token);
              document.cookie = `token=${syncData.token}; path=/; max-age=604800; SameSite=Lax`;
              toast.success(syncData.message || `Signed in as ${syncData.user.name}`);

              if (meta.redirectTo && meta.redirectTo.startsWith('/')) {
                router.replace(meta.redirectTo);
              }
            } else if (!syncRes.ok && syncData?.message) {
              toast.error(syncData.message);
              await authClient.signOut().catch(() => {});
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Login failed. Please check credentials.');
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pizzahub_token', data.token);
      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;

      toast.success(data.message || 'Login successful! Welcome back.');

      if (data.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (data.user.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }

      return true;
    } catch (err: any) {
      toast.error('Network error. Unable to connect to server.');
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Registration failed.');
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pizzahub_token', data.token);
      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;

      toast.success(data.message || 'Account created successfully!');

      if (data.user.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }

      return true;
    } catch (err: any) {
      toast.error('Network error during registration.');
      return false;
    }
  };

  const loginWithGoogle = async (options?: GoogleLoginOptions): Promise<void> => {
    try {
      localStorage.setItem('pizzahub_oauth_meta', JSON.stringify(options || {}));
      const res = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/signin?oauth=google',
      });
      if ((res as any)?.error) {
        toast.error((res as any).error.message || 'Unable to start Google sign-in.');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      toast.error('Unable to start Google sign-in.');
    }
  };

  const logout = () => {
    localStorage.removeItem('pizzahub_token');
    localStorage.removeItem('pizzahub_oauth_meta');
    document.cookie = 'token=; path=/; max-age=0';
    setToken(null);
    setUser(null);
    authClient.signOut().catch(() => {});
    toast.success('Logged out successfully.');
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
