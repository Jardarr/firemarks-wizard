import { useEffect, useState } from "react";
import type { BookmarkItem } from "../types/bookmarkTypes";
import type { WebExtBookmarkNode } from "../types/webextTypes";

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isBrowserExtension, setIsBrowserExtension] =
        useState<boolean>(false);
    const [expandedFolders, setExpandedFolders] = useState<
        Record<string, boolean>
    >({});

    const convertFirefoxBookmarks = (
        node: WebExtBookmarkNode
    ): BookmarkItem => {
        const item: BookmarkItem = {
            guid: node.id,
            title: node.title || "",
            id: parseInt(node.id) || 0,
            typeCode: node.type === "folder" ? 2 : 1,
            type:
                node.type === "folder"
                    ? "text/x-moz-place-container"
                    : "text/x-moz-place",
            uri: node.url,
            dateAdded: node.dateAdded,
            lastModified: node.dateLastUsed,
        };
        if (node.children && node.children.length > 0) {
            item.children = node.children.map((c) =>
                convertFirefoxBookmarks(c)
            );
        }
        return item;
    };

    const findMenuNode = (
        node: WebExtBookmarkNode | null
    ): WebExtBookmarkNode | null => {
        if (!node) return null;
        if (
            node.id === "menu________" ||
            (node.id && String(node.id).startsWith("menu"))
        ) {
            return node;
        }
        if (Array.isArray(node.children)) {
            for (const ch of node.children) {
                const found = findMenuNode(ch);
                if (found) return found;
            }
        }
        return null;
    };

    const getBookmarks = async () => {
        setLoading(true);
        setError(null);
        try {
            const bookmarksAPI =
                typeof browser !== "undefined" ? browser.bookmarks : undefined;
            if (bookmarksAPI && typeof bookmarksAPI.getTree === "function") {
                const tree: WebExtBookmarkNode[] = await bookmarksAPI.getTree();
                const root = tree?.[0];
                const menuNode = findMenuNode(root) || root;
                const nodes = menuNode?.children ?? [];
                const converted = nodes.map((n) => convertFirefoxBookmarks(n));
                setBookmarks(converted);
                setIsBrowserExtension(true);
                setExpandedFolders((prev) => {
                    const newState: Record<string, boolean> = {};
                    converted.forEach((item) => {
                        if (
                            item.typeCode === 2 &&
                            prev[item.guid] !== undefined
                        ) {
                            newState[item.guid] = prev[item.guid];
                        }
                    });
                    return newState;
                });
                setLoading(false);
                return;
            }
            const resp = await fetch("/bookmarks.json");
            const data = await resp.json();
            const bookmarksMenuFolder = data.children?.find(
                (folder: any) =>
                    folder.id && String(folder.id).startsWith("menu")
            );
            const nodes = bookmarksMenuFolder?.children ?? data.children ?? [];
            setBookmarks(nodes.map((n: any) => convertFirefoxBookmarks(n)));
        } catch (err) {
            console.error("Ошибка при загрузке закладок:", err);
            setError("Не удалось загрузить закладки");
        } finally {
            setLoading(false);
        }
    };

    const updateBookmarks = async (
        newItems: BookmarkItem[],
        parentId: string | null = null
    ) => {
        if (!isBrowserExtension) {
            if (!parentId) {
                setBookmarks(newItems);
                return;
            }
            const updateNested = (list: BookmarkItem[]): BookmarkItem[] =>
                list.map((item) => {
                    if (item.guid === parentId)
                        return { ...item, children: newItems };
                    if (item.children)
                        return {
                            ...item,
                            children: updateNested(item.children),
                        };
                    return item;
                });
            setBookmarks((prev) => updateNested(prev));
            return;
        }

        const bookmarksAPI = browser.bookmarks;
        const effectiveParentId = parentId || "menu________";

        try {
            for (const [index, item] of newItems.entries()) {
                await bookmarksAPI.move(item.guid, {
                    parentId: effectiveParentId,
                    index,
                });
            }
            if (!parentId) {
                setBookmarks(newItems);
            } else {
                const updateNested = (list: BookmarkItem[]): BookmarkItem[] =>
                    list.map((item) => {
                        if (item.guid === parentId)
                            return { ...item, children: newItems };
                        if (item.children)
                            return {
                                ...item,
                                children: updateNested(item.children),
                            };
                        return item;
                    });
                setBookmarks((prev) => updateNested(prev));
            }
        } catch (err) {
            console.error("Ошибка при обновлении закладок:", err);
            setError("Не удалось обновить закладки");
        }
    };

    const toggleFolder = (guid: string) => {
        console.log(
            "Toggling folder:",
            guid,
            "Current state:",
            expandedFolders[guid]
        );
        setExpandedFolders((prev) => ({
            ...prev,
            [guid]: !prev[guid],
        }));
    };

    useEffect(() => {
        void getBookmarks();

        const bookmarksAPI =
            typeof browser !== "undefined" ? browser.bookmarks : undefined;
        if (!bookmarksAPI) return;

        let timeout: any = null;
        const reload = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                void getBookmarks();
            }, 500);
        };

        bookmarksAPI.onChanged?.addListener?.(reload);
        bookmarksAPI.onMoved?.addListener?.(reload);
        bookmarksAPI.onCreated?.addListener?.(reload);
        bookmarksAPI.onRemoved?.addListener?.(reload);

        return () => {
            try {
                bookmarksAPI.onChanged?.removeListener?.(reload);
                bookmarksAPI.onMoved?.removeListener?.(reload);
                bookmarksAPI.onCreated?.removeListener?.(reload);
                bookmarksAPI.onRemoved?.removeListener?.(reload);
            } catch {
                // Игнорируем ошибки
            }
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    return {
        bookmarks,
        updateBookmarks,
        loading,
        error,
        isBrowserExtension,
        expandedFolders,
        toggleFolder,
    };
};
