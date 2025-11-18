'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function StaffAnalytics() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const [staffPerformance, setStaffPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch staff performance data
  useEffect(() => {
    let isMounted = true;

    const fetchStaffPerformance = async () => {
      if (!profile?.id || profile.role !== 'admin' || !isMounted) return;

      setLoading(true);

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        console.log('Fetching staff performance data...');

        // Fetch staff with their user info and complaint stats
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            *,
            user:users!staff_user_id_fkey(full_name, email)
          `)
          .order('rating', { ascending: false });

        if (staffError) throw staffError;

        if (isMounted) {
          // Calculate additional stats from complaints
          const enrichedData = await Promise.all(
            (staffData || []).map(async (staff) => {
              // Get complaints assigned to this staff
              const { data: complaints } = await supabase
                .from('complaints')
                .select('id, status, rating, created_at, updated_at')
                .eq('assigned_to', staff.user_id);

              const totalAssigned = complaints?.length || 0;
              const completed = complaints?.filter(c => c.status === 'Resolved').length || 0;
              const pending = complaints?.filter(c => c.status === 'Pending' || c.status === 'In Progress').length || 0;
              
              // Calculate average rating from resolved complaints
              const ratedComplaints = complaints?.filter(c => c.rating && c.status === 'Resolved') || [];
              const avgRating = ratedComplaints.length > 0
                ? (ratedComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedComplaints.length)
                : 0;

              return {
                ...staff,
                stats: {
                  totalAssigned,
                  completed,
                  pending,
                  avgRating: avgRating.toFixed(1),
                  completionRate: totalAssigned > 0 ? ((completed / totalAssigned) * 100).toFixed(0) : 0,
                }
              };
            })
          );

          setStaffPerformance(enrichedData);
        }
      } catch (err) {
        console.error('Error fetching staff performance:', err);
        if (isMounted) {
          setStaffPerformance([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStaffPerformance();

    return () => {
      isMounted = false;
    };
  }, [profile?.id, profile?.role]);

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

  if (profile && profile.role !== 'admin') {
    return null;
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
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/complaints" className="text-gray-600 hover:text-gray-900 transition-colors">
                  All Complaints
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Users
                </Link>
                <Link href="/admin/analytics" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin: {profile?.full_name}</span>
              <button onClick={handleLogout} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Performance Analytics</h1>
          <p className="text-gray-600">Monitor staff performance and ratings</p>
        </div>

        {/* Staff Performance Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading staff performance...</p>
            </div>
          ) : staffPerformance.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members yet</h3>
              <p className="mt-1 text-sm text-gray-500">Staff performance will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {staffPerformance.map((staff) => (
                <div key={staff.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-6">
                    {/* Staff Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {staff.user?.full_name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{staff.user?.full_name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{staff.user?.email}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {staff.specialization}
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-4 gap-6">
                      {/* Total Assigned */}
                      <div className="text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{staff.stats.totalAssigned}</p>
                        <p className="text-xs text-gray-500">Total Tasks</p>
                      </div>

                      {/* Completed */}
                      <div className="text-center">
                        <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{staff.stats.completed}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>

                      {/* Completion Rate */}
                      <div className="text-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{staff.stats.completionRate}%</p>
                        <p className="text-xs text-gray-500">Rate</p>
                      </div>

                      {/* Average Rating */}
                      <div className="text-center">
                        <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">{staff.stats.avgRating || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Avg Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  {staff.stats.totalAssigned > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs text-gray-600 font-medium">Task Progress</p>
                        <span className="text-xs text-gray-500">
                          ({staff.stats.completed}/{staff.stats.totalAssigned} completed)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${staff.stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      staff.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        staff.is_available ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {staff.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}