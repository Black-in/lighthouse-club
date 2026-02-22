/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export function shouldSkipAuthClient() {
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
        return true;
    }

    if (typeof window === 'undefined') {
        return false;
    }

    const host = window.location.hostname;
    return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '::1' ||
        host.endsWith('.local')
    );
}

