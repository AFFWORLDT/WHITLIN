import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Get the token from cookies or headers
    const token = request.cookies.get('keragold_user')?.value
    
    if (!token) {
      // Redirect to login page with redirect parameter
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    try {
      // Parse the user data from the token
      const userData = JSON.parse(token)
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        // Redirect to login page
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
