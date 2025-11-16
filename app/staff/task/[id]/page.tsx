'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function StaffTaskUpdate() {
  const params = useParams();
  const router = useRouter();
  
  const [task] = useState({
    id: params.id,
    title: 'Broken AC Unit',
    student: 'Ahmad Ibrahim',
    hostel: 'KK3',
    room: '301',
    facility: 'Air Conditioning',
    status: 'In Progress',
    urgency: 'High',
    assignedDate: '2024-11-15',
    description: 'The air conditioning unit in my room has stopped working completely. It makes a loud noise when turned on but does not cool the room. This has been happening for the past 3 days.',
    updates: [
      {
        date: '2024-11-15 10:30 AM',
        status: 'Pending',
        note: 'Task assigned to maintenance staff'
      },
      {
        date: '2024-11-15 02:00 PM',
        status: 'In Progress',
        note: 'Acknowledged. Will visit location tomorrow morning.'
      }
    ]
  });

  const [newStatus, setNewStatus] = useState(task.status);
  const [progressNote, setProgressNote] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!progressNote.trim()) {
      alert('Please add a progress note');
      return;
    }

    alert(`Status updated to: ${newStatus}`);
    router.push('/staff/dashboard');
  };

  const handleMarkComplete = () => {
    if (!progressNote.trim()) {
      alert('Please add completion notes');
      return;
    }
    
    alert('Task marked as completed!');
    router.push('/staff/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Desafix Staff
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/staff/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/staff/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
                <span className={`text-sm font-medium ${
                  task.urgency === 'High' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {task.urgency} Priority
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Student</p>
              <p className="font-medium text-gray-900">{task.student}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-medium text-gray-900">{task.hostel} - Room {task.room}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Facility Type</p>
              <p className="font-medium text-gray-900">{task.facility}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned Date</p>
              <p className="font-medium text-gray-900">{new Date(task.assignedDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>
        </div>

        {/* Update Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Progress</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setNewStatus('Pending')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    newStatus === 'Pending'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setNewStatus('In Progress')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    newStatus === 'In Progress'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setNewStatus('Halted')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    newStatus === 'Halted'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Halted
                </button>
              </div>
            </div>

            {/* Progress Notes */}
            <div>
              <label htmlFor="progressNote" className="block text-sm font-medium text-gray-700 mb-2">
                Progress Notes *
              </label>
              <textarea
                id="progressNote"
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Describe what has been done, any issues encountered, or next steps..."
              />
            </div>

            {/* Estimated Completion Time */}
            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Completion Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Update Progress
              </button>
              <button
                type="button"
                onClick={handleMarkComplete}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Mark as Completed
              </button>
            </div>
          </form>
        </div>

        {/* Update History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Update History</h2>
          <div className="space-y-6">
            {task.updates.map((update, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    update.status === 'In Progress' ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}>
                    {update.status === 'In Progress' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  {index < task.updates.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      update.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {update.status}
                    </span>
                    <span className="text-sm text-gray-600">{update.date}</span>
                  </div>
                  <p className="text-gray-700">{update.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}