import { NextResponse } from 'next/server'
 export { default } from "next-auth/middleware"
 import { getToken } from "next-auth/jwt"

export async function middleware(request) {
    const token = await getToken(request)
    const url = request.nextUrl

    if (token && 
        (
            url.pathname.startswith('/sign-in') ||
            url.pathname.startswith('/sign-up') ||
            url.pathname.startswith('/verify') ||
            url.pathname.startswith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
}

export const config = {
  matcher:[ 
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
]
}