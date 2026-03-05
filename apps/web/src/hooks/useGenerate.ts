/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useRouter } from 'next/navigation';
import { useBuilderChatStore } from '../store/code/useBuilderChatStore';
import { useUserSessionStore } from '../store/user/useUserSessionStore';
import { v4 as uuid } from 'uuid';
import GenerateContract from '../lib/server/generate_contract';
import { ChatRole, MODEL, STAGE, Template } from '@lighthouse/types';
import { shouldSkipAuthClient } from '../lib/auth-bypass';

interface SetStatesOptions {
    markLoading?: boolean;
}

interface GenerationOptions {
    model?: MODEL;
}

export default function useGenerate() {
    const { session } = useUserSessionStore();
    const router = useRouter();

    function set_states(
        contractId: string,
        instruction: string | null,
        templateId?: string,
        template?: Template,
        options?: SetStatesOptions,
        generationOptions?: GenerationOptions,
    ) {
        const { setCurrentContractId, setMessage, setActiveTemplate, setLoading, setSelectedModel } =
            useBuilderChatStore.getState();
        setCurrentContractId(contractId);
        setSelectedModel(generationOptions?.model || MODEL.GEMINI, contractId);
        if (options?.markLoading) {
            setLoading(true);
        }

        if (template) {
            setActiveTemplate(template);
        }

        // Add messages
        if (templateId && template) {
            if (instruction) {
                setMessage({
                    id: uuid(),
                    contractId: contractId,
                    role: ChatRole.USER,
                    content: instruction,
                    stage: STAGE.START,
                    isPlanExecuted: false,
                    createdAt: new Date(),
                });
            }
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.TEMPLATE,
                content: '',
                templateId: templateId,
                template: template,
                stage: STAGE.START,
                isPlanExecuted: false,
                createdAt: new Date(),
            });
        } else if (instruction) {
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.USER,
                content: instruction,
                templateId: templateId,
                stage: STAGE.START,
                isPlanExecuted: false,
                createdAt: new Date(),
            });
        }

        router.push(`/playground/${contractId}`);
    }

    function handleGeneration(
        contractId: string,
        instruction?: string,
        templateId?: string,
        model?: MODEL,
    ) {
        const skipAuth = shouldSkipAuthClient();
        if (!session?.user.token && !skipAuth) return;
        const { setLoading } = useBuilderChatStore.getState();
        const selectedModel =
            model || useBuilderChatStore.getState().contracts[contractId]?.selectedModel || MODEL.GEMINI;
        setLoading(true);
        GenerateContract.start_agentic_executor(
            session?.user?.token ?? '',
            contractId,
            instruction,
            templateId,
            selectedModel,
        );
    }

    return {
        handleGeneration,
        set_states,
    };
}
