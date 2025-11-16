'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7days');

  const stats = {
    totalComplaints: 124,
    resolved: 85,
    avgResolutionTime: '16.5 hrs',
    studentSatisfaction: 4.6,
    completionRate: 68.5,
    responseRate: 92.3
  };

  const facilityBreakdown = [
    { type: 'Air Conditioning', count: 32, percentage: 25.8 },
    { type: 'Plumbing', count: 28, percentage: 22.6 },
    { type: 'Electrical', count: 24, percentage: 19.4 },
    { type: 'Furniture', count: 18, percentage: 14.5 },
    { type: 'Door/Window', count: 12, percentage: 9.7 },
    { type: 'Other', count: 10, percentage: 8.0 }
  ];

  const hostelData = [
    { name: 'KK1', complaints: 22, resolved: 18, pending: 2, inProgress: 2 },
    { name: 'KK2', complaints: 20, resolved: 14, pending: 3, inProgress: 3 },
    { name: 'KK3', complaints: 25, resolved: 19, pending: 3, inProgress: 3 },
    { name: 'KK4', complaints: 18, resolved: 12, pending: 2, inProgress: 4 },
    { name: 'KK5', complaints: 15, resolved: 10, pending: 2, inProgress: 3 },
    { name: 'KK6', complaints: 12, resolved: 8, pending: 2, inProgress: 2 },
    { name: 'KK7', complaints: 8, resolved: 3, pending: 3, inProgress: 2 },
    { name: 'KK8', complaints: 4, resolved: 1, pending: 1, inProgress: 2 }
  ];

  const weeklyTrend = [
    { day: 'Mon', complaints: 18 },
    { day: 'Tue', complaints: 22 },
    { day: 'Wed', complaints: 15 },
    { day: 'Thu', complaints: 25 },
    { day: 'Fri', complaints: 20 },
    { day: 'Sat', complaints: 12 },
    { day: 'Sun', complaints: 12 }
  ];

  const maxComplaints = Math.max(...weeklyTrend.map(d => d.complaints));

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
                <Link href="/admin/staff" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Staff Management
                </Link>
                <Link href="/admin/analytics" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
              <p className="text-gray-600">Comprehensive insights and metrics</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Complaints</p>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalComplaints}</p>
            <p className="text-sm text-green-600">↑ 12% from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.completionRate}%</p>
            <p className="text-sm text-green-600">↑ 5% from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.avgResolutionTime}</p>
            <p className="text-sm text-green-600">↓ 2.5 hrs from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Student Satisfaction</p>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.studentSatisfaction}/5</p>
            <p className="text-sm text-green-600">↑ 0.2 from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Response Rate</p>
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.responseRate}%</p>
            <p className="text-sm text-green-600">↑ 3% from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Resolved Complaints</p>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.resolved}</p>
            <p className="text-sm text-green-600">↑ 18 from last period</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Complaint Trend</h2>
            <div className="space-y-4">
              {weeklyTrend.map((data) => (
                <div key={data.day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{data.day}</span>
                    <span className="text-sm font-semibold text-gray-900">{data.complaints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${(data.complaints / maxComplaints) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facility Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complaints by Facility Type</h2>
            <div className="space-y-4">
              {facilityBreakdown.map((facility, index) => (
                <div key={facility.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{facility.type}</span>
                    <span className="text-sm font-semibold text-gray-900">{facility.count} ({facility.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-green-600' :
                        index === 2 ? 'bg-yellow-600' :
                        index === 3 ? 'bg-purple-600' :
                        index === 4 ? 'bg-pink-600' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${facility.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hostel Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Hostel Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hostelData.map((hostel) => {
                  const completionRate = ((hostel.resolved / hostel.complaints) * 100).toFixed(1);
                  return (
                    <tr key={hostel.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{hostel.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{hostel.complaints}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">{hostel.resolved}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600 font-medium">{hostel.inProgress}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-yellow-600 font-medium">{hostel.pending}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}