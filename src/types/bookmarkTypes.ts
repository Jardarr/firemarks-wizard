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
