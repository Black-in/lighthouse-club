/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { PLAN_CONTEXT_URL, GENERATE_CONTRACT } from '@/routes/api_routes';
import axios from 'axios';
import {
    StreamEvent,
    PHASE_TYPES,
    STAGE,
    FILE_STRUCTURE_TYPES,
    FileContent,
    MODEL,
} from '@/src/types/stream_event_types';
import { Message } from '@lighthouse/types';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { DAILY_LIMIT } from '@lighthouse/types';
import { shouldSkipAuthClient } from '../auth-bypass';

export default class GenerateContract {
    static async start_planner_executor(
        token: string,
        contract_id: string,
        instruction: string,
    ): Promise<{
        data: unknown | null;
        message: string;
    }> {
        const { setMessage } = useBuilderChatStore.getState();
        try {
            const skipAuth = shouldSkipAuthClient();
            if ((!token && !skipAuth) || !contract_id || !instruction) {
                return {
                    data: null,
                    message: 'some data is not provided',
                };
            }

            const { data } = await axios.post(
                PLAN_CONTEXT_URL,
                {
                    contract_id,
                    instruction,
                },
                {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : undefined,
                },
            );
            setMessage(data.data);
            return {
                data: data.data,
                message: data.message,
            };
        } catch (err) {
            console.error('error in starting the plan executor', err);
            return {
                data: null,
                message: 'some data is not provided',
            };
        }
    }

