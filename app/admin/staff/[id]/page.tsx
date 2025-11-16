'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function StaffDetail() {
  const params = useParams();
  
  // Mock data - in real app would fetch based on params.id
  const [staffMember] = useState({
    id: params.id,
    name: 'Ahmad bin Abdullah',
    employeeId: 'STF001',
    specialization: 'Air Conditioning',
    email: 'ahmad.abdullah@desafix.com',
    phone: '0123456789',
    joinDate: '2024-01-15',
    status: 'Available',
    activeComplaints: 3,
    completedComplaints: 28,
    avgRating: 4.8,
    avgResponseTime: '2.1 hrs',
    avgCompletionTime: '16 hrs',
    completionRate: 93.3
  });

  const [activeAssignments] = useState([
    {
      id: 1,
      title: 'Broken AC Unit',
      student: 'Ahmad Ibrahim',
      hostel: 'KK3',
      room: '301',
      status: 'In Progress',
      urgency: 'High',
      assignedDate: '2024-11-15'
    },
    {
      id: 2,
      title: 'AC Filter Replacement',
      student: 'Fatimah Zahra',
      hostel: 'KK3',
      room: '205',
      status: 'Pending',
      urgency: 'Medium',
      assignedDate: '2024-11-16'
    },
    {
      id: 3,
      title: 'AC Not Turning On',
      student: 'Muhammad Ali',
      hostel: 'KK2',
      room: '102',
      status: 'In Progress',
      urgency: 'High',
      assignedDate: '2024-11-16'
    }
  ]);

  const [recentCompletions] = useState([
    {
      id: 4,
      title: 'AC Thermostat Repair',
      student: 'Nurul Ain',
      hostel: 'KK1',
      room: '408',
      completedDate: '2024-11-14',
      completionTime: '14 hrs',
      rating: 5,
      feedback: 'Excellent work! Very professional and quick.'
    },
    {
      id: 5,
      title: 'AC Compressor Replacement',
      student: 'Hassan Yusuf',
      hostel: 'KK4',
      room: '201',
      completedDate: '2024-11-12',
      completionTime: '18 hrs',
      rating: 5,
      feedback: 'Great service, AC working perfectly now.'
    },
    {
      id: 6,
      title: 'AC Duct Cleaning',
      student: 'Aisha Mohammed',
      hostel: 'KK2',
      room: '305',
      completedDate: '2024-11-10',
      completionTime: '12 hrs',
      rating: 4,
      feedback: 'Good work, but took a bit longer than expected.'
    }
  ]);

  const [performanceHistory] = useState([
    { month: 'October 2024', completed: 32, avgRating: 4.9, avgTime: '15 hrs' },
    { month: 'September 2024', completed: 28, avgRating: 4.8, avgTime: '16 hrs' },
    { month: 'August 2024', completed: 25, avgRating: 4.7, avgTime: '17 hrs' },
    { month: 'July 2024', completed: 30, avgRating: 4.8, avgTime: '16 hrs' }
  ]);

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
        <div className="mb-6">
          <Link href="/admin/staff" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Staff Management
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Staff Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{staffMember.name}</h2>
                <p className="text-gray-600">{staffMember.employeeId}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                  staffMember.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {staffMember.status}
                </span>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Specialization</p>
                  <p className="font-medium text-gray-900">{staffMember.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{staffMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{staffMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Join Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(staffMember.joinDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors mb-2">
                  Assign New Task
                </button>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-semibold text-gray-900">{staffMember.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${staffMember.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= staffMember.avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{staffMember.avgRating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                  <p className="font-semibold text-gray-900">{staffMember.avgResponseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Completion Time</p>
                  <p className="font-semibold text-gray-900">{staffMember.avgCompletionTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{staffMember.activeComplaints}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{staffMember.completedComplaints}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-600">{staffMember.avgRating}</p>
                  <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Assignments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Active Assignments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {activeAssignments.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className={`text-sm font-medium ${
                            task.urgency === 'High' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Student: <span className="font-medium text-gray-900">{task.student}</span></span>
                          <span>Location: <span className="font-medium text-gray-900">{task.hostel} - Room {task.room}</span></span>
                          <span>Assigned: <span className="font-medium text-gray-900">{new Date(task.assignedDate).toLocaleDateString()}</span></span>
                        </div>
                      </div>
                      <Link
                        href={`/admin/complaint/${task.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Completions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Recent Completions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentCompletions.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{task.student}</span>
                          <span>{task.hostel} - Room {task.room}</span>
                          <span>Completed: {new Date(task.completedDate).toLocaleDateString()}</span>
                          <span>Time: {task.completionTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{task.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{task.feedback}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Performance History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {performanceHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.completed}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-gray-900">{record.avgRating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}