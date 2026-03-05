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
    if (explicitDevMode !== null) return explicitDevMode;

    const explicitSkipAuth = parseBooleanFlag(process.env.NEXT_PUBLIC_SKIP_AUTH);
    if (explicitSkipAuth !== null) return explicitSkipAuth;

    return null;
}

export function shouldEnableDevAccessServer(_hostname?: string) {
    const envDecision = resolveEnvDrivenDevAccessMode();
    if (envDecision !== null) return envDecision;
    return process.env.NODE_ENV !== 'production';
}

export function shouldEnableDevAccessClient() {
    const envDecision = resolveEnvDrivenDevAccessMode();
    if (envDecision !== null) return envDecision;
    return process.env.NODE_ENV !== 'production';
}
