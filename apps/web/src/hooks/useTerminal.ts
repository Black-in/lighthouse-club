/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useCallback } from 'react';
import { COMMAND_WRITER, CommandResponse } from '../lib/terminal_commands';
import { useWebSocket } from './useWebSocket';
import { COMMAND } from '@lighthouse/types';
import { useTerminalLogStore } from '../store/code/useTerminalLogStore';
import { useCommandHistoryStore } from '../store/code/useCommandHistoryStore';

export function isValidCommandFunction(command: string): boolean {
    return Object.values(COMMAND_WRITER).includes(command as COMMAND_WRITER);
}

export function useTerminal() {
    const { addLog, setLogs } = useTerminalLogStore();
    const { sendSocketMessage } = useWebSocket();
    const { addCommand } = useCommandHistoryStore();

    const handleCommand = useCallback(
        (command: string) => {
            const trimmed = command.trim();
            if (!trimmed) return;

            addCommand(trimmed);

            const isValid = isValidCommandFunction(trimmed);
            addLog({
                type: isValid ? 'command' : 'error',
                text: trimmed,
            });

            const cmd = trimmed as COMMAND_WRITER;

            switch (cmd) {
                case COMMAND_WRITER.CLEAR:
                    setLogs([]);
                    return;

                case COMMAND_WRITER.HELP:
                case COMMAND_WRITER.HOT_KEYS:
                case COMMAND_WRITER.PLATFORM:
                case COMMAND_WRITER.COMMANDS:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    return;

                case COMMAND_WRITER.lighthouse_BUILD:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    sendSocketMessage(COMMAND.lighthouse_BUILD, cmd);
                    return;

                case COMMAND_WRITER.lighthouse_TEST:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    sendSocketMessage(COMMAND.lighthouse_TEST, cmd);
                    return;

                case COMMAND_WRITER.lighthouse_DEPLOY_DEVNET:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    // DISABLED - Solana chain (see /chains/solana).
                    return;

                case COMMAND_WRITER.lighthouse_DEPLOY_MAINNET:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    // DISABLED - Solana chain (see /chains/solana).
                    return;

                case COMMAND_WRITER.lighthouse_DEPLOY_BASE_SEPOLIA:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    sendSocketMessage(COMMAND.lighthouse_DEPLOY_BASE_SEPOLIA, cmd);
                    return;

                case COMMAND_WRITER.lighthouse_DEPLOY_BASE_MAINNET:
                    addLog({ type: 'client', text: CommandResponse[cmd] });
                    sendSocketMessage(COMMAND.lighthouse_DEPLOY_BASE_MAINNET, cmd);
                    return;

                default:
                    addLog({
                        type: 'error',
                        text: `blackin: command not found: ${trimmed}. Try --help`,
                    });
            }
        },
        [addCommand, sendSocketMessage, addLog, setLogs],
    );

    return { handleCommand };
}
