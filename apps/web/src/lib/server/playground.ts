/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { GET_CHAT_URL } from '@/routes/api_routes';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import axios from 'axios';

export default class Playground {
    static async get_chat(token: string, contractId: string) {
        const { upsertMessage } = useBuilderChatStore.getState();
        const { parseFileStructure, setCollapseFileTree } = useCodeEditor.getState();
        try {
            if (!token) return;
            const { data } = await axios.post(
                GET_CHAT_URL,
                {
                    contractId: contractId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const sortedMessages = [...data.data.messages].sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });

            for (let i = 0; i < sortedMessages.length; i++) {
                upsertMessage(sortedMessages[i]);
            }
            const parsedFiles = JSON.parse(data.data.contractFiles || data.data.templateFiles);
            if (parsedFiles) {
                parseFileStructure(parsedFiles);
            }
            setCollapseFileTree(true);
        } catch (error) {
            console.error('Error while fetching chats from server: ', error);
        }
    }
}
