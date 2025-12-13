'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, SignUpData } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignUpData) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
            document.cookie = "isAdmin=true; path=/; max-age=86400"; // Expires in 1 day
          } else {
            document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        } else {
          setUser(null);
          document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } catch (error) {
        setUser(null);
        document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
        document.cookie = "isAdmin=true; path=/; max-age=86400"; // Expires in 1 day
      }
      router.push('/');
    } else {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to login');
    }
  };

  const signup = async (userData: SignUpData) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/login');
      return data;
    } else {
      throw new Error(data.message || 'Failed to sign up');
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Signout error', error);
    } finally {
      setUser(null);
      document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
