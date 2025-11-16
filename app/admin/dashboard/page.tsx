'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [complaints] = useState([
    {
      id: 1,
      title: 'Broken AC Unit',
      student: 'Ahmad Ibrahim',
      hostel: 'KK3',
      room: '301',
      facility: 'Air Conditioning',
      status: 'In Progress',
      urgency: 'High',
      date: '2024-11-15',
      assignedTo: 'Ahmad bin Abdullah'
    },
    {
      id: 2,
      title: 'Leaking Faucet',
      student: 'Fatimah Zahra',
      hostel: 'KK2',
      room: '205',
      facility: 'Plumbing',
      status: 'Pending',
      urgency: 'Medium',
      date: '2024-11-14',
      assignedTo: null
    },
    {
      id: 3,
      title: 'Light Bulb Not Working',
      student: 'Muhammad Ali',
      hostel: 'KK1',
      room: '102',
      facility: 'Electrical',
      status: 'Resolved',
      urgency: 'Low',
      date: '2024-11-10',
      assignedTo: 'Hassan Mahmoud'
    },
    {
      id: 4,
      title: 'Door Lock Broken',
      student: 'Nurul Ain',
      hostel: 'KK4',
      room: '408',
      facility: 'Door/Window',
      status: 'Pending',
      urgency: 'High',
      date: '2024-11-16',
      assignedTo: null
    }
  ]);

  const [stats] = useState({
    total: 24,
    pending: 6,
    inProgress: 8,
    resolved: 10,
    avgResponseTime: '2.5 hrs',
    avgResolutionTime: '18 hrs'
  });

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'progress' | 'resolved'>('all');

  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return c.status === 'Pending';
    if (activeTab === 'progress') return c.status === 'In Progress';
    if (activeTab === 'resolved') return c.status === 'Resolved';
    return true;
  });

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Desafix Admin
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/admin/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </Link>
                <Link href="/admin/staff" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Staff Management
                </Link>
                <Link href="/admin/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Analytics
                </Link>
              </div>
            </div>
            <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage complaints and monitor system performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Response</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Resolution</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/admin/staff"
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Staff Management</h3>
                <p className="text-sm text-gray-600">View and manage maintenance staff</p>
              </div>
              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/admin/analytics"
            className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Performance Analytics</h3>
                <p className="text-sm text-gray-600">View detailed reports and metrics</p>
              </div>
              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </Link>

          <button className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Export Reports</h3>
                <p className="text-sm text-blue-100">Download complaint data</p>
              </div>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Complaints</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({complaints.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({complaints.filter(c => c.status === 'Pending').length})
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'progress'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In Progress ({complaints.filter(c => c.status === 'In Progress').length})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'resolved'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Resolved ({complaints.filter(c => c.status === 'Resolved').length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className={`text-sm font-medium ${getUrgencyColor(complaint.urgency)}`}>
                        {complaint.urgency}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <span>Student: <span className="font-medium text-gray-900">{complaint.student}</span></span>
                      <span>Location: <span className="font-medium text-gray-900">{complaint.hostel} - Room {complaint.room}</span></span>
                      <span>Type: <span className="font-medium text-gray-900">{complaint.facility}</span></span>
                      <span>Date: <span className="font-medium text-gray-900">{new Date(complaint.date).toLocaleDateString()}</span></span>
                    </div>
                    {complaint.assignedTo && (
                      <p className="text-sm text-gray-600 mt-2">
                        Assigned to: <span className="font-medium text-blue-600">{complaint.assignedTo}</span>
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    {!complaint.assignedTo && (
                      <Link
                        href={`/admin/assign/${complaint.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors whitespace-nowrap"
                      >
                        Assign Staff
                      </Link>
                    )}
                    <Link
                      href={`/admin/complaint/${complaint.id}`}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}