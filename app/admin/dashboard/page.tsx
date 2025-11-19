'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch all complaints
  useEffect(() => {
    let isMounted = true;

    const fetchComplaints = async () => {
      if (!isMounted) return;

      if (!profile?.id || profile.role !== 'admin') {
        setLoading(false);
        return;
      }

      setLoading(true);
  
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
  
        console.log('Fetching all complaints for admin...');
  
        const { data, error } = await supabase
          .from('complaints')
          .select(`
            *,
            student:users!complaints_student_id_fkey(full_name, email, matric_number)
          `)
          .order('created_at', { ascending: false });
  
        console.log('Fetch result:', { data, error });
  
        if (error) throw error;
  
        if (isMounted) {
          setComplaints(data || []);
  
          const total = data?.length || 0;
          const pending = data?.filter(c => c.status === 'Pending').length || 0;
          const inProgress = data?.filter(c => c.status === 'In Progress').length || 0;
          const resolved = data?.filter(c => c.status === 'Resolved').length || 0;
          const rejected = data?.filter(c => c.status === 'Rejected').length || 0;
  
          setStats({ total, pending, inProgress, resolved, rejected });
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        if (isMounted) {
          setComplaints([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchComplaints();
  
    return () => {
      isMounted = false;
    };
  }, [profile?.id, profile?.role]); // ← Depend only on id and role

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      // signOut handles everything including clearing storage and redirecting
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
      window.location.href = '/login';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (profile && profile.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="text-lg sm:text-2xl font-bold text-blue-600">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/admin/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </Link>
                <Link href="/admin/complaints" className="text-gray-600 hover:text-gray-900 transition-colors">
                  All Complaints
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Users
                </Link>
                <Link href="/admin/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Admin: {profile?.full_name}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium rounded-lg hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Logging out...</span>
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all complaints and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Resolved</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Complaints</h2>
            <Link
              href="/admin/complaints"
              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex items-center gap-1"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
              <p className="mt-1 text-sm text-gray-500">Complaints will appear here as students submit them.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaints.slice(0, 10).map((complaint) => (
                <div key={complaint.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{complaint.title}</h3>
                        <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)} w-fit`}>
                          {complaint.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="truncate max-w-[120px] sm:max-w-none">{complaint.student?.full_name}</span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {complaint.hostel} - {complaint.room_number}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${getUrgencyColor(complaint.urgency)}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {complaint.urgency}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(complaint.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/admin/complaints/${complaint.id}`}
                      className="flex-shrink-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap group"
                    >
                      Manage
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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