'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ComplaintDetails() {
  const params = useParams();
  const router = useRouter();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Mock data - in real app would fetch based on params.id
  const complaint = {
    id: params.id,
    title: 'Broken AC Unit',
    facility: 'Air Conditioning',
    status: 'Resolved',
    urgency: 'High',
    description: 'The air conditioning unit in my room has stopped working completely. It makes a loud noise when turned on but does not cool the room. This has been happening for the past 3 days.',
    location: 'Room 301, Floor 3, Block A',
    date: '2024-11-15',
    estimatedResolution: '2024-11-17',
    assignedTo: 'Ahmad bin Abdullah',
    updates: [
      {
        date: '2024-11-15 10:30 AM',
        status: 'Pending',
        note: 'Complaint received and logged into system'
      },
      {
        date: '2024-11-15 02:00 PM',
        status: 'In Progress',
        note: 'Assigned to maintenance staff. Technician will visit tomorrow.'
      },
      {
        date: '2024-11-16 09:00 AM',
        status: 'In Progress',
        note: 'Technician inspecting AC unit. Parts needed for repair.'
      },
      {
        date: '2024-11-17 11:30 AM',
        status: 'Resolved',
        note: 'AC unit repaired successfully. Compressor replaced and system tested.'
      }
    ]
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

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    alert('Thank you for your feedback!');
    setShowFeedbackForm(false);
    router.push('/student/dashboard');
  };

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
                <Link href="/student/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Complaint Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
                <span className="text-sm text-gray-600">Complaint #{complaint.id}</span>
              </div>
            </div>
            {complaint.status === 'Resolved' && !showFeedbackForm && (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Rate Service
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Facility Type</p>
              <p className="font-medium text-gray-900">{complaint.facility}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgency</p>
              <p className={`font-medium ${
                complaint.urgency === 'High' ? 'text-red-600' :
                complaint.urgency === 'Medium' ? 'text-orange-600' :
                'text-green-600'
              }`}>{complaint.urgency} Priority</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-medium text-gray-900">{complaint.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Submitted On</p>
              <p className="font-medium text-gray-900">{new Date(complaint.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned To</p>
              <p className="font-medium text-gray-900">{complaint.assignedTo}</p>
            </div>
            {complaint.estimatedResolution !== 'TBD' && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Resolution</p>
                <p className="font-medium text-gray-900">{new Date(complaint.estimatedResolution).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Updates</h2>
          <div className="space-y-6">
            {complaint.updates.map((update, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    update.status === 'Resolved' ? 'bg-green-100' :
                    update.status === 'In Progress' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {update.status === 'Resolved' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : update.status === 'In Progress' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  {index < complaint.updates.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(update.status)}`}>
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

        {/* Feedback Form */}
        {showFeedbackForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rate This Service</h2>
            
            {/* Star Rating */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Overall Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Written Feedback */}
            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Share your experience with the service..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}