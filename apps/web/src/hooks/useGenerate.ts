/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useRouter } from 'next/navigation';
import { useBuilderChatStore } from '../store/code/useBuilderChatStore';
import { useUserSessionStore } from '../store/user/useUserSessionStore';
import { v4 as uuid } from 'uuid';
import GenerateContract from '../lib/server/generate_contract';
import { ChatRole, STAGE, Template } from '@lighthouse/types';

export default function useGenerate() {
    const { session } = useUserSessionStore();
    const router = useRouter();

    function set_states(
        contractId: string,
        instruction: string | null,
        templateId?: string,
        template?: Template,
    ) {
        const { setCurrentContractId, setMessage, setActiveTemplate } =
            useBuilderChatStore.getState();
        setCurrentContractId(contractId);

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

    function handleGeneration(contractId: string, instruction?: string, templateId?: string) {
        if (!session?.user.token) return;
        const { setLoading } = useBuilderChatStore.getState();
        setLoading(true);
        GenerateContract.start_agentic_executor(
            session.user.token,
            contractId,
            instruction,
            templateId,
        );
    }

    return {
        handleGeneration,
        set_states,
    };
}
