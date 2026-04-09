'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { BadgeCheck, FileCode2, LoaderCircle } from 'lucide-react';
import { usePacedText } from '@/src/hooks/usePacedText';
import { cn } from '@/src/lib/utils';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

type AgentLiveWorkbenchProps = {
    filePath: string | null;
    code: string;
    isStreaming: boolean;
    statusLabel: string;
    phaseLabel: string;
    className?: string;
    editorClassName?: string;
};

function languageFromPath(filePath: string | null) {
    if (!filePath) return 'typescript';
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
    return 'plaintext';
}

function syntheticPreview(filePath: string | null, phaseLabel: string) {
    if (!filePath) {
        return `// Agent boot sequence\n// ${phaseLabel}\n\nexport const status = "warming up"\n`;
    }

    const lower = filePath.toLowerCase();
    if (lower.endsWith('.sol')) {
        return `// Drafting secure contract structure\n// ${phaseLabel}\npragma solidity ^0.8.24;\n\ncontract DraftContract {\n    // agent is sketching the contract surface...\n}\n`;
    }

    if (lower.endsWith('.tsx') || lower.endsWith('.ts')) {
        return `// ${phaseLabel}\nexport function AgentDraft() {\n    return {\n        status: "writing",\n        file: "${filePath}",\n    };\n}\n`;
    }

    if (lower.endsWith('.json')) {
        return `{\n  "status": "drafting",\n  "phase": "${phaseLabel}",\n  "file": "${filePath}"\n}\n`;
    }

    if (lower.endsWith('.md')) {
        return `# ${filePath}\n\n- phase: ${phaseLabel}\n- status: drafting\n`;
    }

    return `# ${filePath}\n# ${phaseLabel}\n# Agent is preparing this file...\n`;
}

function lineAndColumn(text: string) {
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines.at(-1)?.length ?? 0;
    return { line, column };
}

export default function AgentLiveWorkbench({
    filePath,
    code,
    isStreaming,
    statusLabel,
    phaseLabel,
    className,
    editorClassName,
}: AgentLiveWorkbenchProps) {
    const { theme } = usePlaygroundThemeStore();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const displayCode = useMemo(
        () => (code.trim().length > 0 ? code : syntheticPreview(filePath, phaseLabel)),
        [code, filePath, phaseLabel],
    );
    const pacedCode = usePacedText(displayCode, isStreaming);
    const language = useMemo(() => languageFromPath(filePath), [filePath]);
    const location = useMemo(() => lineAndColumn(pacedCode), [pacedCode]);

    const beforeMount = useCallback((monaco: Monaco) => {
        monaco.editor.defineTheme('agent-preview-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'D6D6D6', background: '141212' },
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
                'editorGutter.background': '#141212',
            },
        });

        monaco.editor.defineTheme('agent-preview-light', {
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
                'editorGutter.background': '#F7F9FD',
            },
        });
    }, []);

    const monacoTheme = theme === 'light' ? 'agent-preview-light' : 'agent-preview-dark';
    const frameClasses =
        theme === 'light'
            ? 'border-neutral-300 bg-[#f8fbff]'
            : theme === 'dark'
              ? 'border-[#302b2b] bg-[#171515]'
              : 'border-neutral-800 bg-[#0d0f10]';
    const headerClasses =
        theme === 'light'
            ? 'border-neutral-200 bg-[#f2f7fd] text-[#334155]'
            : theme === 'dark'
              ? 'border-[#2b2626] bg-[#141212] text-neutral-200'
              : 'border-neutral-800 bg-[#111315] text-neutral-200';
    const badgeClasses =
        theme === 'light'
            ? 'border-[#d4e2f3] bg-white text-[#475569]'
            : theme === 'dark'
              ? 'border-[#3a3434] bg-[#1b1818] text-neutral-300'
              : 'border-neutral-700 bg-[#17191a] text-neutral-300';
    const footerClasses =
        theme === 'light'
            ? 'border-neutral-200 bg-[#f2f7fd] text-[#64748b]'
            : theme === 'dark'
              ? 'border-[#2b2626] bg-[#141212] text-neutral-400'
              : 'border-neutral-800 bg-[#111315] text-neutral-400';

    useEffect(() => {
        const instance = editorRef.current;
        if (!instance) return;
        const model = instance.getModel();
        if (!model) return;

        const lastLine = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLine);
        instance.setPosition({ lineNumber: lastLine, column: lastColumn });
        instance.revealLine(lastLine);
    }, [pacedCode]);

    useEffect(() => {
        const monaco = monacoRef.current;
        if (!monaco) return;
        monaco.editor.setTheme(monacoTheme);
    }, [monacoTheme]);

    return (
        <div className={cn('flex h-full flex-col overflow-hidden rounded-[8px] border', frameClasses, className)}>
            <div className={cn('flex items-center justify-between border-b px-4 py-2.5', headerClasses)}>
                <div className="flex min-w-0 items-center gap-2 text-sm">
                    <FileCode2 className="h-4 w-4 text-[#8fb7ff]" />
                    <span className="truncate font-medium">{filePath || 'agent/session.ts'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1', badgeClasses)}>
                        {isStreaming ? (
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#8fb7ff]" />
                        ) : (
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span>{statusLabel}</span>
                    </div>
                </div>
            </div>

            <div className={cn('h-56', editorClassName)}>
                <Editor
                    height="100%"
                    language={language}
                    value={pacedCode}
                    beforeMount={beforeMount}
                    onMount={(instance, monaco) => {
                        editorRef.current = instance;
                        monacoRef.current = monaco;
                        monaco.editor.setTheme(monacoTheme);
                    }}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        contextmenu: false,
                        fontSize: 13,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        padding: { top: 12, bottom: 12 },
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        cursorStyle: 'line',
                        overviewRulerBorder: false,
                    }}
                />
            </div>

            <div className={cn('flex items-center justify-between border-t px-4 py-2 text-[11px]', footerClasses)}>
                <span>{phaseLabel}</span>
                <span>
                    Ln {location.line}, Col {location.column}
                </span>
            </div>
        </div>
    );
}
