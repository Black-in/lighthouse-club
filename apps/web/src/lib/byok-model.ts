import { MODEL } from '@lighthouse/types';

export const QWEN_MODEL_OPTION = 'Qwen3.5-27B-AWQ-4bit' as const;
const QWEN_BYOK_STORAGE_KEY = 'blackin.qwen.byok';

export interface ByokModelConfig {
    provider: 'openai_compatible';
    model: string;
    apiKey: string;
    baseURL?: string;
}

export function isByokModelEnum(model: MODEL) {
    return model === MODEL.QWEN_BYOK;
}

export function getStoredQwenByokConfig(): ByokModelConfig | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(QWEN_BYOK_STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Partial<ByokModelConfig>;
        if (!parsed.apiKey || typeof parsed.apiKey !== 'string') return null;

        return {
            provider: 'openai_compatible',
            model: QWEN_MODEL_OPTION,
            apiKey: parsed.apiKey.trim(),
            baseURL: parsed.baseURL?.trim() || undefined,
        };
    } catch {
        return null;
    }
}

export function saveQwenByokConfig(config: { apiKey: string; baseURL?: string }) {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
        QWEN_BYOK_STORAGE_KEY,
        JSON.stringify({
            provider: 'openai_compatible',
            model: QWEN_MODEL_OPTION,
            apiKey: config.apiKey.trim(),
            baseURL: config.baseURL?.trim() || '',
        }),
    );
}

export function clearQwenByokConfig() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(QWEN_BYOK_STORAGE_KEY);
}
