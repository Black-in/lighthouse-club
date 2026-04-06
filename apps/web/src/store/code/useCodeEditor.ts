/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import CodeEditorServer from '@/src/lib/server/code-editor-server';
import { FileNode, NODE } from '@lighthouse/types';
import { FileContent } from '@/src/types/stream_event_types';
import { create } from 'zustand';

interface CodeEditorState {
    currentCode: string;
    currentFile: FileNode | null;
    fileTree: FileNode[];
    originalFileContents: Record<string, string>;
    editedFiles: Record<string, FileNode>;
    livePreviewFilePath: string | null;
    livePreviewCode: string;
    collapseFileTree: boolean;
    collapseChat: boolean;
    currentCursorPosition: { ln: number; col: number };

    setCurrentCursorPosition: ({ ln, col }: { ln: number; col: number }) => void;
    setCollapseFileTree: (collapse: boolean) => void;
    setCollapsechat: (collapse: boolean) => void;
    setCurrentCode: (code: string) => void;
    setLivePreview: (filePath: string, code: string) => void;
    clearLivePreview: () => void;
    updateFileContent: (fileId: string, content: string) => void;
    deleteFile: (path: string) => void;
    selectFile: (node: FileNode) => void;
    parseFileStructure: (files: FileContent[]) => FileNode;
    syncFiles: () => Promise<void>;
    reset: () => void;
}

export const useCodeEditor = create<CodeEditorState>((set, get) => {
    return {
        currentCode: '',
        currentFile: null,
        fileTree: [],
        originalFileContents: {},
        editedFiles: {},
        livePreviewFilePath: null,
        livePreviewCode: '',
        collapseFileTree: false,
        collapseChat: false,
        currentCursorPosition: { ln: 0, col: 0 },

        setCurrentCursorPosition: ({ ln, col }: { ln: number; col: number }) =>
            set({ currentCursorPosition: { ln, col } }),
        setCollapseFileTree: (collapse: boolean) => set({ collapseFileTree: collapse }),
        setCollapsechat: (value: boolean) => set({ collapseChat: value }),
        setCurrentCode: (code: string) => {
            set({ currentCode: code });
        },
        setLivePreview: (filePath: string, code: string) => {
            set({
                livePreviewFilePath: filePath,
                livePreviewCode: code,
            });
        },
        clearLivePreview: () => {
            set({
                livePreviewFilePath: null,
                livePreviewCode: '',
            });
        },

        updateFileContent: (fileId: string, content: string) => {
            const state = get();

            const updateNode = (nodes: FileNode[]): FileNode[] =>
                nodes.map((n) =>
                    n.id === fileId
                        ? { ...n, content }
                        : n.children
                          ? { ...n, children: updateNode(n.children) }
                          : n,
                );

            const newTree = updateNode(state.fileTree);

            const file = findFileById(newTree, fileId);
            if (!file) {
                console.warn(`File with id: ${fileId} not found`);
                set({ fileTree: newTree });
                return;
            }
            const editedFiles = { ...state.editedFiles, [fileId]: file };
            const originalFileContents = { ...state.originalFileContents };
            if (originalFileContents[fileId] === undefined) {
                originalFileContents[fileId] = state.currentCode ?? '';
            }

            set({
                fileTree: newTree,
                originalFileContents,
                editedFiles,
                currentCode: content,
            });
        },

        deleteFile: (id: string) => {
            const state = get();

            function removeNodeById(nodes: FileNode[]): FileNode[] {
                return nodes
                    .filter((n) => n.id !== id)
                    .map((n) => ({
                        ...n,
                        children: n.children ? removeNodeById(n.children) : undefined,
                    }));
            }

            const newTree = removeNodeById(state.fileTree);

            const isCurrentDeleted = state.currentFile?.id === id;

            set({
                fileTree: newTree,
                currentFile: isCurrentDeleted ? null : state.currentFile,
                currentCode: isCurrentDeleted ? '' : state.currentCode,
            });
        },

        selectFile: (node: FileNode) => {
            if (node.type === NODE.FILE) {
                set({
                    currentFile: node,
                    currentCode: node.content ?? '',
                });
            }
        },

        parseFileStructure: (files: FileContent[]) => {
            const state = get();
            const nextTree: FileNode = {
                id: 'root',
                name: inferProjectNameFromFiles(files),
                type: NODE.FOLDER,
                children: [],
            };
            const nextOriginalFileContents = { ...state.originalFileContents };

            // Helper: recursively find folder by path
            function findOrCreateFolder(root: FileNode, parts: string[]): FileNode {
                let current = root;
                let currentPath = '';

                for (const part of parts) {
                    currentPath = currentPath ? `${currentPath}/${part}` : part;
                    let child = current.children?.find(
                        (c) => c.name === part && c.type === NODE.FOLDER,
                    );
                    if (!child) {
                        child = {
                            id: currentPath,
                            name: part,
                            type: NODE.FOLDER,
                            children: [],
                        };
                        current.children!.push(child);
                    }
                    current = child;
                }
                return current;
            }

            // Helper: recursively remove node by id
            function removeNodeById(nodes: FileNode[], id: string): FileNode[] {
                return nodes
                    .filter((n) => n.id !== id)
                    .map((n) => ({
                        ...n,
                        children: n.children ? removeNodeById(n.children, id) : undefined,
                    }));
            }

            // Append or replace files
            for (const { path, content } of files) {
                const parts = path.split('/').filter(Boolean);
                const fileName = parts.pop();
                if (!fileName) continue;
                if (nextOriginalFileContents[path] === undefined) {
                    nextOriginalFileContents[path] = content;
                }

                const parentFolder = findOrCreateFolder(nextTree, parts);
                const fileId = parts.length ? `${parts.join('/')}/${fileName}` : fileName;

                // Remove any existing file with same id before adding
                parentFolder.children = removeNodeById(parentFolder.children || [], fileId);

                parentFolder.children!.push({
                    id: fileId,
                    name: fileName,
                    type: NODE.FILE,
                    content,
                });
            }

            const activeFile =
                (state.currentFile && findFileById([nextTree], state.currentFile.id)) ||
                findFirstFile(nextTree) ||
                null;

            set({
                fileTree: [nextTree],
                originalFileContents: nextOriginalFileContents,
                currentFile: activeFile,
                currentCode: activeFile?.content ?? '',
                livePreviewFilePath: null,
                livePreviewCode: '',
            });
            return nextTree;
        },

        syncFiles: async () => {
            const { editedFiles } = get();
            const files = Object.values(editedFiles);

            if (files.length === 0) {
                return;
            }

            try {
                await CodeEditorServer.syncFiles(files, 'pass-the-token-here');
                set({ editedFiles: {} });
            } catch (error) {
                console.error('Failed to sync files:', error);
            }
        },

        reset: () => {
            set({
                fileTree: [],
                originalFileContents: {},
                currentFile: null,
                currentCode: '',
                editedFiles: {},
                livePreviewFilePath: null,
                livePreviewCode: '',
            });
        },
    };
});

