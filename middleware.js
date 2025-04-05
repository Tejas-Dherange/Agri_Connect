import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
    pathname.startsWith('/marketplace') || 
    pathname.startsWith('/pest-alerts') ||
    pathname.startsWith('/weather')

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Handle role-based access
  if (isAuthenticated && pathname.startsWith("/dashboard")) {
    const userRole = token.role

    // Check if user is accessing the correct dashboard
    if (pathname.startsWith("/dashboard/farmer") && userRole !== "farmer") {
      return NextResponse.redirect(new URL("/dashboard/expert", request.url))
    }

    if (pathname.startsWith("/dashboard/expert") && userRole !== "expert") {
      return NextResponse.redirect(new URL("/dashboard/farmer", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/marketplace/:path*", "/pest-alerts/:path*", "/weather/:path*"],
}

