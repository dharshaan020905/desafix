import { createClient } from './client';

export async function signOutUser() {
  try {
    const supabase = createClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
    }
    
    // Clear all local storage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Force redirect to login
    window.location.href = '/login';
  } catch (err) {
    console.error('Logout error:', err);
    // Force redirect anyway
    window.location.href = '/login';
  }
}