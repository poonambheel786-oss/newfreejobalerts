import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = request.cookies.get('admin_session_secure')?.value

  const isControlPanel = path.startsWith('/control-panel')
  const isLoginPage = path === '/control-panel/login'

  if (isControlPanel) {
    // If trying to access control panel pages (other than login) without auth
    if (!isLoginPage && session !== 'authenticated') {
      const loginUrl = new URL('/control-panel/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If trying to access login page while already authenticated
    if (isLoginPage && session === 'authenticated') {
      const dashboardUrl = new URL('/control-panel/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/control-panel/:path*']
}
