'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { profile, authLoading } = useAuth();
  const router = useRouter();

  // // Auto-redirect if already logged in
  // useEffect(() => {
  //   if (profile) {
  //     switch (profile.role) {
  //       case 'student':
  //         router.push('/student/dashboard');
  //         break;
  //       case 'staff':
  //         router.push('/staff/dashboard');
  //         break;
  //       case 'admin':
  //         router.push('/admin/dashboard');
  //         break;
  //     }
  //   }
  // }, [profile, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Auto-redirect if already logged in
useEffect(() => {
  if (authLoading) {
    console.log('Landing: Auth still loading...');
    return;
  }

  if (profile?.id) {
    console.log('Landing: Profile exists, redirecting to:', profile.role);
    switch (profile.role) {
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'staff':
        router.push('/staff/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
    }
  } else {
    console.log('Landing: No profile, staying on landing page');
  }
}, [profile, authLoading, router]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>
        <div 
          className="absolute inset-0 opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 50%)`,
          }}
        ></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur opacity-40 group-hover:opacity-60 transition-all"></div>
                <span className="relative text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DesaFix
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-all hover:scale-105"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="group relative px-6 py-2.5 font-semibold overflow-hidden rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                <span className="relative text-white">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm mb-8" style={{animation: 'fadeIn 1s ease'}}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Seamless Hostel Facility Management</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent" style={{backgroundSize: '200% 200%', animation: 'gradient 3s ease infinite'}}>
                DesaFix
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{backgroundSize: '200% 200%', animation: 'gradient 5s ease infinite'}}>
                Universiti Sains Malaysia
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Report issues instantly, track repairs in real-time, and enjoy a seamless living experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/register" 
                className="group relative px-8 py-4 font-bold text-lg overflow-hidden rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                <span className="relative text-white flex items-center gap-2">
                  Start Reporting Issues
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/login" 
                className="px-8 py-4 font-bold text-lg bg-white/60 backdrop-blur-sm text-gray-900 border-2 border-gray-300 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105 shadow-sm hover:shadow-md"
              >
                Already Have An Account?
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              {[
                { number: '500+', label: 'Active Users' },
                { number: '98%', label: 'Satisfaction Rate' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:via-indigo-50/50 group-hover:to-purple-50/50 rounded-2xl transition-all"></div>
                    <div className="relative">
                      <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        {stat.number}
                      </p>
                      <p className="text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Built for Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage hostel facilities efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'Submit complaints in seconds with our intuitive interface and instant notifications.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Real-Time Tracking',
                description: 'Monitor every complaint from submission to resolution with live updates.',
                gradient: 'from-indigo-500 to-purple-500',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: 'Quality Assured',
                description: 'Rate services and provide feedback to maintain high-quality standards.',
                gradient: 'from-amber-500 to-orange-500',
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-all blur-2xl -z-10`}></div>
                
                <div className="relative h-full p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-sm`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Can Use Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                One Platform, All Roles
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Single login, automatic access to your personalized dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Students',
                description: 'Submit and track your complaints with photos, get real-time updates, and rate resolved issues.',
                icon: '🎓',
                gradient: 'from-emerald-500 to-teal-500',
                features: ['Submit Complaints', 'Track Status', 'Rate Services']
              },
              {
                title: 'Staff',
                description: 'View assigned tasks, update progress, and manage your workload efficiently.',
                icon: '🔧',
                gradient: 'from-blue-500 to-indigo-500',
                features: ['View Assignments', 'Update Progress', 'Track Performance']
              },
              {
                title: 'Admins',
                description: 'Oversee all operations, assign tasks to staff, and monitor performance analytics.',
                icon: '👨‍💼',
                gradient: 'from-purple-500 to-pink-500',
                features: ['Assign Tasks', 'Monitor All', 'View Analytics']
              }
            ].map((userType, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${userType.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all`}></div>
                
                <div className="relative h-full p-10 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:scale-105">
                  <div className="text-6xl mb-6">{userType.icon}</div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">{userType.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{userType.description}</p>
                  
                  <ul className="space-y-2">
                    {userType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Single Login CTA */}
          {/* <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                ✨ Smart Login System
              </p>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Simply sign in with your credentials and you'll be automatically directed to your personalized dashboard based on your role
              </p>
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-sm"
              >
                Sign In Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div> */}
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" style={{backgroundSize: '400% 400%', animation: 'gradientXY 8s ease infinite'}}></div>
            <div className="absolute inset-0 bg-white/10"></div>
            
            <div className="relative px-8 py-20 text-center">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                Ready for Instant <br className="hidden md:block" />And Easy Fixes?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join hundreds of students already enjoying hassle-free facility management
              </p>
              
              <Link 
                href="/register" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:scale-105 transition-all hover:shadow-2xl"
              >
                Create Your Account
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DesaFix
            </div>
            <p className="text-gray-600">© 2025 DesaFix. Crafted with passion.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <a key={link} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gradientXY {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}