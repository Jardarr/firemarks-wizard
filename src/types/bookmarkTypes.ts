export interface BookmarkItem {
	guid: string;
	title: string;
	id: number;
	typeCode: number;
	type: string;
	url?: string;
	children?: BookmarkItem[];
	dateAdded?: number;
	lastModified?: number;
}

export interface BookmarkTreeProps {
	items: BookmarkItem[];
	isRoot?: boolean;
	parentId?: string | null;
	onUpdate: (oldItems: BookmarkItem[], newItems: BookmarkItem[], isRoot: boolean, parentId: string | null, oldIndex?: number, newIndex?: number) => void;
	darkMode: { value: boolean; toggle: () => void };
	expandedFolders: Record<string, boolean>;
	toggleFolder: (guid: string) => void;
}
