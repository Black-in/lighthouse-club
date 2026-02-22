'use client';
import { JSX, useCallback, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { cn } from '@/src/lib/utils';
import LighthouseMark from '../ui/svg/LighthouseMark';

export default function CodeEditor(): JSX.Element {
    const { currentCode, currentFile, collapseFileTree, setCurrentCursorPosition } =
        useCodeEditor();
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [copyCooldown, setCopyCooldown] = useState<boolean>(false);

    function handleCopyFileContent() {
        if (!currentCode || copyCooldown) return;

        navigator.clipboard.writeText(currentCode);

        setIsCopied(true);
        setCopyCooldown(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 1200);

        setTimeout(() => {
            setCopyCooldown(false);
        }, 1500);
    }

    const handleEditorWillMount = useCallback((monaco: Monaco) => {
        monaco.editor.defineTheme('clean-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'BFBFBF', background: '070708' },
                { token: 'identifier', foreground: 'C8C8C8' },
                { token: 'delimiter', foreground: '8B939D' },
                { token: 'white', foreground: 'C8C8C8' },

                { token: 'comment', foreground: '6C737C', fontStyle: 'italic' },
                { token: 'comment.doc', foreground: '6C737C', fontStyle: 'italic' },

                { token: 'keyword', foreground: '6F96E6', fontStyle: 'bold' },
                { token: 'keyword.control', foreground: '6F96E6' },
                { token: 'keyword.operator', foreground: 'D77A5D' },
                { token: 'storage', foreground: '6F96E6', fontStyle: 'bold' },
                { token: 'modifier', foreground: '6A8DE6' },

                { token: 'variable', foreground: 'C4C4C4' },
                { token: 'variable.predefined', foreground: 'E5A55C' },
                { token: 'variable.parameter', foreground: '9E9E9E' },

                { token: 'function', foreground: '6ADFE6' },
                { token: 'function.name', foreground: '70B7E6' },
                { token: 'function.call', foreground: '70B7E6' },
                { token: 'support.function', foreground: '6ADFE6' },

                { token: 'type.identifier', foreground: '8EC2E6' },
                { token: 'type', foreground: '9BD3E6' },
                { token: 'class.name', foreground: '9D77E6', fontStyle: 'bold' },
                { token: 'interface.name', foreground: '77D2E6' },
                { token: 'namespace', foreground: '9C88CC' },

                { token: 'string', foreground: 'A5C878' },
                { token: 'string.key.json', foreground: 'E6B45E' },
                { token: 'string.value.json', foreground: 'A5C878' },
                { token: 'string.template', foreground: 'D9DF78' },
                { token: 'string.escape', foreground: 'E6C270' },

                { token: 'number', foreground: 'D77A5D' },
                { token: 'constant.numeric', foreground: 'D77A5D' },
                { token: 'constant.language.boolean', foreground: 'E64A64' },
                { token: 'constant.language.null', foreground: 'E64A64' },
                { token: 'constant', foreground: 'E6B45E' },

                { token: 'operator', foreground: 'D77A5D' },
                { token: 'delimiter.bracket', foreground: '8F96A3' },
                { token: 'delimiter.parenthesis', foreground: '8F96A3' },
                { token: 'delimiter.square', foreground: '8F96A3' },
                { token: 'delimiter.curly', foreground: '8F96A3' },

                { token: 'tag', foreground: 'E64A64' },
                { token: 'tag.name', foreground: 'E65858' },
                { token: 'meta.tag', foreground: 'E65858' },
                { token: 'attribute.name', foreground: 'E5A55C' },
                { token: 'attribute.value', foreground: 'A5C878' },

                { token: 'key', foreground: 'E6B45E' },
                { token: 'property.name', foreground: 'E6B45E' },

                { token: 'support.type.property-name', foreground: '99CCE6' },
                { token: 'support.constant.color', foreground: 'D77A5D' },
                { token: 'entity.name.tag.css', foreground: '6F96E6' },
                { token: 'keyword.other.unit', foreground: 'E6B45E' },

                { token: 'invalid', foreground: 'FFFFFF', background: 'CC4444' },
                { token: 'error', foreground: 'CC4444' },
                { token: 'warning', foreground: 'D9DF78' },
            ],
            colors: {
                'editor.background': '#070708',
                'editor.foreground': '#C8C8C8',
                'editorCursor.foreground': '#E6E6E6',
                'editor.lineHighlightBackground': '#111215',
                'editorLineNumber.foreground': '#4A4B4E',
                'editorLineNumber.activeForeground': '#A0A0A0',
                'editor.selectionBackground': '#20242d',
                'editor.inactiveSelectionBackground': '#17191e',
                'editorIndentGuide.background': '#16171a',
                'editorIndentGuide.activeBackground': '#272a30',
                'editorGutter.background': '#070708',
                'editorWhitespace.foreground': '#1d1f24',
                'scrollbarSlider.background': '#17191e',
                'scrollbarSlider.hoverBackground': '#20242d',
                'scrollbarSlider.activeBackground': '#2b303a',
            },
        });
    }, []);

    const handleEditorDidMount = useCallback(
        (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
                const event = new CustomEvent('open-search-bar');
                window.dispatchEvent(event);
            });
            editorInstance.onDidChangeCursorPosition((e) => {
                const { lineNumber, column } = e.position;
                setCurrentCursorPosition({ ln: lineNumber, col: column });
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [],
    );

    function filePathModifier(filePath: string | undefined) {
        return filePath ? filePath.replaceAll('/', ' / ') : '';
    }

    return (
        <div className="flex flex-col w-full h-full grow-0 relative">
            <div className="flex-1 min-w-0 h-full">
                {currentFile ? (
                    <>
                        <div className="w-full flex items-center justify-between px-4 py-1 bg-[#070708] text-gray-300 text-sm ">
                            <span>{filePathModifier(currentFile?.id)}</span>
                            <div
                                onClick={handleCopyFileContent}
                                className={cn(
                                    'cursor-pointer transition-all duration-200 ease-out bg-darkest/70 rounded-[4px] border border-light/10',
                                    'hover:bg-neutral-600/10 flex items-center justify-center select-none px-1.5 py-1 group overflow-hidden',
                                    'w-6 hover:w-[4.5rem]',
                                    isCopied ? 'text-[#5483B3]' : 'text-light',
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-[10px] whitespace-nowrap overflow-hidden w-0 transition-all duration-200 ease-out',
                                        'group-hover:w-[2.5rem] group-hover:mr-1.5',
                                        isCopied ? 'text-[#5483B3]/90' : 'text-light/70',
                                    )}
                                >
                                    {isCopied ? 'copied' : 'copy'}
                                </span>

                                {isCopied ? (
                                    <FiCheck className="text-sm flex-shrink-0 transition-colors duration-200 ease-out" />
                                ) : (
                                    <FiCopy className="text-sm flex-shrink-0 transition-colors duration-200 ease-out" />
                                )}
                            </div>
                        </div>
                        <Editor
                            key={collapseFileTree ? 'tree-collapsed' : 'tree-expanded'}
                            height="100%"
                            language="rust"
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                            theme="clean-dark"
                            options={{
                                readOnly: true,
                                readOnlyMessage: {
                                    value: 'This feature will be available on the next version.',
                                },
                                minimap: { enabled: true },
                            }}
                            value={currentCode}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex justify-center items-center bg-[#070708]">
                        <LighthouseMark size={188} className="text-neutral-800" />
                    </div>
                )}
            </div>
        </div>
    );
}
