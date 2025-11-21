'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');

  // Redirect if not staff
  useEffect(() => {
    if (profile && profile.role !== 'staff') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch assigned complaints
  useEffect(() => {
    let isMounted = true;

    const fetchComplaints = async () => {
      if (!isMounted) return;

      if (!profile?.id || profile.role !== 'staff') {
        setLoading(false);
        return;
      }

      setLoading(true);
  
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
  
        console.log('Fetching assigned complaints for staff:', profile.id);
  
        const { data, error } = await supabase
          .from('complaints')
          .select(`
            *,
            student:users!complaints_student_id_fkey(full_name, email, matric_number)
          `)
          .eq('assigned_to', profile.id)
          .order('created_at', { ascending: false });
  
        console.log('Fetch result:', { data, error });
  
        if (error) throw error;
  
        if (isMounted) {
          setComplaints(data || []);
  
          const total = data?.length || 0;
          const pending = data?.filter(c => c.status === 'Pending').length || 0;
          const inProgress = data?.filter(c => c.status === 'In Progress').length || 0;
          const resolved = data?.filter(c => c.status === 'Resolved').length || 0;
  
          setStats({ total, pending, inProgress, resolved });
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
  }, [profile?.id, profile?.role]);

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

  // Filter complaints based on status and urgency
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'All' || complaint.urgency === urgencyFilter;
    return matchesStatus && matchesUrgency;
  });

  if (profile && profile.role !== 'staff') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="text-lg sm:text-2xl font-bold text-blue-600">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/staff/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  My Tasks
                </Link>
                <Link href="/staff/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-gray-600">Staff: {profile?.full_name}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium rounded-lg hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Logging out...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Log out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {profile?.full_name}!</h1>
          <p className="text-sm sm:text-base text-blue-100">Here are your assigned tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Total Assigned</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-600">Completed</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Assigned Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Assigned Tasks</h2>
                {!loading && complaints.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Showing {filteredComplaints.length} of {complaints.length} task{complaints.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Status Filter */}
                <div className="flex-1 sm:flex-initial min-w-[180px]">
                  <label htmlFor="status-filter" className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all hover:border-gray-300 cursor-pointer shadow-sm"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">⏱️ Pending</option>
                      <option value="In Progress">⚡ In Progress</option>
                      <option value="Resolved">✅ Resolved</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Urgency Filter */}
                <div className="flex-1 sm:flex-initial min-w-[180px]">
                  <label htmlFor="urgency-filter" className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      id="urgency-filter"
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all hover:border-gray-300 cursor-pointer shadow-sm"
                    >
                      <option value="All">All Priority</option>
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟠 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(statusFilter !== 'All' || urgencyFilter !== 'All') && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setUrgencyFilter('All');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Loading tasks...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900">No tasks assigned yet</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Your assigned complaints will appear here.</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900">No tasks match your filters</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Try adjusting your filters to see more tasks.</p>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setUrgencyFilter('All');
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{complaint.title}</h3>
                        <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border w-fit ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                          <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="line-clamp-1">{complaint.student?.full_name}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                          <svg className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="line-clamp-1">{complaint.hostel} - {complaint.room_number}</span>
                        </span>

                        <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold w-fit ${getUrgencyColor(complaint.urgency)}`}>
                          <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {complaint.urgency}
                        </span>

                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                          <svg className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      href={`/staff/complaints/${complaint.id}`}
                      className="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap group text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
                    >
                      Work On It
                      <svg className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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