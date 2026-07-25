import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl

  // Protect all control-panel routes except /control-panel/login
  if (pathname.startsWith('/control-panel') && pathname !== '/control-panel/login') {
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/control-panel/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/control-panel/:path*'],
}
