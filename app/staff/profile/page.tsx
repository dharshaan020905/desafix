'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function StaffProfile() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
  });

  // Redirect if not staff
  useEffect(() => {
    if (profile && profile.role !== 'staff') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch staff data
useEffect(() => {
    let isMounted = true;
  
    const fetchStaffData = async () => {
      if (!profile?.id || profile.role !== 'staff' || !isMounted) return;
  
      setLoading(true);
  
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
  
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', profile.id)
          .single();
  
        if (userError) throw userError;
  
        // Fetch staff-specific data
        const { data: staffInfo, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('user_id', profile.id)
          .single();
  
        if (staffError && staffError.code !== 'PGRST116') throw staffError;
  
        // Fetch actual complaints to calculate real rating
        const { data: complaints } = await supabase
          .from('complaints')
          .select('id, status, rating')
          .eq('assigned_to', profile.id);
  
        // Calculate real average rating from resolved complaints with ratings
        const ratedComplaints = complaints?.filter(c => c.rating && c.status === 'Resolved') || [];
        const actualAvgRating = ratedComplaints.length > 0
          ? (ratedComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedComplaints.length).toFixed(1)
          : null;
  
        const totalAssigned = complaints?.length || 0;
        const totalCompleted = complaints?.filter(c => c.status === 'Resolved').length || 0;
  
        if (isMounted) {
          setStaffData({ 
            ...userData, 
            staff: {
              ...staffInfo,
              // Use calculated rating instead of stored rating
              calculated_rating: actualAvgRating,
              total_assigned: totalAssigned,
              total_completed: totalCompleted,
            }
          });
          setFormData({
            full_name: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            specialization: staffInfo?.specialization || '',
          });
        }
      } catch (err: any) {
        console.error('Error fetching staff data:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchStaffData();
  
    return () => {
      isMounted = false;
    };
  }, [profile?.id, profile?.role]);
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', profile?.id);

      if (userError) throw userError;

      // Update staff specialization
      const { error: staffError } = await supabase
        .from('staff')
        .update({
          specialization: formData.specialization,
        })
        .eq('user_id', profile?.id);

      if (staffError) throw staffError;

      setStaffData({
        ...staffData,
        full_name: formData.full_name,
        phone: formData.phone,
        staff: {
          ...staffData.staff,
          specialization: formData.specialization,
        },
      });

      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    }
  };

  if (profile && profile.role !== 'staff') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/staff/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Tasks
                </Link>
                <Link href="/staff/profile" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Staff: {profile?.full_name}</span>
              <button onClick={handleLogout} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and settings</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {staffData?.full_name?.charAt(0) || 'S'}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{staffData?.full_name}</h2>
                <p className="text-sm text-gray-600 mb-4">{staffData?.email}</p>
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Staff Member
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="text-sm font-semibold text-gray-900">{staffData?.staff?.total_completed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks Assigned</span>
                  <span className="text-sm font-semibold text-gray-900">{staffData?.staff?.total_assigned || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {staffData?.staff?.calculated_rating || 'No ratings yet'}
                </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: staffData?.full_name || '',
                          email: staffData?.email || '',
                          phone: staffData?.phone || '',
                          specialization: staffData?.staff?.specialization || '',
                        });
                      }}
                      disabled={saving}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    disabled={!editing}
                    placeholder="e.g., Electrical & Plumbing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Matric Number</span>
                      <span className="font-medium text-gray-900">{staffData?.matric_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hostel</span>
                      <span className="font-medium text-gray-900">{staffData?.hostel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Room Number</span>
                      <span className="font-medium text-gray-900">{staffData?.room_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-gray-900">
                        {new Date(staffData?.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}