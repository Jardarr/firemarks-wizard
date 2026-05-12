// src/types/webextTypes.ts

// Полностью типизированные интерфейсы
// WebExtensions API для Firefox

type BookmarkNodeType = "bookmark" | "folder" | "separator";

interface WebExtBookmarkNode {
	id: string;
	parentId?: string;
	index?: number;
	title: string;
	url?: string;
	type?: BookmarkNodeType;
	dateAdded?: number;
	dateGroupModified?: number;
	dateLastUsed?: number;
	children?: WebExtBookmarkNode[];
}

interface WebExtCreateDetails {
	parentId?: string;
	index?: number;
	title?: string;
	type?: BookmarkNodeType;
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

interface WebExtChangeInfo {
	title?: string;

	url?: string;
}

interface WebExtMoveInfo {
	parentId: string;
	index: number;
	oldParentId: string;
	oldIndex: number;
}

interface WebExtRemoveInfo {
	parentId: string;
	index: number;
	node?: WebExtBookmarkNode;
}

interface WebExtEvent<TCallback extends (...args: never[]) => void> {
	addListener(callback: TCallback): void;
	removeListener(callback: TCallback): void;
	hasListener?(callback: TCallback): boolean;
}

interface WebExtBookmarksAPI {
	// Методы

	getTree(): Promise<WebExtBookmarkNode[]>;
	get(id: string | string[]): Promise<WebExtBookmarkNode[]>;
	getChildren(id: string): Promise<WebExtBookmarkNode[]>;
	getSubTree(id: string): Promise<WebExtBookmarkNode[]>;
	create(bookmark: WebExtCreateDetails): Promise<WebExtBookmarkNode>;
	move(id: string, destination: WebExtMoveDestination): Promise<WebExtBookmarkNode>;
	update(id: string, changes: WebExtUpdateChanges): Promise<WebExtBookmarkNode>;
	remove(id: string): Promise<void>;
	removeTree(id: string): Promise<void>;

	// Events

	onChanged: WebExtEvent<(id: string, changeInfo: WebExtChangeInfo) => void>;
	onMoved: WebExtEvent<(id: string, moveInfo: WebExtMoveInfo) => void>;
	onCreated: WebExtEvent<(id: string, bookmark: WebExtBookmarkNode) => void>;
	onRemoved: WebExtEvent<(id: string, removeInfo: WebExtRemoveInfo) => void>;
}

interface WebExtStorageArea<T extends object> {
	get<K extends keyof T>(keys?: K | K[] | Partial<T>): Promise<Partial<T>>;
	set(items: Partial<T>): Promise<void>;
	remove<K extends keyof T>(keys: K | K[]): Promise<void>;
	clear(): Promise<void>;
}

interface ExtensionStorage {
	darkMode: boolean;
	bookmarksOrder: string[];
	expandedFolders: Record<string, boolean>;
}

interface WebExtStorageAPI {
	local: WebExtStorageArea<ExtensionStorage>;
}

interface WebExtBrowser {
	bookmarks: WebExtBookmarksAPI;
	storage: WebExtStorageAPI;
}

declare global {
	const browser: WebExtBrowser;
}

export type {
	BookmarkNodeType,
	WebExtBookmarkNode,
	WebExtBookmarksAPI,
	WebExtBrowser,
	WebExtStorageAPI,
	WebExtStorageArea,
	WebExtCreateDetails,
	WebExtMoveDestination,
	WebExtUpdateChanges,
	WebExtMoveInfo,
	WebExtRemoveInfo,
	WebExtChangeInfo,
	ExtensionStorage,
};
