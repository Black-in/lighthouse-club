/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { TerminalSocketData } from '@lighthouse/types';

export interface Line {
    type: 'command' | TerminalSocketData | 'client' | 'error' | 'unknown';
    text: string;
}

export interface TerminalTab {
    id: string;
    name: string;
    logs: Line[];
    input: string;
}
