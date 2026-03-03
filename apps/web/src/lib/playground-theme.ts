/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export type PlaygroundTheme = 'dark' | 'light' | 'legacy';

export const PLAYGROUND_THEME_STORAGE_KEY = 'blackin.playground.theme';
export const PLAYGROUND_THEME_COOKIE_KEY = 'blackin_playground_theme';

// Keep this false for now: playground ships in a single locked theme.
// Turn true later to re-enable multi-theme switching across UI.
export const PLAYGROUND_MULTI_THEME_ENABLED = false;

export const PLAYGROUND_DEFAULT_THEME: PlaygroundTheme = 'legacy';

export function sanitizePlaygroundTheme(
    theme: string | null | undefined,
): PlaygroundTheme {
    const normalized: PlaygroundTheme =
        theme === 'light' || theme === 'legacy' || theme === 'dark'
            ? theme
            : PLAYGROUND_DEFAULT_THEME;

    if (!PLAYGROUND_MULTI_THEME_ENABLED) return PLAYGROUND_DEFAULT_THEME;
    return normalized;
}

export function getNextPlaygroundTheme(current: PlaygroundTheme): PlaygroundTheme {
    if (!PLAYGROUND_MULTI_THEME_ENABLED) return PLAYGROUND_DEFAULT_THEME;
    return current === 'light' ? 'dark' : current === 'dark' ? 'legacy' : 'light';
}

export function getPlaygroundThemeRootClass(theme: PlaygroundTheme): string {
    if (theme === 'light') return 'playground-theme-light';
    if (theme === 'legacy') return 'playground-theme-legacy';
    return 'playground-theme-dark';
}

export function getPlaygroundThemeBackgroundClass(theme: PlaygroundTheme): string {
    if (theme === 'light') return 'bg-[#edf2f9]';
    if (theme === 'legacy') return 'bg-black';
    return 'bg-[#141212]';
}
