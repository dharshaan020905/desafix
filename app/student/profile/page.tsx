'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StudentProfile() {
  const [user] = useState({
    name: 'Ahmad Ibrahim',
    matricNumber: 'A12345678',
    email: 'ahmad.ibrahim@student.edu.my',
    phone: '0123456789',
    hostel: 'KK3 - Kolej Kediaman Ketiga',
    room: '301',
    joinDate: '2024-09-01'
  });

  const [stats] = useState({
    totalComplaints: 5,
    resolved: 3,
    pending: 1,
    inProgress: 1,
    averageRating: 4.5
  });

  const [complaintHistory] = useState([
    {
      id: 1,
      title: 'Broken AC Unit',
      status: 'Resolved',
      date: '2024-11-15',
      rating: 5
    },
    {
      id: 2,
      title: 'Leaking Faucet',
      status: 'Pending',
      date: '2024-11-14',
      rating: null
    },
    {
      id: 3,
      title: 'Light Bulb Not Working',
      status: 'Resolved',
      date: '2024-11-10',
      rating: 4
    },
    {
      id: 4,
      title: 'Door Lock Issue',
      status: 'Resolved',
      date: '2024-11-05',
      rating: 5
    },
    {
      id: 5,
      title: 'Wi-Fi Connection Problem',
      status: 'In Progress',
      date: '2024-11-01',
      rating: null
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Desafix
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/student/submit-complaint" className="text-gray-600 hover:text-gray-900 transition-colors">
                  New Complaint
                </Link>
                <Link href="/student/profile" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Profile
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.matricNumber}</p>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hostel</p>
                  <p className="font-medium text-gray-900">{user.hostel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Room Number</p>
                  <p className="font-medium text-gray-900">{user.room}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats and History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.totalComplaints}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Complaints</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                  <p className="text-sm text-gray-600 mt-1">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                  <p className="text-sm text-gray-600 mt-1">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600 mt-1">Pending</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Service Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= stats.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.averageRating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Complaint History</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {complaintHistory.map((complaint) => (
                  <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{new Date(complaint.date).toLocaleDateString()}</span>
                          {complaint.rating && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="font-medium">{complaint.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/student/complaint/${complaint.id}`}
                        className="ml-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}