// BookmarkTree.tsx
import type { BookmarkItem } from "../types/bookmarkTypes";
import { ReactSortable } from "react-sortablejs";
import BookmarkItemComponent from "./bookmarkItemComponent";

interface BookmarkTreeProps {
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

const BookmarkTree: React.FC<BookmarkTreeProps> = ({
    items,
    isRoot = true,
    parentId = null,
    onUpdate,
    darkMode,
    expandedFolders,
    toggleFolder,
}) => {
    const handleSort = (newItems: BookmarkItem[]) => {
        onUpdate(newItems, isRoot, parentId);
    };

    if (items.length === 0) return <p className="text-red-800">Нет закладок для отображения</p>;

    const columns: BookmarkItem[][] = [[], [], [], []];
    if (isRoot) {
        items.forEach((item, index) => {
            columns[index % 4].push(item);
        });
    }

    return (
        <div className="mx-2">
            {isRoot ? (
                <div className="flex flex-col md:flex-row md:gap-4">
                    {columns.map((col, colIndex) => (
                        <div
                            key={colIndex}
                            className={`flex flex-col gap-2 flex-1 text-xs w-full md:w-1/2 lg:w-1/4 my-1 md:my-0 ${
                                darkMode.value
                                    ? "text-indigo-200"
                                    : "text-amber-200"
                            }`}
                        >
                            {col.map((item) => (
                                <BookmarkItemComponent
                                    key={item.guid}
                                    item={item}
                                    expandedFolders={expandedFolders}
                                    toggleFolder={toggleFolder}
                                    onUpdate={onUpdate}
                                    isRoot={false}
                                    darkMode={darkMode}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <ReactSortable
                    tag="div"
                    list={items}
                    setList={handleSort}
                    className="flex flex-col justify-center gap-2"
                >
                    {items.map((item) => (
                        <BookmarkItemComponent
                            key={item.guid}
                            item={item}
                            expandedFolders={expandedFolders}
                            toggleFolder={toggleFolder}
                            onUpdate={onUpdate}
                            isRoot={false}
                            darkMode={darkMode}
                        />
                    ))}
                </ReactSortable>
            )}
        </div>
    );
};

export default BookmarkTree;