function inferProjectNameFromFiles(files: FileContent[]) {
    const packageJson = files.find((file) => file.path === 'package.json');
    if (packageJson?.content) {
        try {
            const parsed = JSON.parse(packageJson.content) as { name?: string };
            if (parsed.name?.trim()) return parsed.name.trim();
        } catch {
            // Ignore invalid package.json content and continue with other strategies.
        }
    }

    const cargoToml = files.find((file) => file.path.endsWith('Cargo.toml'));
    if (cargoToml?.content) {
        const packageSectionMatch = cargoToml.content.match(/\[package\][\s\S]*?(?:\n\[|$)/);
        const section = packageSectionMatch ? packageSectionMatch[0] : cargoToml.content;
        const nameMatch = section.match(/^\s*name\s*=\s*["']([^"']+)["']/m);
        if (nameMatch?.[1]?.trim()) return nameMatch[1].trim();
    }

    const anchorToml = files.find((file) => file.path.endsWith('Anchor.toml'));
    if (anchorToml?.content) {
        const programSections = [
            /\[programs\.localnet\][\s\S]*?(?:\n\[|$)/,
            /\[programs\.devnet\][\s\S]*?(?:\n\[|$)/,
            /\[programs\.mainnet\][\s\S]*?(?:\n\[|$)/,
        ];

        for (const pattern of programSections) {
            const match = anchorToml.content.match(pattern);
            if (!match) continue;
            const nameMatch = match[0].match(/^\s*([A-Za-z0-9_-]+)\s*=\s*["'][^"']+["']/m);
            if (nameMatch?.[1]?.trim()) return nameMatch[1].trim();
        }
    }

    const topLevelFolder = files
        .map((file) => file.path.split('/').filter(Boolean)[0])
        .find((segment) => segment && !segment.includes('.'));
    if (topLevelFolder) return topLevelFolder;

    return 'BlackIn';
}

function findFileById(nodes: FileNode[], id: string): FileNode | null {
    for (const node of nodes) {
        if (node.id === id) return node;

        if (node.children) {
            const found = findFileById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

function findFirstFile(node: FileNode): FileNode | null {
    if (node.type === NODE.FILE) return node;
    if (!node.children || node.children.length === 0) return null;

    for (const child of node.children) {
        const found = findFirstFile(child);
        if (found) return found;
    }

    return null;
}
