import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const protectedRoutes = ['/student', '/admin', '/staff'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and trying to access login/register, redirect to appropriate dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (user?.role === 'student') {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    } else if (user?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } else if (user?.role === 'staff') {
      return NextResponse.redirect(new URL('/staff/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/staff/:path*', '/login', '/register'],
};