    static async start_agentic_executor(
        token: string,
        contractId: string,
        instruction?: string,
        template_id?: string,
    ): Promise<void> {
        const { setLoading, upsertMessage, setPhase, setCurrentFileEditing } =
            useBuilderChatStore.getState();
        const { deleteFile, parseFileStructure, setCollapseFileTree } = useCodeEditor.getState();
        const { setShowContractLimit, setShowMessageLimit, setShowRegenerateTime } =
            useLimitStore.getState();

        try {
            setLoading(true);

            const response = await fetch(GENERATE_CONTRACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    contract_id: contractId,
                    instruction: instruction,
                    template_id: template_id,
                    model: MODEL.GEMINI,
                }),
            });

            if (response.status === 429) {
                const data = await response.json();
                const limit_type = data.meta?.error_code;
                if (limit_type === DAILY_LIMIT.MESSAGE_PER_CONTRACT_LIMIT) {
                    setShowMessageLimit(true);
                }
                if (limit_type === DAILY_LIMIT.CONTRACT_DAILY_LIMIT) {
                    setShowContractLimit(true);
                    if (data.meta?.next_allowed_time) {
                        setShowRegenerateTime(data.meta.next_allowed_time);
                    }
                }
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const jsonString = trimmed.startsWith('data: ')
                            ? trimmed.slice(6)
                            : trimmed;
                        const event: StreamEvent = JSON.parse(jsonString);

                        switch (event.type) {
                            case PHASE_TYPES.STARTING:
                                if (event.systemMessage) {
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case STAGE.CONTEXT:
                                if ('llmMessage' in event.data) {
                                    upsertMessage(event.data.llmMessage as Message);
                                }
                                break;

                            case STAGE.PLANNING:
                            case STAGE.GENERATING_CODE:
                            case STAGE.BUILDING:
                            case STAGE.CREATING_FILES:
                            case STAGE.FINALIZING:
                                if (event.systemMessage) {
                                    setPhase(event.systemMessage.stage);
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case PHASE_TYPES.THINKING:
                            case PHASE_TYPES.GENERATING:
                            case PHASE_TYPES.BUILDING:
                            case PHASE_TYPES.CREATING_FILES:
                            case PHASE_TYPES.COMPLETE:
                            case PHASE_TYPES.DELETING:
                                setPhase(event.type);
                                break;

                            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                                setPhase(event.type);
                                if ('file' in event.data) {
                                    if ('phase' in event.data && event.data.phase === 'deleting') {
                                        deleteFile(event.data.file as string);
                                    } else {
                                        setCurrentFileEditing(event.data.file as string);
                                    }
                                }
                                break;

                            case PHASE_TYPES.ERROR:
                                console.error('LLM Error:', event.data);
                                break;

                            case STAGE.END:
                                if ('data' in event.data && event.data.data) {
                                    if (event.systemMessage) {
                                        upsertMessage(event.systemMessage);
                                    }
                                    parseFileStructure(event.data.data as FileContent[]);
                                    setLoading(false);
                                    setCollapseFileTree(true);
                                }
                                break;

                            default:
                                break;
                        }
                    } catch {
                        console.warn('Skipping incomplete stream event chunk');
                    }
                }
            }

            // const data = await response.json();
            // parseFileStructure(data.data);

            setCollapseFileTree(true);
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setLoading(false);
        }
    }

    static async continue_chat(
        token: string,
        contractId: string,
        message: string,
        onError?: (error: Error) => void,
    ): Promise<void> {
        const { setLoading, upsertMessage, setPhase, setCurrentFileEditing } =
            useBuilderChatStore.getState();
        const { deleteFile, parseFileStructure, setCollapseFileTree } = useCodeEditor.getState();
        const { setShowMessageLimit, setShowContractLimit, setShowRegenerateTime } =
            useLimitStore.getState();

        try {
            setLoading(true);

            const skipAuth = shouldSkipAuthClient();
            if ((!token && !skipAuth) || !contractId || !message.trim()) {
                throw new Error('Missing required parameters');
            }

            const response = await fetch(GENERATE_CONTRACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    contract_id: contractId,
                    instruction: message,
                    model: MODEL.GEMINI,
                }),
            });

            // limit reached handler
            if (response.status === 429) {
                const data = await response.json();
                const limit_type = data.meta?.error_code;

                if (limit_type === DAILY_LIMIT.MESSAGE_PER_CONTRACT_LIMIT) {
                    setShowMessageLimit(true);
                }

                if (limit_type === DAILY_LIMIT.CONTRACT_DAILY_LIMIT) {
                    setShowContractLimit(true);
                    if (data.meta?.next_allowed_time) {
                        setShowRegenerateTime(data.meta.next_allowed_time);
                    }
                }
                setLoading(false);
                return;
            }

            if (response.status === 423) {
                const data = await response.json();
                if (data.goBack && onError) {
                    onError(new Error(data.message));
                }
                return;
            }

            if (response.status === 403) {
                if (onError) {
                    onError(new Error('Message limit reached'));
                }
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to continue chat');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const jsonString = trimmed.startsWith('data: ')
                            ? trimmed.slice(6)
                            : trimmed;
                        const event: StreamEvent = JSON.parse(jsonString);

                        switch (event.type) {
                            case PHASE_TYPES.STARTING:
                                if (event.systemMessage) {
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case STAGE.CONTEXT:
                                if ('llmMessage' in event.data) {
                                    upsertMessage(event.data.llmMessage as Message);
                                }
                                break;

                            case STAGE.PLANNING:
                            case STAGE.GENERATING_CODE:
                            case STAGE.BUILDING:
                            case STAGE.CREATING_FILES:
                            case STAGE.FINALIZING:
                                if (event.systemMessage) {
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case PHASE_TYPES.THINKING:
                            case PHASE_TYPES.GENERATING:
                            case PHASE_TYPES.BUILDING:
                            case PHASE_TYPES.CREATING_FILES:
                            case PHASE_TYPES.COMPLETE:
                            case PHASE_TYPES.DELETING:
                                setPhase(event.type);
                                break;

                            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                                setPhase(event.type);
                                if ('file' in event.data) {
                                    if ('phase' in event.data && event.data.phase === 'deleting') {
                                        deleteFile(event.data.file as string);
                                    } else {
                                        setCurrentFileEditing(event.data.file as string);
                                    }
                                }
                                break;

                            case PHASE_TYPES.ERROR:
                                console.error('LLM Error:', event.data);
                                if (onError && 'message' in event.data) {
                                    onError(new Error(event.data.message as string));
                                }
                                break;

                            case STAGE.END:
                                if ('data' in event.data && event.data.data) {
                                    if (event.systemMessage) {
                                        upsertMessage(event.systemMessage);
                                    }
                                    parseFileStructure(event.data.data as FileContent[]);
                                    setLoading(false);
                                    setCollapseFileTree(true);
                                }
                                break;

                            default:
                                break;
                        }
                    } catch {
                        console.warn('Skipping incomplete stream event chunk');
                    }
                }
            }

            setCollapseFileTree(true);
        } catch (error) {
            console.error('Chat stream error:', error);
            if (onError) {
                onError(error as Error);
            }
        } finally {
            setLoading(false);
        }
    }
}
