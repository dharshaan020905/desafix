'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    hostel: '',
    roomNumber: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hostels = [
    'KK1 - Kolej Kediaman Pertama',
    'KK2 - Kolej Kediaman Kedua',
    'KK3 - Kolej Kediaman Ketiga',
    'KK4 - Kolej Kediaman Keempat',
    'KK5 - Kolej Kediaman Kelima',
    'KK6 - Kolej Kediaman Keenam',
    'KK7 - Kolej Kediaman Ketujuh',
    'KK8 - Kolej Kediaman Kelapan'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.matricNumber.trim()) {
      newErrors.matricNumber = 'Matric number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.hostel) {
      newErrors.hostel = 'Please select a hostel';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulating registration success
      alert('Registration successful! Redirecting to login...');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-blue-600">Desafix</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create Account</h1>
          <p className="text-gray-600 mt-2">Register to start reporting facility issues</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Matric Number */}
            <div>
              <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Matric Number
              </label>
              <input
                type="text"
                id="matricNumber"
                name="matricNumber"
                value={formData.matricNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.matricNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., A12345678"
              />
              {errors.matricNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.matricNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 0123456789"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Hostel */}
            <div>
              <label htmlFor="hostel" className="block text-sm font-medium text-gray-700 mb-1">
                Hostel
              </label>
              <select
                id="hostel"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.hostel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your hostel</option>
                {hostels.map((hostel) => (
                  <option key={hostel} value={hostel}>
                    {hostel}
                  </option>
                ))}
              </select>
              {errors.hostel && (
                <p className="mt-1 text-sm text-red-600">{errors.hostel}</p>
              )}
            </div>

            {/* Room Number */}
            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 201"
              />
              {errors.roomNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm hover:shadow-md"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}