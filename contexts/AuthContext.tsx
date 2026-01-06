'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admin';
  matric_number?: string;
  hostel?: string;
  room_number?: string;
  phone?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  sessionWarning: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes warning

// For testing:
// const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes
// const WARNING_TIME = 30 * 1000; // 30 seconds warning

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const supabase = createClient();

  // Fetch profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('Setting profile:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          if (session?.user) {
            console.log('Existing session found:', session.user.id);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log('No existing session');
            setUser(null);
            setProfile(null);
          }
          setAuthLoading(false);
        }
      } catch (error) {
        console.error('Init error:', error);
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth event:', event);

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
          setAuthLoading(false);
        } else {
          setUser(null);
          setProfile(null);
          setAuthLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      // Clear existing timeouts
      if (timeoutId) clearTimeout(timeoutId);
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
      setSessionWarning(false);
      
      // Set warning timeout (25 minutes)
      warningTimeoutId = setTimeout(() => {
        setSessionWarning(true);
      }, SESSION_TIMEOUT - WARNING_TIME);
      
      // Set logout timeout (30 minutes)
      timeoutId = setTimeout(async () => {
        console.log('Session expired due to inactivity');
        await signOut();
        window.location.href = '/login?session=expired';
      }, SESSION_TIMEOUT);
    };
    
    // Activity events to reset timeout
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });
    
    // Initial timeout
    resetTimeout();
    
    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [user]);

  // Clear session only when browser completely closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Remove the session marker so next browser open is "fresh"
      sessionStorage.removeItem('desafix_session_active');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in...');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Mark session as active
      sessionStorage.setItem('desafix_session_active', 'true');

      console.log('Sign in successful');
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) throw signUpError;
  
      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: email,
            full_name: userData.full_name,
            matric_number: userData.matric_number,
            hostel: userData.hostel,
            room_number: userData.room_number,
            phone: userData.phone,
            role: 'student',
          },
        ]);
  
        if (profileError) throw profileError;
      }
  
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');

      // Clear state first to immediately update UI
      setUser(null);
      setProfile(null);

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Sign out from Supabase - use 'global' to clear all sessions
      await supabase.auth.signOut({ scope: 'global' });

      console.log('Sign out successful');

      // Force navigation to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, still try to navigate away
      window.location.href = '/';
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Refreshing profile...');
      await fetchProfile(user.id);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const extendSession = () => {
    setSessionWarning(false);
    // The activity listener will automatically reset the timeout
    window.dispatchEvent(new Event('mousedown'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authLoading,
        sessionWarning,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

