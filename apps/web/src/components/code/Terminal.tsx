/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useState, useEffect, useRef } from 'react';
import { MdTerminal } from 'react-icons/md';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import useShortcuts from '@/src/hooks/useShortcut';
import { PiBroomFill, PiTerminal } from 'react-icons/pi';
import { IoIosClose } from 'react-icons/io';
import { Button } from '../ui/button';
import ToolTipComponent from '../ui/TooltipComponent';
import { useTerminalResize } from '@/src/hooks/useTerminalResize';
import { cn } from '@/src/lib/utils';
import { TerminalSocketData } from '@lighthouse/types';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { Line } from '@/src/types/terminal_types';
import { useCommandHistoryStore } from '@/src/store/code/useCommandHistoryStore';
import { isValidCommandFunction, useTerminal } from '@/src/hooks/useTerminal';
import { useTerminalVisibilityStore } from '@/src/store/code/useTerminalVisibilityStore';

export default function Terminal() {
    const [currentInput, setCurrentInput] = useState<string>('');
    const [isValidCommand, setIsValidCommand] = useState<boolean>(false);
    const { showTerminal, setShowTerminal, toggleTerminal } = useTerminalVisibilityStore();
    const { currentFile, currentCursorPosition } = useCodeEditor();
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { moveUp, moveDown, resetIndex } = useCommandHistoryStore();
    const { logs, addLog, clearLogs, isCommandRunning, terminalLoader } = useTerminalLogStore();
    const { handleCommand } = useTerminal();

    const { height, startResize } = useTerminalResize({
        onClose: function () {
            setShowTerminal(false);
        },
    });

    useShortcuts({
        'meta+j': function () {
            toggleTerminal();
        },
        'ctrl+j': function () {
            toggleTerminal();
        },
    });

    function Prompt() {
        return (
            <span className="text-green-500 select-none text-[14px]">
                ➜ <span className="text-blue-400">~</span>
            </span>
        );
    }
    useEffect(
        function () {
            if (showTerminal) inputRef.current?.focus();
        },
        [showTerminal],
    );

    useEffect(
        function () {
            const el = outputRef.current;
            if (!el) return;

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    el.scrollTo({
                        top: el.scrollHeight,
                        behavior: 'smooth',
                    });
                });
            });
        },
        [logs],
    );

    function handleCurrentFileExtension() {
        if (!currentFile) return 'no selected file.';
        const currentFileNameArray = currentFile.name.split('.');
        const extension = currentFileNameArray[currentFileNameArray.length - 1];
        switch (extension) {
            case 'rs':
                return 'Rust';
            case 'ts':
                return 'TypeScript';
            case 'json':
                return 'JSON';
            case 'toml':
                return 'TOML';
            default:
                if (extension.endsWith('ignore')) return 'ignore';
                return 'File';
        }
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            addLog({ type: 'command', text: '^C' });
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(currentInput);
            setCurrentInput('');
            resetIndex();
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = moveUp();
            if (prevCommand !== null) setCurrentInput(prevCommand);
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = moveDown();
            setCurrentInput(next ?? '');
        }
    }

    function renderLines(lines: Line[]) {
        return lines.map(function (line, i) {
            let className = '';
            switch (line.type) {
                case 'command':
                    className = 'text-[#25da65]';
                    break;

                case TerminalSocketData.COMPLETED:
                    className = 'text-cyan-500';
                    break;

                case TerminalSocketData.LOGS:
                    className = 'text-[#25da65]';
                    break;

                case TerminalSocketData.ERROR_MESSAGE:
                    className = 'text-[#E9524A]';
                    break;

                case TerminalSocketData.EXECUTING_COMMAND:
                    className = 'text-primary-light/90';
                    break;

                case TerminalSocketData.SERVER_MESSAGE:
                    className = 'text-cyan-500';
                    break;

                case 'client':
                    className = 'text-yellow-500';
                    break;

                case 'error':
                    className = 'text-red-500';
                    break;

                case 'unknown':
                    className = 'text-red-500';
                    break;

                default:
                    className = 'text-light/80 font-normal';
            }

            return (
                <div key={i} className="whitespace-pre-wrap text-left">
                    {line.type === 'command' ? (
                        <>
                            <Prompt /> <span className={cn('ml-2', className)}>{line.text}</span>
                        </>
                    ) : line.type === 'error' && line.text.startsWith('blackin:') ? (
                        <span className={cn('ml-6', className)}>{line.text}</span>
                    ) : (
                        <>
                            {line.type === 'error' ? (
                                <>
                                    <Prompt />{' '}
                                    <span className={cn('ml-2', className)}>{line.text}</span>
                                </>
                            ) : (
                                <span className={cn('ml-6', className)}>{line.text}</span>
                            )}
                        </>
                    )}
                </div>
            );
        });
    }

    return (
        <>
            {showTerminal && (
                <div
                    className="playground-terminal-shell absolute bottom-6 left-0 right-0 bg-darkest border-t border-neutral-800 text-neutral-200 font-mono flex flex-col z-999999 text-[12px]"
                    style={{
                        height: `min(${height}px, calc(100% - 6rem))`,
                        maxHeight: 'calc(100% - 6rem)',
                    }}
                >
                    <div
                        onMouseDown={function (e) {
                            e.preventDefault();
                            startResize();
                        }}
                        className="playground-terminal-resize h-0.5 w-full cursor-ns-resize bg-neutral-800"
                    />

                    <div className="playground-terminal-header text-light/50 py-1 px-4 flex justify-between items-center select-none bg-darkest">
                        <Button disabled className="tracking-[2px] p-0 text-[11px] bg-transparent">
                            TERMINAL
                        </Button>

                        <div className="flex gap-0 items-center">
                            <Button className="w-auto bg-transparent hover:bg-dark p-0 rounded cursor-pointer text-light/60 items-center">
                                <PiTerminal className="size-4" />
                                <span className="text-xs font-sans tracking-wide leading-0">
                                    BlackIn
                                </span>
                            </Button>
                            <ToolTipComponent content="clear">
                                <Button
                                    onClick={clearLogs}
                                    size={'mini'}
                                    className="bg-transparent hover:bg-dark rounded"
                                >
                                    <PiBroomFill className="size-3 text-light/70 " />
                                </Button>
                            </ToolTipComponent>

                            <ToolTipComponent content="close">
                                <Button
                                    onClick={function () {
                                        setShowTerminal(false);
                                    }}
                                    size={'mini'}
                                    className="bg-transparent hover:bg-dark rounded"
                                >
                                    <IoIosClose className="size-5 text-light/70" />
                                </Button>
                            </ToolTipComponent>
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        <div
                            ref={outputRef}
                            onClick={function () {
                                inputRef.current?.focus();
                            }}
                            className="playground-terminal-output flex-1 cursor-text overflow-y-auto px-3 py-2 text-light/80 flex flex-col"
                        >
                            {renderLines(logs)}

                            <div className="flex mt-1">
                                {!isCommandRunning && <Prompt />}
                                {terminalLoader}
                                {isCommandRunning && terminalLoader && (
                                    <span className="terminal-loader ml-5" />
                                )}
                                <input
                                    aria-label="terminal"
                                    ref={inputRef}
                                    disabled={isCommandRunning}
                                    type="text"
                                    value={currentInput}
                                    onChange={function (e) {
                                        const value = e.target.value;
                                        setCurrentInput(value);
                                        setIsValidCommand(isValidCommandFunction(value.trim()));
                                    }}
                                    onKeyDown={handleInputKeyDown}
                                    className={cn(
                                        'playground-terminal-input outline-none bg-transparent ml-2 flex-1',
                                        currentInput.trim() && isValidCommand
                                            ? 'text-[#68db3e]'
                                            : 'text-light/80',
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="playground-terminal-status absolute bottom-0 left-0 right-0 h-6 flex justify-between items-center px-3 text-[11px] text-light/70 bg-darkest border-t border-neutral-800 z-20">
                <ToolTipComponent side="top" content="Toggle terminal (Ctrl/Cmd + J)">
                    <div
                        className="playground-terminal-toggle flex items-center justify-center hover:bg-neutral-800/50 px-2 py-0.5 rounded-md cursor-pointer transition text-[11px]"
                        onClick={function () {
                            toggleTerminal();
                        }}
                    >
                        <MdTerminal className="size-4 text-light/70" />
                    </div>
                </ToolTipComponent>
                <div className="flex items-center space-x-4 text-light/60">
                    <div className="hover:text-light/80 cursor-pointer tracking-wider">
                        {currentFile
                            ? 'Ln ' +
                              currentCursorPosition.ln +
                              ', ' +
                              'Col ' +
                              currentCursorPosition.col
                            : 'Ln 0, Col 0'}
                    </div>
                    <div className="hover:text-light/80 cursor-pointer tracking-wider">
                        {'{ } ' + handleCurrentFileExtension()}
                    </div>
                </div>
            </div>
        </>
    );
}
