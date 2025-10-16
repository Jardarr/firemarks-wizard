export interface BookmarkItem {
    guid: string;
    title: string;
    id: number;
    typeCode: number;
    type: string;
    uri?: string;
    children?: BookmarkItem[];
    dateAdded?: number;
    lastModified?: number;
}

export interface BookmarkTreeProps {
    items: BookmarkItem[];
    isRoot?: boolean;
    parentId?: string | null;
    onUpdate: (
        newItems: BookmarkItem[],
        isRoot: boolean,
        parentId: string | null
    ) => void;
    darkMode: { value: boolean; toggle: () => void };
    expandedFolders: Record<string, boolean>;
    toggleFolder: (guid: string) => void;
}