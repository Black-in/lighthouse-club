/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { MODEL } from '@lighthouse/types';
import { MODEL_CAPABILITIES_URL } from '@/routes/api_routes';
import { shouldEnableDevAccessClient } from './runtime-mode';
import { QWEN_MODEL_OPTION } from './byok-model';

export const OPENAI_MODEL_OPTION = 'OpenAI GPT-5.4' as const;
export const GEMINI_MODEL_OPTION = 'Gemini 3.1 Pro' as const;

export const MODEL_OPTIONS = [
    'Auto Select',
    OPENAI_MODEL_OPTION,
    QWEN_MODEL_OPTION,
    'Claude Sonnet 4.6',
    GEMINI_MODEL_OPTION,
    'Claude Opus 4.6',
] as const;

export type ModelOption = (typeof MODEL_OPTIONS)[number];

export const DEFAULT_MODEL_OPTION: ModelOption = 'Auto Select';

interface ModelCapabilitiesResponse {
    data?: {
        preferredModel?: MODEL;
    };
}

let cachedDevelopmentDefaultModel: ModelOption | null = null;

export function isProModelOption(model: string): boolean {
    return (
        (model.includes('Claude') || model.includes('Gemini') || model.includes('OpenAI')) &&
        model !== QWEN_MODEL_OPTION
    );
}

export function isByokModelOption(model: string): boolean {
    return model === QWEN_MODEL_OPTION;
}

export function mapModelOptionToEnum(model: ModelOption): MODEL {
    switch (model) {
        case OPENAI_MODEL_OPTION:
            return MODEL.OPENAI_GPT_5_3;
        case QWEN_MODEL_OPTION:
            return MODEL.QWEN_BYOK;
        case 'Claude Sonnet 4.6':
        case 'Claude Opus 4.6':
            return MODEL.CLAUDE;
        case GEMINI_MODEL_OPTION:
        case 'Auto Select':
        default:
            return MODEL.GEMINI;
    }
}

export function mapEnumToModelOption(model: MODEL): ModelOption {
    switch (model) {
        case MODEL.OPENAI_GPT_5_3:
            return OPENAI_MODEL_OPTION;
        case MODEL.QWEN_BYOK:
            return QWEN_MODEL_OPTION;
        case MODEL.CLAUDE:
            return 'Claude Sonnet 4.6';
        case MODEL.GEMINI:
        default:
            return DEFAULT_MODEL_OPTION;
    }
}

function mapEnumToPreferredModelOption(model: MODEL | undefined): ModelOption {
    switch (model) {
        case MODEL.OPENAI_GPT_5_3:
            return OPENAI_MODEL_OPTION;
        case MODEL.QWEN_BYOK:
            return QWEN_MODEL_OPTION;
        case MODEL.CLAUDE:
            return 'Claude Sonnet 4.6';
        case MODEL.GEMINI:
            return GEMINI_MODEL_OPTION;
        default:
            return DEFAULT_MODEL_OPTION;
    }
}

export async function getDevelopmentDefaultModelOption(): Promise<ModelOption> {
    if (!shouldEnableDevAccessClient()) return DEFAULT_MODEL_OPTION;
    if (cachedDevelopmentDefaultModel) return cachedDevelopmentDefaultModel;

    try {
        const response = await fetch(MODEL_CAPABILITIES_URL, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch model capabilities: ${response.status}`);
        }

        const payload = (await response.json()) as ModelCapabilitiesResponse;
        cachedDevelopmentDefaultModel = mapEnumToPreferredModelOption(payload.data?.preferredModel);
        return cachedDevelopmentDefaultModel;
    } catch (error) {
        console.warn('Falling back to default model option in development.', error);
        cachedDevelopmentDefaultModel = DEFAULT_MODEL_OPTION;
        return cachedDevelopmentDefaultModel;
    }
}
