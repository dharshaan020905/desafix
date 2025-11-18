'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ComplaintDetails() {
  const params = useParams();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!profile?.id || !params.id) return;

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

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
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

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Complaint Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This complaint does not exist or you do not have permission to view it.'}</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                DesaFix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/student/submit-complaint" className="text-gray-600 hover:text-gray-900 transition-colors">
                  New Complaint
                </Link>
                <Link href="/student/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Complaint Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{complaint.title}</h1>
                <p className="text-blue-100">Complaint ID: {complaint.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${getStatusColor(complaint.status)} bg-white`}>
                {complaint.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Image (if exists) */}
            {complaint.image_url && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Attached Photo</h3>
                <img
                  src={complaint.image_url}
                  alt="Complaint"
                  className="w-full max-w-2xl rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Description</h3>
              <p className="text-gray-900 leading-relaxed">{complaint.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Complaint Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Facility Type</p>
                      <p className="text-sm font-medium text-gray-900">{complaint.facility_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Urgency Level</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getUrgencyColor(complaint.urgency)}`}>
                        {complaint.urgency} Priority
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Submitted On</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(complaint.created_at).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Location Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Hostel</p>
                      <p className="text-sm font-medium text-gray-900">{complaint.hostel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Room Number</p>
                      <p className="text-sm font-medium text-gray-900">{complaint.room_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    complaint.status === 'Pending' ? 'bg-yellow-100' :
                    complaint.status === 'In Progress' ? 'bg-blue-100' :
                    complaint.status === 'Resolved' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      complaint.status === 'Pending' ? 'text-yellow-600' :
                      complaint.status === 'In Progress' ? 'text-blue-600' :
                      complaint.status === 'Resolved' ? 'text-green-600' :
                      'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Complaint Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    complaint.status === 'Pending' ? 'bg-gray-100' :
                    complaint.status === 'In Progress' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      complaint.status === 'Pending' ? 'text-gray-400' :
                      complaint.status === 'In Progress' ? 'text-blue-600' :
                      'text-green-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${complaint.status === 'Pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {complaint.status === 'Pending' ? 'Waiting for Review' : 'In Progress'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {complaint.status === 'Pending' ? 'Pending admin review' : 'Being worked on by staff'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    complaint.status === 'Resolved' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${complaint.status === 'Resolved' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${complaint.status === 'Resolved' ? 'text-gray-900' : 'text-gray-400'}`}>
                      Resolved
                    </p>
                    <p className="text-xs text-gray-500">
                      {complaint.status === 'Resolved' ? 'Complaint has been resolved' : 'Awaiting resolution'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 mt-8 pt-6 flex gap-4">
              <Link
                href="/student/dashboard"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-center transition-colors"
              >
                Back to Dashboard
              </Link>
              {complaint.status === 'Resolved' && (
                <button
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  onClick={() => alert('Feedback feature coming soon!')}
                >
                  Submit Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}