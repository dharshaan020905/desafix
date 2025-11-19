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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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
// Initialize auth state
useEffect(() => {
  let isMounted = true;
  
  const initAuth = async () => {
    try {
      // FORCE SIGN OUT on every page load
      await supabase.auth.signOut({ scope: 'local' });
      
      if (isMounted) {
        setUser(null);
        setProfile(null);
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

  // Listen for auth changes ONLY
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!isMounted) return;
      
      console.log('Auth event:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    }
  );

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);

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
      
      // Clear all local data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      setUser(null);
      setProfile(null);
      
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
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
  

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
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