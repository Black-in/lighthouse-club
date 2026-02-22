/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const host = request.nextUrl.hostname;
    const isLocalHost =
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '::1' ||
        host.endsWith('.local');
    const skipAuth =
        process.env.NODE_ENV !== 'production' ||
        process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' ||
        isLocalHost;
    const isPlaygroundRoute = request.nextUrl.pathname.startsWith('/playground');

    // Allow unauthenticated playground access in local/dev environments.
    if (skipAuth && isPlaygroundRoute) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/playground/:path*', '/home'],
};
