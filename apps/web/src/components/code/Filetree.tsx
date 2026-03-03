/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import React, { useMemo } from 'react';
import {
    UncontrolledTreeEnvironment,
    Tree,
    StaticTreeDataProvider,
    TreeItem,
} from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@lighthouse/types';
import { AiFillFolder } from 'react-icons/ai';
import { AiFillFolderOpen } from 'react-icons/ai';
import FileIcon from '../tickers/FileIcon';
import { cn } from '@/src/lib/utils';

interface TreeData {
    [key: string]: TreeItem;
}

export default function FileTree() {
    const { fileTree, selectFile } = useCodeEditor();

    const treeData = useMemo(() => {
        const flattened: TreeData = {};

        function flattenNode(node: FileNode): void {
            const isFolder = node.type === NODE.FOLDER;

            const sortedChildren = isFolder && node.children ? sortNodes(node.children) : undefined;

            flattened[node.id] = {
                index: node.id,
                data: node.name,
                isFolder: isFolder,
                children:
                    isFolder && sortedChildren
                        ? sortedChildren.map((child) => child.id)
                        : undefined,
            };

            if (isFolder && node.children) {
                node.children.forEach((child) => flattenNode(child));
            }
        }

        fileTree.forEach((node) => flattenNode(node));

        return flattened;
    }, [fileTree]);

    function sortNodes(nodes: FileNode[]) {
        return [...nodes].sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === NODE.FOLDER ? -1 : 1;
            }

            return a.name.localeCompare(b.name);
        });
    }

    const dataProvider = new StaticTreeDataProvider(treeData, (item, data) => ({
        ...item,
        data,
    }));

    const projectName = useMemo(() => {
        const rootNode = fileTree[0];
        if (!rootNode) return 'BlackIn';
        if (rootNode.name && rootNode.name.toLowerCase() !== 'root') return rootNode.name;

        const packageJson = findNodeByFileName(rootNode, 'package.json');
        if (packageJson?.content) {
            const parsed = parsePackageJsonName(packageJson.content);
            if (parsed) return parsed;
        }

        const cargoToml = findNodeByFileName(rootNode, 'Cargo.toml');
        if (cargoToml?.content) {
            const parsed = parseCargoTomlName(cargoToml.content);
            if (parsed) return parsed;
        }

        const anchorToml = findNodeByFileName(rootNode, 'Anchor.toml');
        if (anchorToml?.content) {
            const parsed = parseAnchorTomlProgramName(anchorToml.content);
            if (parsed) return parsed;
        }

        return 'BlackIn';
    }, [fileTree]);

    return (
        <div className="playground-file-tree h-full bg-transparent flex flex-col w-full">
            <div className="shrink-0 px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 flex items-center justify-center shrink-0">
                        <AiFillFolder size={16} className="playground-file-tree-project-icon text-[#e45f5f]" />
                    </div>
                    <span className="playground-file-tree-project-name truncate text-sm font-medium tracking-wide text-[#b6efc0]">
                        {projectName}
                    </span>
                </div>
            </div>
            <div
                data-lenis-prevent
                className="flex-1 h-full overflow-y-auto custom-scrollbar soft-scroll bg-transparent"
            >
                <UncontrolledTreeEnvironment
                    dataProvider={dataProvider}
                    getItemTitle={(item) => item.data}
                    viewState={{}}
                    canDragAndDrop={false}
                    canDropOnFolder={false}
                    canReorderItems={false}
                    onSelectItems={(items) => {
                        const itemId = items[0];

                        if (itemId && itemId !== 'root') {
                            const findNode = (nodes: FileNode[], id: string): FileNode | null => {
                                for (const node of nodes) {
                                    if (node.id === id) return node;
                                    if (node.children) {
                                        const found = findNode(node.children, id);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };
                            const node = findNode(fileTree, itemId as string);

                            if (node && node.type === NODE.FILE) {
                                selectFile(node);
                            }
                        }
                    }}
                    renderItemTitle={({ item, context }) => (
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 flex items-center justify-center shrink-0 scale-100">
                                {item.isFolder ? (
                                    context.isExpanded ? (
                                        <AiFillFolderOpen
                                            size={16}
                                            className="playground-file-tree-folder-icon text-[#317FFF]"
                                        />
                                    ) : (
                                        <AiFillFolder
                                            size={16}
                                            className="playground-file-tree-folder-icon text-[#317FFF]"
                                        />
                                    )
                                ) : (
                                    <FileIcon
                                        filename={item.data}
                                        size={14}
                                        className="playground-file-tree-file-icon text-neutral-400"
                                    />
                                )}
                            </div>

                            <span
                                className={cn(
                                    'playground-file-tree-item-name w-full text-sm tracking-wide truncate scale-100',
                                    item.isFolder ? 'text-[#ebcb8a]' : 'text-[#828282] ',
                                )}
                            >
                                {item.data}
                            </span>
                        </div>
                    )}
                >
                    <div className="h-full">
                        <Tree treeId="file-tree" rootItem="root" treeLabel={projectName} />
                    </div>
                </UncontrolledTreeEnvironment>
            </div>
        </div>
    );
}

function findNodeByFileName(node: FileNode, fileName: string): FileNode | null {
    if (node.type === NODE.FILE && node.name === fileName) return node;
    if (!node.children || node.children.length === 0) return null;

    for (const child of node.children) {
        const found = findNodeByFileName(child, fileName);
        if (found) return found;
    }

    return null;
}

function parsePackageJsonName(content: string) {
    try {
        const parsed = JSON.parse(content) as { name?: string };
        if (parsed.name && parsed.name.trim()) return parsed.name.trim();
        return null;
    } catch {
        return null;
    }
}

function parseCargoTomlName(content: string) {
    const packageSectionMatch = content.match(/\[package\][\s\S]*?(?:\n\[|$)/);
    const section = packageSectionMatch ? packageSectionMatch[0] : content;
    const nameMatch = section.match(/^\s*name\s*=\s*["']([^"']+)["']/m);
    return nameMatch?.[1]?.trim() || null;
}

function parseAnchorTomlProgramName(content: string) {
    const programSections = [
        /\[programs\.localnet\][\s\S]*?(?:\n\[|$)/,
        /\[programs\.devnet\][\s\S]*?(?:\n\[|$)/,
        /\[programs\.mainnet\][\s\S]*?(?:\n\[|$)/,
    ];

    for (const pattern of programSections) {
        const sectionMatch = content.match(pattern);
        if (!sectionMatch) continue;
        const keyMatch = sectionMatch[0].match(/^\s*([a-zA-Z0-9_]+)\s*=/m);
        if (keyMatch?.[1]) return keyMatch[1].trim();
    }

    return null;
}
