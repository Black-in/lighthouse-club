/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { MODEL } from '@lighthouse/types';

export const MODEL_OPTIONS = [
    'Auto Select',
    'OpenAI GPT 5.3 Codex',
    'Claude Sonnet 4.6',
    'Gemini 3.1 Pro',
    'Claude Opus 4.6',
] as const;

export type ModelOption = (typeof MODEL_OPTIONS)[number];

export const DEFAULT_MODEL_OPTION: ModelOption = 'Auto Select';

export function isProModelOption(model: string): boolean {
    return model.includes('Claude') || model.includes('Gemini');
}

export function mapModelOptionToEnum(model: ModelOption): MODEL {
    switch (model) {
        case 'OpenAI GPT 5.3 Codex':
            return MODEL.OPENAI_GPT_5_3;
        case 'Claude Sonnet 4.6':
        case 'Claude Opus 4.6':
            return MODEL.CLAUDE;
        case 'Gemini 3.1 Pro':
        case 'Auto Select':
        default:
            return MODEL.GEMINI;
    }
}

export function mapEnumToModelOption(model: MODEL): ModelOption {
    switch (model) {
        case MODEL.OPENAI_GPT_5_3:
            return 'OpenAI GPT 5.3 Codex';
        case MODEL.CLAUDE:
            return 'Claude Sonnet 4.6';
        case MODEL.GEMINI:
        default:
            return DEFAULT_MODEL_OPTION;
    }
}
