'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StaffDashboard() {
  const [user] = useState({
    name: 'Ahmad bin Abdullah',
    employeeId: 'STF001',
    specialization: 'Air Conditioning',
    rating: 4.8,
    completedTasks: 28
  });

  const [assignments] = useState([
    {
      id: 1,
      title: 'Broken AC Unit',
      student: 'Ahmad Ibrahim',
      hostel: 'KK3',
      room: '301',
      facility: 'Air Conditioning',
      status: 'In Progress',
      urgency: 'High',
      assignedDate: '2024-11-15',
      description: 'AC unit not cooling properly, making loud noise'
    },
    {
      id: 2,
      title: 'AC Filter Replacement',
      student: 'Fatimah Zahra',
      hostel: 'KK3',
      room: '205',
      facility: 'Air Conditioning',
      status: 'Pending',
      urgency: 'Medium',
      assignedDate: '2024-11-16',
      description: 'Regular maintenance - filter replacement needed'
    },
    {
      id: 3,
      title: 'AC Not Turning On',
      student: 'Muhammad Ali',
      hostel: 'KK2',
      room: '102',
      facility: 'Air Conditioning',
      status: 'Pending',
      urgency: 'High',
      assignedDate: '2024-11-16',
      description: 'AC unit completely non-functional'
    }
  ]);

  const [completedTasks] = useState([
    {
      id: 4,
      title: 'AC Thermostat Repair',
      student: 'Nurul Ain',
      hostel: 'KK1',
      room: '408',
      completedDate: '2024-11-14',
      rating: 5
    },
    {
      id: 5,
      title: 'AC Compressor Replacement',
      student: 'Hassan Yusuf',
      hostel: 'KK4',
      room: '201',
      completedDate: '2024-11-12',
      rating: 5
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
                Desafix Staff
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/staff/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </Link>
                <Link href="/staff/tasks" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Tasks
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100">
            {user.specialization} Specialist • Employee ID: {user.employeeId}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-blue-600">
                  {assignments.filter(a => a.status === 'In Progress' || a.status === 'Pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{user.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-600">{user.rating}</p>
                  <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Urgent Tasks</p>
                <p className="text-3xl font-bold text-red-600">
                  {assignments.filter(a => a.urgency === 'High').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-sm font-medium ${getUrgencyColor(task.urgency)}`}>
                        {task.urgency} Priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <span>Student: <span className="font-medium text-gray-900">{task.student}</span></span>
                      <span>Location: <span className="font-medium text-gray-900">{task.hostel} - Room {task.room}</span></span>
                      <span>Assigned: <span className="font-medium text-gray-900">{new Date(task.assignedDate).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  <Link
                    href={`/staff/task/${task.id}`}
                    className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
                  >
                    Update Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Student: <span className="font-medium text-gray-900">{task.student}</span></span>
                      <span>Location: <span className="font-medium text-gray-900">{task.hostel} - Room {task.room}</span></span>
                      <span>Completed: <span className="font-medium text-gray-900">{new Date(task.completedDate).toLocaleDateString()}</span></span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-medium text-gray-900">{task.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}