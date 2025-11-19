'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import FeedbackModal from '@/components/FeedbackModal';

export default function ComplaintDetails() {
  const params = useParams();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Redirect if not student
  useEffect(() => {
    if (profile && profile.role !== 'student') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch complaint details
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!profile?.id || profile.role !== 'student' || !params.id) return;

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('id', params.id)
          .eq('student_id', profile.id)
          .single();

        if (error) throw error;

        if (!data) {
          setError('Complaint not found');
          return;
        }

        setComplaint(data);
      } catch (err: any) {
        console.error('Error fetching complaint:', err);
        setError(err.message || 'Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [profile, params.id]);

  const handleFeedbackSubmit = async (rating: number, feedbackText: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('complaints')
        .update({
          rating,
          feedback: feedbackText,
          feedback_submitted_at: new Date().toISOString(),
        })
        .eq('id', complaint.id);

      if (error) throw error;

      setComplaint({
        ...complaint,
        rating,
        feedback: feedbackText,
        feedback_submitted_at: new Date().toISOString(),
      });

      setSuccess('Thank you for your feedback!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit feedback');
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

  if (profile && profile.role !== 'student') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Complaint Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 flex-shrink-0">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-4 lg:gap-6">
                <Link href="/student/dashboard" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/student/complaints/new" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  New Complaint
                </Link>
                <Link href="/student/profile" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden xs:inline text-xs sm:text-sm text-gray-600 truncate">{profile?.full_name}</span>
              <button onClick={handleLogout} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Complaint Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 break-words">{complaint?.title}</h1>
                    <p className="text-xs sm:text-sm text-blue-100">ID: {complaint?.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border-2 ${getStatusColor(complaint?.status)} bg-white flex-shrink-0`}>
                    {complaint?.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Image */}
                {complaint?.image_url && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Attached Photo</h3>
                    <img
                      src={complaint.image_url}
                      alt="Complaint"
                      className="w-full max-h-60 sm:max-h-80 object-cover rounded-lg sm:rounded-xl border border-gray-300 shadow-sm"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{complaint?.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Complaint Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Facility Type</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">{complaint?.facility_type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Urgency Level</p>
                          <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${getUrgencyColor(complaint?.urgency)}`}>
                            {complaint?.urgency} Priority
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Submitted On</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            {new Date(complaint?.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Location</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Hostel</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">{complaint?.hostel}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Room Number</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">{complaint?.room_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Current Status</p>
                  <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full border ${getStatusColor(complaint?.status)}`}>
                    {complaint?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback Section - Only show for resolved complaints without feedback */}
            {complaint?.status === 'Resolved' && !complaint?.feedback_submitted_at && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Complaint Resolved!</h3>
                    <p className="text-xs sm:text-sm text-gray-600">How was your experience? Your feedback helps us improve!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Rate Experience</span>
                </button>
              </div>
            )}

            {/* Already Submitted Feedback */}
            {complaint?.feedback_submitted_at && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Feedback Submitted</h3>
                </div>
                <div className="mb-2">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Your Rating:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          star <= (complaint?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
                {complaint?.feedback && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Your Feedback:</p>
                    <p className="text-xs sm:text-sm text-gray-700 italic">"{complaint.feedback}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          complaintId={complaint?.id || ''}
          complaintTitle={complaint?.title || ''}
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      </main>
    </div>
  );
}