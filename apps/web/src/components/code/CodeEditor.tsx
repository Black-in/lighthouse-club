'use client';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { cn } from '@/src/lib/utils';
import LighthouseMark from '../ui/svg/LighthouseMark';
import { LuFile } from 'react-icons/lu';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

function getEditorTheme(theme: 'dark' | 'light' | 'legacy') {
    if (theme === 'light') return 'clean-light';
    if (theme === 'legacy') return 'clean-dark';
    return 'clean-dark-modern';
}

export default function CodeEditor(): JSX.Element {
    const {
        currentCode,
        currentFile,
        livePreviewCode,
        livePreviewFilePath,
        collapseFileTree,
        setCurrentCursorPosition,
        collapseChat,
        setCollapsechat,
    } = useCodeEditor();
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [copyCooldown, setCopyCooldown] = useState<boolean>(false);
    const { theme } = usePlaygroundThemeStore();
    const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoInstanceRef = useRef<Monaco | null>(null);

    const displayFilePath = livePreviewFilePath || currentFile?.id || null;
    const displayCode = livePreviewFilePath ? livePreviewCode : currentCode;
    const editorValue = displayCode;
    const editorLanguage = inferLanguage(displayFilePath);
    const titleLabel = displayFilePath;

    const applyEditorTheme = useCallback((monaco: Monaco, currentTheme: 'dark' | 'light' | 'legacy') => {
        monaco.editor.setTheme(getEditorTheme(currentTheme));
    }, []);

    function handleCopyFileContent() {
        if (!displayCode || copyCooldown) return;

        navigator.clipboard.writeText(displayCode);

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
        monaco.editor.defineTheme('clean-dark-modern', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'D6D6D6', background: '141212' },
                { token: 'identifier', foreground: 'D6D6D6' },
                { token: 'comment', foreground: '7D7D7D', fontStyle: 'italic' },
                { token: 'keyword', foreground: '79A7FF', fontStyle: 'bold' },
                { token: 'string', foreground: '9CD67D' },
                { token: 'number', foreground: 'E0A37A' },
                { token: 'type', foreground: '9BBCE6' },
                { token: 'function', foreground: '86D9E6' },
            ],
            colors: {
                'editor.background': '#141212',
                'editor.foreground': '#D6D6D6',
                'editorCursor.foreground': '#E5E5E5',
                'editor.lineHighlightBackground': '#1D1A1A',
                'editorLineNumber.foreground': '#666666',
                'editorLineNumber.activeForeground': '#9D9D9D',
                'editor.selectionBackground': '#2D2727',
                'editor.inactiveSelectionBackground': '#231F1F',
                'editorIndentGuide.background': '#292323',
                'editorIndentGuide.activeBackground': '#3A3333',
                'editorGutter.background': '#141212',
                'editorWhitespace.foreground': '#2F2929',
                'scrollbarSlider.background': '#2D2727',
                'scrollbarSlider.hoverBackground': '#3D3636',
                'scrollbarSlider.activeBackground': '#4D4646',
            },
        });
        monaco.editor.defineTheme('clean-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: '', foreground: '1F2937', background: 'F7F9FD' },
                { token: 'comment', foreground: '94A3B8', fontStyle: 'italic' },
                { token: 'keyword', foreground: '1E40AF', fontStyle: 'bold' },
                { token: 'string', foreground: '047857' },
                { token: 'number', foreground: 'B45309' },
                { token: 'function', foreground: '075985' },
                { token: 'type', foreground: '7C3AED' },
            ],
            colors: {
                'editor.background': '#F7F9FD',
                'editor.foreground': '#1F2937',
                'editorCursor.foreground': '#1F2937',
                'editor.lineHighlightBackground': '#ECF1F8',
                'editorLineNumber.foreground': '#94A3B8',
                'editorLineNumber.activeForeground': '#475569',
                'editor.selectionBackground': '#D6E4FA',
                'editor.inactiveSelectionBackground': '#E2E8F5',
                'editorIndentGuide.background': '#DFE6F2',
                'editorIndentGuide.activeBackground': '#B7C4D9',
                'editorGutter.background': '#F7F9FD',
                'editorWhitespace.foreground': '#D1D9E7',
                'scrollbarSlider.background': '#CBD5E1',
                'scrollbarSlider.hoverBackground': '#94A3B8',
                'scrollbarSlider.activeBackground': '#64748B',
            },
        });
    }, []);

    const handleEditorDidMount = useCallback(
        (mountedEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorInstanceRef.current = mountedEditor;
            monacoInstanceRef.current = monaco;
            applyEditorTheme(monaco, theme);

            mountedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
                const event = new CustomEvent('open-search-bar');
                window.dispatchEvent(event);
            });
            mountedEditor.onDidChangeCursorPosition((e) => {
                const { lineNumber, column } = e.position;
                setCurrentCursorPosition({ ln: lineNumber, col: column });
            });
        },
        [applyEditorTheme, setCurrentCursorPosition, theme],
    );

    useEffect(() => {
        if (!monacoInstanceRef.current) return;
        applyEditorTheme(monacoInstanceRef.current, theme);
    }, [applyEditorTheme, theme]);

    useEffect(() => {
        if (!livePreviewFilePath) return;

        const instance = editorInstanceRef.current;
        if (!instance) return;

        const model = instance.getModel();
        if (!model) return;

        const lastLine = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLine);

        instance.setPosition({ lineNumber: lastLine, column: lastColumn });
        instance.revealLine(lastLine);
    }, [livePreviewCode, livePreviewFilePath]);

    function filePathModifier(filePath: string | null | undefined) {
        return filePath ? filePath.replaceAll('/', ' / ') : '';
    }

    return (
        <div className="flex flex-col w-full h-full grow-0 relative bg-[#121318]">
            <div className="flex-1 min-w-0 h-full">
                {displayFilePath || currentFile ? (
                    <>
                        <div className="w-full flex items-center justify-between px-4 py-1 bg-[#121318] text-gray-300 text-sm playground-editor-topbar">
                            <span>{filePathModifier(titleLabel)}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCollapsechat(!collapseChat)}
                                    aria-label="Toggle files and chat layout"
                                    className={cn(
                                        'playground-editor-action-btn cursor-pointer transition-all duration-200 ease-out bg-darkest/70 rounded-[4px] border border-light/10',
                                        'hover:bg-neutral-600/10 flex items-center justify-center select-none px-1.5 py-1',
                                        collapseChat ? 'text-[#5483B3]' : 'text-light',
                                    )}
                                >
                                    <LuFile className="text-sm flex-shrink-0 transition-colors duration-200 ease-out" />
                                </button>

                                <div
                                    onClick={handleCopyFileContent}
                                    className={cn(
                                        'playground-editor-action-btn cursor-pointer transition-all duration-200 ease-out bg-darkest/70 rounded-[4px] border border-light/10',
                                        'hover:bg-neutral-600/10 flex items-center justify-center select-none px-1.5 py-1',
                                        isCopied ? 'text-[#5483B3]' : 'text-light',
                                    )}
                                >
                                    {isCopied ? (
                                        <FiCheck className="text-sm flex-shrink-0 transition-colors duration-200 ease-out" />
                                    ) : (
                                        <FiCopy className="text-sm flex-shrink-0 transition-colors duration-200 ease-out" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <Editor
                            key={collapseFileTree ? 'tree-collapsed' : 'tree-expanded'}
                            height="100%"
                            language={editorLanguage}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                            theme={getEditorTheme(theme)}
                            options={{
                                readOnly: true,
                                readOnlyMessage: {
                                    value: 'This feature will be available on the next version.',
                                },
                                minimap: { enabled: true },
                            }}
                            value={editorValue}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col gap-y-5 justify-center items-center bg-[#121318] playground-editor-empty">
                        <LighthouseMark size={152} className="text-neutral-800" />
                        <div className="text-sm tracking-wider text-neutral-500 flex items-center gap-x-2">
                            <span>Processing</span>
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function inferLanguage(filePath: string | null) {
    if (!filePath) return 'plaintext';
    const lower = filePath.toLowerCase();
    if (lower.endsWith('.tsx') || lower.endsWith('.ts')) return 'typescript';
    if (lower.endsWith('.jsx') || lower.endsWith('.js')) return 'javascript';
    if (lower.endsWith('.sol')) return 'sol';
    if (lower.endsWith('.json')) return 'json';
    if (lower.endsWith('.md')) return 'markdown';
    if (lower.endsWith('.css')) return 'css';
    if (lower.endsWith('.html')) return 'html';
    if (lower.endsWith('.rs')) return 'rust';
    if (lower.endsWith('.yml') || lower.endsWith('.yaml')) return 'yaml';
    if (lower.endsWith('.toml')) return 'ini';
    return 'plaintext';
}
