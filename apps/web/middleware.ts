/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { NextRequest, NextResponse } from 'next/server';
import { shouldEnableDevAccessServer } from './src/lib/runtime-mode';

export async function middleware(request: NextRequest) {
    const skipAuth = shouldEnableDevAccessServer(request.nextUrl.hostname);

    // In dev access mode, allow all matched routes without auth.
    if (skipAuth) {
        return NextResponse.next();
    }

    const token = request.cookies.get('blackin_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/playground/:path*', '/home'],
};
