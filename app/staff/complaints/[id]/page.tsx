'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function StaffComplaintDetails() {
  const params = useParams();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newStatus, setNewStatus] = useState('');
  const [workNotes, setWorkNotes] = useState('');

  const statuses = ['Pending', 'In Progress', 'Resolved'];

  // Redirect if not staff
  useEffect(() => {
    if (profile && profile.role !== 'staff') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch complaint details
  // Fetch complaint details
useEffect(() => {
    const fetchComplaint = async () => {
      if (!profile?.id || profile.role !== 'staff' || !params.id) return;
  
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
  
        // Fetch complaint
        const { data: complaintData, error: complaintError } = await supabase
          .from('complaints')
          .select('*')
          .eq('id', params.id)
          .eq('assigned_to', profile.id) // Staff can only see their assigned complaints
          .single();
  
        if (complaintError) throw complaintError;
  
        if (!complaintData) {
          setError('Complaint not found or not assigned to you');
          return;
        }
  
        // Fetch student details separately
        const { data: studentData, error: studentError } = await supabase
          .from('users')
          .select('full_name, email, matric_number, phone')
          .eq('id', complaintData.student_id)
          .single();
  
        if (studentError) {
          console.error('Error fetching student:', studentError);
        }
  
        setComplaint({ 
          ...complaintData, 
          student: studentData || { full_name: 'Unknown', email: 'N/A', matric_number: 'N/A' } 
        });
        setNewStatus(complaintData.status);
      } catch (err: any) {
        console.error('Error fetching complaint:', err);
        setError(err.message || 'Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };
  
    fetchComplaint();
  }, [profile, params.id]);

  const handleUpdateStatus = async () => {
    if (!complaint?.id || !newStatus) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', complaint.id);

      if (updateError) throw updateError;

      setComplaint({ ...complaint, status: newStatus });
      setSuccess('Status updated successfully!');
      
      // Update staff stats if resolved
      if (newStatus === 'Resolved') {
        await updateStaffStats();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const updateStaffStats = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Increment total_completed in staff table
      const { error } = await supabase.rpc('increment_staff_completed', {
        staff_user_id: profile?.id
      });

      if (error) console.error('Error updating staff stats:', error);
    } catch (err) {
      console.error('Error updating staff stats:', err);
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

  if (profile && profile.role !== 'staff') {
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/staff/dashboard"
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
                <Link href="/staff/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Tasks
                </Link>
                <Link href="/staff/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/staff/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Tasks
          </Link>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Complaint Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{complaint?.title}</h1>
                    <p className="text-blue-100">Task ID: {complaint?.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${getStatusColor(complaint?.status)} bg-white`}>
                    {complaint?.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Image */}
                {complaint?.image_url && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Photo Evidence</h3>
                    <img
                      src={complaint.image_url}
                      alt="Complaint"
                      className="w-full max-w-2xl rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Issue Description</h3>
                  <p className="text-gray-900 leading-relaxed">{complaint?.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Task Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Facility Type</p>
                          <p className="text-sm font-medium text-gray-900">{complaint?.facility_type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Urgency Level</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getUrgencyColor(complaint?.urgency)}`}>
                            {complaint?.urgency} Priority
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Reported On</p>
                          <p className="text-sm font-medium text-gray-900">
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
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Location</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Hostel</p>
                          <p className="text-sm font-medium text-gray-900">{complaint?.hostel}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Room Number</p>
                          <p className="text-sm font-medium text-gray-900">{complaint?.room_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Student Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{complaint?.student?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Matric Number</p>
                  <p className="text-sm font-medium text-gray-900">{complaint?.student?.matric_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{complaint?.student?.email}</p>
                </div>
                {complaint?.student?.phone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{complaint.student.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={updating}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === complaint?.status}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>

                {newStatus === 'Resolved' && newStatus !== complaint?.status && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700">
                      💡 This will mark the task as completed and update your statistics.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Update status to "In Progress" when you start working</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Contact the student if you need more details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Mark as "Resolved" only when work is complete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}