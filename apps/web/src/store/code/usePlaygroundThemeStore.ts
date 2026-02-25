/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';
import {
    getNextPlaygroundTheme,
    PLAYGROUND_MULTI_THEME_ENABLED,
    PLAYGROUND_THEME_COOKIE_KEY,
    PLAYGROUND_THEME_STORAGE_KEY,
    sanitizePlaygroundTheme,
    type PlaygroundTheme,
} from '@/src/lib/playground-theme';

interface PlaygroundThemeState {
    theme: PlaygroundTheme;
    setTheme: (theme: PlaygroundTheme) => void;
    toggleTheme: () => void;
    isThemeSwitchEnabled: boolean;
}

function readStoredTheme(): PlaygroundTheme {
    if (typeof window === 'undefined') return sanitizePlaygroundTheme(null);

    try {
        const stored = window.localStorage.getItem(PLAYGROUND_THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'legacy' || stored === 'dark') {
            return sanitizePlaygroundTheme(stored);
        }
    } catch {
        // no-op: fallback to default
    }

    const cookieTheme = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${PLAYGROUND_THEME_COOKIE_KEY}=`))
        ?.split('=')[1];
    if (cookieTheme === 'light' || cookieTheme === 'legacy' || cookieTheme === 'dark') {
        return sanitizePlaygroundTheme(cookieTheme);
    }

    const renderedThemeRoot = document.querySelector('.playground-theme');
    if (renderedThemeRoot?.classList.contains('playground-theme-light')) {
        return sanitizePlaygroundTheme('light');
    }
    if (renderedThemeRoot?.classList.contains('playground-theme-legacy')) {
        return sanitizePlaygroundTheme('legacy');
    }
    if (renderedThemeRoot?.classList.contains('playground-theme-dark')) {
        return sanitizePlaygroundTheme('dark');
    }

    return sanitizePlaygroundTheme(null);
}

function writeStoredTheme(theme: PlaygroundTheme) {
    if (typeof window === 'undefined') return;
    const resolvedTheme = sanitizePlaygroundTheme(theme);

    try {
        window.localStorage.setItem(PLAYGROUND_THEME_STORAGE_KEY, resolvedTheme);
    } catch {
        // no-op: cookie below still persists preference
    }

    document.cookie = `${PLAYGROUND_THEME_COOKIE_KEY}=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
}

function applyThemeClasses(theme: PlaygroundTheme) {
    const resolvedTheme = sanitizePlaygroundTheme(theme);
    if (typeof document === 'undefined') return;
    document.body.classList.add('playground-theme');
    document.body.classList.toggle('playground-theme-light', resolvedTheme === 'light');
    document.body.classList.toggle('playground-theme-dark', resolvedTheme === 'dark');
    document.body.classList.toggle('playground-theme-legacy', resolvedTheme === 'legacy');

    const themeRoots = document.querySelectorAll('.playground-theme');
    themeRoots.forEach((root) => {
        root.classList.toggle('playground-theme-light', resolvedTheme === 'light');
        root.classList.toggle('playground-theme-dark', resolvedTheme === 'dark');
        root.classList.toggle('playground-theme-legacy', resolvedTheme === 'legacy');
    });
}

const initialTheme = readStoredTheme();
if (typeof document !== 'undefined') {
    applyThemeClasses(initialTheme);
    writeStoredTheme(initialTheme);
}

export const usePlaygroundThemeStore = create<PlaygroundThemeState>((set, get) => ({
    theme: initialTheme,
    isThemeSwitchEnabled: PLAYGROUND_MULTI_THEME_ENABLED,

    setTheme: (theme) => {
        const nextTheme = sanitizePlaygroundTheme(theme);
        writeStoredTheme(nextTheme);
        applyThemeClasses(nextTheme);
        set({ theme: nextTheme });
    },

    toggleTheme: () => {
        const current = get().theme;
        const nextTheme = getNextPlaygroundTheme(current);
        writeStoredTheme(nextTheme);
        applyThemeClasses(nextTheme);
        set({ theme: nextTheme });
    },
}));
