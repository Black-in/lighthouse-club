/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

function parseBooleanFlag(value: string | undefined): boolean | null {
    if (!value) return null;
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return null;
}

function resolveEnvDrivenDevAccessMode() {
    const explicitDevMode = parseBooleanFlag(process.env.NEXT_PUBLIC_DEV_ACCESS_MODE);
    if (explicitDevMode === true) return true;

    const explicitSkipAuth = parseBooleanFlag(process.env.NEXT_PUBLIC_SKIP_AUTH);
    if (explicitSkipAuth === true) return true;

    return false;
}

export function shouldEnableDevAccessServer(_hostname?: string) {
    if (process.env.NODE_ENV !== 'production') return true;
    return resolveEnvDrivenDevAccessMode();
}

export function shouldEnableDevAccessClient() {
    if (process.env.NODE_ENV !== 'production') return true;
    return resolveEnvDrivenDevAccessMode();
}
