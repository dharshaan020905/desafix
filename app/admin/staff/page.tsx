'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StaffManagement() {
  const [staff] = useState([
    {
      id: 1,
      name: 'Ahmad bin Abdullah',
      specialization: 'Air Conditioning',
      activeComplaints: 3,
      completedComplaints: 28,
      avgRating: 4.8,
      avgResponseTime: '2.1 hrs',
      avgCompletionTime: '16 hrs',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Hassan Mahmoud',
      specialization: 'Electrical',
      activeComplaints: 2,
      completedComplaints: 32,
      avgRating: 4.9,
      avgResponseTime: '1.8 hrs',
      avgCompletionTime: '14 hrs',
      status: 'Busy'
    },
    {
      id: 3,
      name: 'Ali Rahman',
      specialization: 'Plumbing',
      activeComplaints: 4,
      completedComplaints: 25,
      avgRating: 4.5,
      avgResponseTime: '2.5 hrs',
      avgCompletionTime: '18 hrs',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Omar Yusuf',
      specialization: 'General Maintenance',
      activeComplaints: 1,
      completedComplaints: 20,
      avgRating: 4.7,
      avgResponseTime: '2.2 hrs',
      avgCompletionTime: '15 hrs',
      status: 'Available'
    },
    {
      id: 5,
      name: 'Khalid Ibrahim',
      specialization: 'Furniture & Doors',
      activeComplaints: 2,
      completedComplaints: 18,
      avgRating: 4.6,
      avgResponseTime: '2.4 hrs',
      avgCompletionTime: '17 hrs',
      status: 'Available'
    }
  ]);

  // Sort staff by performance score (combination of rating and completion rate)
  const leaderboard = [...staff].sort((a, b) => {
    const scoreA = (a.avgRating * 10) + (a.completedComplaints / 10);
    const scoreB = (b.avgRating * 10) + (b.completedComplaints / 10);
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Desafix Admin
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/staff" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
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
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Monitor staff performance and manage assignments</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Staff Leaderboard</h2>
              </div>
              <div className="space-y-4">
                {leaderboard.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{member.avgRating}</span>
                        </div>
                        <span className="text-sm text-gray-500">• {member.completedComplaints} completed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staff List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">All Staff Members</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Add New Staff
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {staff.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Specialization: <span className="font-medium text-gray-900">{member.specialization}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Active Tasks</p>
                        <p className="text-xl font-bold text-blue-600">{member.activeComplaints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Completed</p>
                        <p className="text-xl font-bold text-green-600">{member.completedComplaints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Avg Rating</p>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <p className="text-xl font-bold text-gray-900">{member.avgRating}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Response Time</p>
                        <p className="text-lg font-semibold text-gray-900">{member.avgResponseTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/staff/${member.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                        Assign Task
                      </button>
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