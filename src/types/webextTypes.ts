// src/types/webextTypes.ts
// Полностью типизированные интерфейсы WebExtensions API для Firefox

interface WebExtBookmarkNode {
    id: string;
    parentId?: string;
    index?: number;
    title: string;
    url?: string;
    type?: 'bookmark' | 'folder' | 'separator';
    dateAdded?: number;
    dateGroupModified?: number;
    dateLastUsed?: number;
    children?: WebExtBookmarkNode[];
}

interface WebExtCreateDetails {
    parentId?: string;
    index?: number;
    title?: string;
    type?: 'bookmark' | 'folder' | 'separator';
    url?: string;
}

interface WebExtMoveDestination {
    parentId?: string;
    index?: number;
}

interface WebExtUpdateChanges {
    title?: string;
    url?: string;
}

interface WebExtBookmarksAPI {
    // Основные методы
    getTree(): Promise<WebExtBookmarkNode[]>;
    get(id: string | string[]): Promise<WebExtBookmarkNode[]>;
    getChildren(id: string): Promise<WebExtBookmarkNode[]>;
    getSubTree(id: string): Promise<WebExtBookmarkNode[]>; // ✅ добавлен метод
    create(bookmark: WebExtCreateDetails): Promise<WebExtBookmarkNode>;
    move(id: string, destination: WebExtMoveDestination): Promise<WebExtBookmarkNode>;
    update(id: string, changes: WebExtUpdateChanges): Promise<WebExtBookmarkNode>;
    remove(id: string): Promise<void>;
    removeTree(id: string): Promise<void>;

    // События
    onChanged: {
        addListener: (callback: (id: string, changeInfo: { title?: string; url?: string }) => void) => void;
        removeListener: (callback: (id: string, changeInfo: { title?: string; url?: string }) => void) => void;
    };
    onMoved: {
        addListener: (callback: (id: string, moveInfo: { parentId: string; index: number; oldParentId: string; oldIndex: number }) => void) => void;
        removeListener: (callback: (id: string, moveInfo: { parentId: string; index: number; oldParentId: string; oldIndex: number }) => void) => void;
    };
    onCreated: {
        addListener: (callback: (id: string, bookmark: WebExtBookmarkNode) => void) => void;
        removeListener: (callback: (id: string, bookmark: WebExtBookmarkNode) => void) => void;
    };
    onRemoved: {
        addListener: (callback: (id: string, removeInfo: { parentId: string; index: number; node?: WebExtBookmarkNode }) => void) => void;
        removeListener: (callback: (id: string, removeInfo: { parentId: string; index: number; node?: WebExtBookmarkNode }) => void) => void;
    };
}

interface WebExtStorageAPI {
    local: {
        get(keys?: string | string[] | Record<string, any>): Promise<Record<string, any>>;
        set(items: Record<string, any>): Promise<void>;
        remove(keys: string | string[]): Promise<void>;
        clear(): Promise<void>;
    };
}

interface WebExtBrowser {
    bookmarks: WebExtBookmarksAPI;
    storage: WebExtStorageAPI;
}

// Глобальное объявление для browser объекта
declare global {
    const browser: WebExtBrowser;
}

export type { WebExtBookmarkNode, WebExtBookmarksAPI, WebExtBrowser };
