/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useEffect, useRef, useState } from 'react';
import WebSocketClient, { MessageHandler } from '../class/socket.client';
import { cleanWebSocketClient } from '../lib/singletonWebSocket';
import { useUserSessionStore } from '../store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { COMMAND } from '@lighthouse/types';
import { COMMAND_WRITER } from '../lib/terminal_commands';

export const useWebSocket = () => {
    const socket = useRef<WebSocketClient | null>(null);
    const params = useParams();
    const { session } = useUserSessionStore();
    const contractId = params?.contractId as string | undefined;
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = session?.user?.token;
        if (!token || !contractId) return;

        let interval: NodeJS.Timeout | null = null;

        try {
            // socket.current = getWebSocketClient(token, contractId);

            interval = setInterval(() => {
                if (socket.current) {
                    setIsConnected(socket.current.is_connected ?? false);
                }
            }, 200);
        } catch (err) {
            console.error('Failed to initialize WS:', err);
            setIsConnected(false);
        }

        return () => {
            if (interval) clearInterval(interval);
            setIsConnected(false);
            socket.current = null;
            cleanWebSocketClient();
        };
    }, [session?.user?.token, contractId]);

    function subscribeToHandler(handler: MessageHandler) {
        if (!socket.current) {
            return;
        }
        socket.current?.subscribe(handler);
    }

    function sendSocketMessage(command: COMMAND, message: COMMAND_WRITER) {
        if (!socket.current) return;

        socket.current.send_message({
            type: command,
            payload: {
                contractName: '',
                message: `executing ${message}`,
            },
        });
    }

    return {
        isConnected,
        socket,
        subscribeToHandler,
        sendSocketMessage,
    };
};
