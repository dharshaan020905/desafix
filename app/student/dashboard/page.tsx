'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  // Role-based access control
  useEffect(() => {
    if (profile && profile.role !== 'student') {
      router.push('/'); // Redirect non-students
    }
  }, [profile, router]);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check for success notification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, '', '/student/dashboard');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchComplaints = async () => {
      if (!isMounted) return;

      if (!profile?.id) {
        setLoading(false);
        return;
      }

      setLoading(true); // Reset loading state
  
      try {
        // Create completely fresh client
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
  
        console.log('Fetching complaints for:', profile.id);
  
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('student_id', profile.id)
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
  
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [profile?.id]); // Only depend on profile.id, not the whole profile object

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
        return 'text-red-600';
      case 'Medium':
        return 'text-orange-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-8">
              <Link href="/" className="text-lg sm:text-2xl font-bold text-blue-600 flex-shrink-0">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/student/dashboard" className="text-sm sm:text-base text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </Link>
                <Link href="/student/submit-complaint" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">
                  New Complaint
                </Link>
                <Link href="/student/profile" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium rounded-lg hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Logging out...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-8 text-white mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 line-clamp-2">Welcome back, {profile?.full_name}!</h1>
          <p className="text-xs sm:text-sm text-blue-100 line-clamp-2">
            {profile?.hostel} • Room {profile?.room_number} • {profile?.matric_number}
          </p>
        </div>

        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-4 sm:mb-8 bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base text-green-900 font-semibold mb-1">Complaint Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-green-700">Your complaint has been received and will be reviewed by our team shortly.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Total Complaints</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">In Progress</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Resolved</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <Link
            href="/student/submit-complaint"
            className="bg-blue-600 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm hover:shadow-md group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 truncate">Submit New Complaint</h3>
                <p className="text-xs sm:text-sm text-blue-100 line-clamp-2">Report a facility issue in your hostel</p>
              </div>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </Link>

          <Link
            href="/student/profile"
            className="bg-white border-2 border-gray-200 p-4 sm:p-6 rounded-lg sm:rounded-xl hover:border-blue-500 active:scale-95 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 truncate">View Profile</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">Check your complaint history and details</p>
              </div>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">My Complaints</h2>
          </div>

          {loading ? (
            <div className="p-6 sm:p-8 md:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-600">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-6 sm:p-8 md:p-12 text-center">
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started by submitting a new complaint.</p>
              <div className="mt-4 sm:mt-6">
                <Link
                  href="/student/submit-complaint"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Submit Complaint
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left side - Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-2 sm:mb-3 gap-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate flex-1 min-w-0">{complaint.title}</h3>
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)} whitespace-nowrap flex-shrink-0`}>
                          {complaint.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{complaint.description}</p>

                      {/* Badges in bubbles */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-xs font-medium whitespace-nowrap">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="hidden sm:inline">{complaint.facility_type}</span>
                          <span className="sm:hidden">{complaint.facility_type.substring(0, 8)}{complaint.facility_type.length > 8 ? '...' : ''}</span>
                        </span>

                        <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-xs font-semibold whitespace-nowrap ${
                          complaint.urgency === 'High' ? 'bg-red-100 text-red-700' :
                          complaint.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {complaint.urgency}
                        </span>

                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-xs font-medium whitespace-nowrap">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">{new Date(complaint.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <span className="sm:hidden">{new Date(complaint.created_at).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: '2-digit'
                          })}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right side - View Details Button */}
                    <Link
                      href={`/student/complaints/${complaint.id}`}
                      className="w-full sm:w-auto sm:flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap group text-xs sm:text-sm"
                    >
                      View Details
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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