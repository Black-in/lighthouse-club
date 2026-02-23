/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { shouldEnableDevAccessClient } from './runtime-mode';

export function shouldSkipAuthClient() {
    return shouldEnableDevAccessClient();
}
