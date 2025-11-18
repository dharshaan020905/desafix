'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminComplaintDetails() {
  const params = useParams();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newStatus, setNewStatus] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');

  const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/login');
    }
  }, [profile, router]);

  // Fetch complaint details and staff list
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id || profile.role !== 'admin' || !params.id) return;

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        // Fetch complaint with student and assigned staff info
        const { data: complaintData, error: complaintError } = await supabase
          .from('complaints')
          .select(`
            *,
            student:users!complaints_student_id_fkey(full_name, email, matric_number, phone),
            assigned_staff:users!complaints_assigned_to_fkey(full_name, email)
          `)
          .eq('id', params.id)
          .single();

        if (complaintError) throw complaintError;

        if (!complaintData) {
          setError('Complaint not found');
          return;
        }

        setComplaint(complaintData);
        setNewStatus(complaintData.status);
        setAssignedStaff(complaintData.assigned_to || '');

        // Fetch all staff members
        const { data: staffData, error: staffError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('role', 'staff')
          .order('full_name');

        if (staffError) throw staffError;

        setStaffList(staffData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, params.id]);

  const handleUpdate = async () => {
    if (!complaint?.id) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const updates: any = {
        status: newStatus,
      };

      // Only update assigned_to if a staff member is selected
      if (assignedStaff) {
        updates.assigned_to = assignedStaff;
      }

      const { error: updateError } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', complaint.id);

      if (updateError) throw updateError;

      // Update local state
      setComplaint({ 
        ...complaint, 
        status: newStatus,
        assigned_to: assignedStaff || null,
        assigned_staff: assignedStaff ? staffList.find(s => s.id === assignedStaff) : null
      });

      setSuccess('Complaint updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating complaint:', err);
      setError(err.message || 'Failed to update complaint');
    } finally {
      setUpdating(false);
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

  if (profile && profile.role !== 'admin') {
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
            href="/admin/dashboard"
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
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/complaints" className="text-gray-600 hover:text-gray-900 transition-colors">
                  All Complaints
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Users
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
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
                    <p className="text-blue-100">ID: {complaint?.id.slice(0, 8).toUpperCase()}</p>
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
                  <p className="text-gray-900 leading-relaxed">{complaint?.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Complaint Details</h3>
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
                          <p className="text-xs text-gray-500">Submitted On</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(complaint?.created_at).toLocaleDateString('en-US', {
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
            {/* Student Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
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
                  <p className="text-sm font-medium text-gray-900">{complaint?.student?.email}</p>
                </div>
                {complaint?.student?.phone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{complaint.student.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Staff */}
            {complaint?.assigned_staff && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned To</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {complaint.assigned_staff.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{complaint.assigned_staff.full_name}</p>
                    <p className="text-xs text-gray-600">{complaint.assigned_staff.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Management Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Complaint</h3>
              
              <div className="space-y-4">
                {/* Status Dropdown */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
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

                {/* Staff Assignment Dropdown */}
                <div>
                  <label htmlFor="staff" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Staff
                  </label>
                  <select
                    id="staff"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={updating}
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.full_name}
                      </option>
                    ))}
                  </select>
                  {staffList.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No staff members available</p>
                  )}
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Complaint'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}