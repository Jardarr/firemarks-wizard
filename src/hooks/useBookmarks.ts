import { useCallback, useEffect, useRef, useState } from "react";
import type { BookmarkItem } from "../types/bookmarkTypes";
import type { WebExtBookmarkNode } from "../types/webextTypes";
const isBrowserExtension = typeof browser !== "undefined" && typeof browser.bookmarks !== "undefined";

const findMenuNode = (nodes: WebExtBookmarkNode[]): WebExtBookmarkNode | null => {
	for (const node of nodes) {
		if (node.id && String(node.id).startsWith("menu")) {
			return node;
		}
		if (node.children) {
			const found = findMenuNode(node.children);
			if (found) {
				return found;
			}
		}
	}
	return null;
};

const convertFirefoxBookmarks = (node: WebExtBookmarkNode): BookmarkItem => {
	const isFolder = node.type === "folder";
	return {
		guid: node.id,
		title: node.title || "",
		id: Number(node.id) || 0,
		typeCode: isFolder ? 2 : 1,
		type: isFolder ? "text/x-moz-place-container" : "text/x-moz-place",
		url: node.url,
		dateAdded: node.dateAdded,
		lastModified: node.dateGroupModified ?? node.dateLastUsed,
		children: node.children?.map(convertFirefoxBookmarks),
	};
};

export function useBookmarks() {
	const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
	const isUpdatingRef = useRef(false);
	const getBookmarks = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			if (!isBrowserExtension) {
				setBookmarks([]);
				return;
			}
			const tree = await browser.bookmarks.getTree();
			if (!tree.length) {
				setBookmarks([]);
				return;
			}
			const root = tree[0];
			const menuNode = root.children ? findMenuNode(root.children) : null;
			if (!menuNode?.children) {
				setBookmarks([]);
				return;
			}
			setBookmarks(menuNode.children.map(convertFirefoxBookmarks));
		} catch (err: unknown) {
			console.error("Ошибка загрузки закладок:", err);
			setError("Не удалось загрузить закладки");
		} finally {
			setLoading(false);
		}
	}, []);

	const updateBookmarks = async (oldItems: BookmarkItem[], newItems: BookmarkItem[], parentId: string | null = null, oldIndex?: number, newIndex?: number) => {
		const updateNested = (list: BookmarkItem[]): BookmarkItem[] =>
			list.map((item) => {
				if (item.guid === parentId) {
					return {
						...item,
						children: newItems,
					};
				}
				if (item.children) {
					return {
						...item,
						children: updateNested(item.children),
					};
				}
				return item;
			});

		if (!isBrowserExtension) {
			if (!parentId) {
				setBookmarks(newItems);
			} else {
				setBookmarks((prev) => updateNested(prev));
			}
			return;
		}

		const bookmarksAPI = browser.bookmarks;
		// Firefox bookmarks menu root
		const effectiveParentId = parentId || "menu________";
		try {
			isUpdatingRef.current = true;
			// Optimistic UI update
			if (!parentId) {
				setBookmarks(newItems);
			} else {
				setBookmarks((prev) => updateNested(prev));
			}

			// Sync with Firefox
			if (oldIndex === undefined || newIndex === undefined) {
				return;
			}
			const movedItem = oldItems[oldIndex];
			if (!movedItem) {
				return;
			}
			await bookmarksAPI.move(movedItem.guid, {
				parentId: effectiveParentId,
				index: newIndex,
			});
		} catch (err: unknown) {
			console.error("Ошибка обновления закладок:", err);
			setError("Не удалось обновить закладки");
		} finally {
			setTimeout(() => {
				isUpdatingRef.current = false;
			}, 300);
		}
	};

	const toggleFolder = (guid: string) => {
		setExpandedFolders((prev) => ({
			...prev,
			[guid]: !prev[guid],
		}));
	};
	useEffect(() => {
		void getBookmarks();
		if (!isBrowserExtension) {
			return;
		}
		const bookmarksAPI = browser.bookmarks;
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const reload = () => {
			// Игнорируем события,
			// вызванные нашим reorder
			if (isUpdatingRef.current) {
				return;
			}
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				void getBookmarks();
			}, 300);
		};
		try {
			bookmarksAPI.onChanged?.addListener?.(reload);
			bookmarksAPI.onMoved?.addListener?.(reload);
			bookmarksAPI.onCreated?.addListener?.(reload);
			bookmarksAPI.onRemoved?.addListener?.(reload);
		} catch (err: unknown) {
			console.error("Ошибка listeners:", err);
		}
		return () => {
			try {
				bookmarksAPI.onChanged?.removeListener?.(reload);
				bookmarksAPI.onMoved?.removeListener?.(reload);
				bookmarksAPI.onCreated?.removeListener?.(reload);
				bookmarksAPI.onRemoved?.removeListener?.(reload);
			} catch {
				// ignore
			}
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [getBookmarks]);
	return {
		bookmarks,
		loading,
		error,
		expandedFolders,
		toggleFolder,
		updateBookmarks,
	};
}
