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

    return (
        <div className="h-full bg-[#090a0b] flex flex-col w-full">
            <div className="p-3 border-b border-neutral-800 shrink-0">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Project Files
                </h2>
            </div>
            <div data-lenis-prevent className="flex-1 h-full overflow-y-auto custom-scrollbar soft-scroll">
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
                                        <AiFillFolderOpen size={16} className="text-[#317FFF]" />
                                    ) : (
                                        <AiFillFolder size={16} className="text-[#317FFF]" />
                                    )
                                ) : (
                                    <FileIcon
                                        filename={item.data}
                                        size={14}
                                        className="text-neutral-400"
                                    />
                                )}
                            </div>

                            <span
                                className={cn(
                                    'w-full text-sm tracking-wide truncate scale-100',
                                    item.isFolder ? 'text-[#ebcb8a]' : 'text-[#828282] ',
                                )}
                            >
                                {item.data}
                            </span>
                        </div>
                    )}
                >
                    <div className="h-full">
                        <Tree treeId="file-tree" rootItem="root" treeLabel="Project Files" />
                    </div>
                </UncontrolledTreeEnvironment>
            </div>
        </div>
    );
}
