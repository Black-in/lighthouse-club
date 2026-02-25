/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/src/lib/utils';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { flattenFileTree, searchFiles } from '@/src/lib/file_tree_helper';
import { FlatFile, FileNode } from '@lighthouse/types';
import useShortcuts from '@/src/hooks/useShortcut';

export default function BuilderNavbarSearchComponent() {
    const { fileTree, selectFile } = useCodeEditor();
    const [inputValue, setInputValue] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<FlatFile[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const flatFiles = useMemo(() => {
        if (!fileTree || fileTree.length === 0) return [];
        return flattenFileTree(fileTree[0]);
    }, [fileTree]);

    function expandSearch() {
        setIsExpanded(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    }

    function collapseSearch() {
        setInputValue('');
        setSearchResults([]);
        setShowDropdown(false);
        setSelectedIndex(0);
        setIsExpanded(false);
    }

    useShortcuts({
        'meta+k': () => expandSearch(),
        'ctrl+k': () => expandSearch(),
    });

    useEffect(() => {
        function handleOpenSearchBar() {
            expandSearch();
        }
        window.addEventListener('open-search-bar', handleOpenSearchBar);
        return () => window.removeEventListener('open-search-bar', handleOpenSearchBar);
    }, []);

    useEffect(() => {
        if (inputValue.trim()) {
            const results = searchFiles(flatFiles, inputValue);
            setSearchResults(results);
            setShowDropdown(results.length > 0);
            setSelectedIndex(0);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [inputValue, flatFiles]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                if (!inputValue.trim()) {
                    setIsExpanded(false);
                }
            }
        }
        if (showDropdown || isExpanded) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown, isExpanded, inputValue]);

    function handleFileSelect(file: FlatFile) {
        const fileNode = findFileInTree(fileTree, file.id);
        if (fileNode) selectFile(fileNode);
        setInputValue('');
        setShowDropdown(false);
        setSelectedIndex(0);
    }

    function findFileInTree(nodes: FileNode[], id: string): FileNode | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findFileInTree(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
            e.preventDefault();
            collapseSearch();
            return;
        }
        if (!showDropdown || searchResults.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (searchResults[selectedIndex]) handleFileSelect(searchResults[selectedIndex]);
                break;
        }
    }

    return (
        <div className="playground-nav-search relative" ref={dropdownRef}>
            {!isExpanded ? (
                <button
                    type="button"
                    onClick={expandSearch}
                    className="playground-nav-search-trigger inline-flex h-8 items-center gap-2 rounded-full bg-[#0c0f12] px-4 text-xs tracking-wide text-light/80 transition-colors hover:bg-[#141920] hover:text-light"
                >
                    <Search className="size-3.5" />
                    Search
                </button>
            ) : (
                <div className="relative w-[18rem] transition-all duration-200">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                        /
                    </span>
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue && setShowDropdown(true)}
                        className={cn(
                            'playground-nav-search-input rounded-full border border-neutral-700 pl-4 p-0 px-4 h-8 !text-xs tracking-wide min-w-[18rem] text-light/80',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0px]',
                            'tracking-wider',
                        )}
                        placeholder="search references (e.g. pricing.tsx)"
                    />
                    <button
                        type="button"
                        onClick={collapseSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 text-xs cursor-pointer"
                        aria-label="Collapse search"
                    >
                        <ChevronRight className="size-3" />
                    </button>
                </div>
            )}

            {isExpanded && showDropdown && searchResults.length > 0 && (
                <div className="playground-nav-search-dropdown absolute top-full mt-1 bg-darkest border border-neutral-800 rounded-[4px] shadow-lg max-h-[300px] w-full min-w-[18rem] overflow-y-auto z-50">
                    {searchResults.map((file, index) => (
                        <div
                            key={file.id}
                            onClick={() => handleFileSelect(file)}
                            className={cn(
                                'playground-nav-search-item px-3 py-2 cursor-pointer text-xs hover:bg-dark transition-colors flex items-center justify-between',
                                index === selectedIndex && 'bg-dark',
                            )}
                        >
                            <div className="playground-nav-search-item-name font-medium text-light">
                                {file.name}
                            </div>
                            <div className="playground-nav-search-item-path text-light/50 text-[10px] mt-0.5 text-right">
                                {file.path}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
