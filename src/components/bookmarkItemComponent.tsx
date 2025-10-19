import type { BookmarkItem } from "../types/bookmarkTypes";
import BookmarkTree from "./bookmarkTree";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkItemComponentProps {
    item: BookmarkItem;
    expandedFolders: Record<string, boolean>;
    toggleFolder: (guid: string) => void;
    onUpdate: (
        newItems: BookmarkItem[],
        isRoot: boolean,
        parentId: string | null
    ) => void;
    isRoot: boolean;
    darkMode: { value: boolean; toggle: () => void };
}

const BookmarkItemComponent: React.FC<BookmarkItemComponentProps> = ({
    item,
    expandedFolders,
    toggleFolder,
    onUpdate,
    darkMode,
}) => {
    if (item.typeCode === 1) {
        return (
            <a
                href={item.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center whitespace-nowrap overflow-hidden hover:underline"
            >
                <img
                    src={`https://www.google.com/s2/favicons?domain=${item.uri}`}
                    alt="Favicon"
                    className="w-4 h-4 mr-1"
                />
                {item.title || item.uri || ""}
            </a>
        );
    }

    return (
        <div
            className={`border rounded-sm ${
                darkMode.value
                    ? "border-indigo-500 bg-indigo-950/50"
                    : "border-amber-500 bg-amber-950/50"
            }`}
        >
            <strong
                className="m-2 flex cursor-pointer items-center justify-between"
                onClick={() => toggleFolder(item.guid)}
            >
                <div className="flex items-center">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
                    </svg>
                    <span>{item.title}</span>
                </div>
                <span className={expandedFolders[item.guid] ? "rotate-90" : ""}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </span>
            </strong>
            <AnimatePresence>
                {item.children &&
                    item.children.length > 0 &&
                    expandedFolders[item.guid] && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="m-2 overflow-hidden"
                        >
                            <BookmarkTree
                                items={item.children}
                                isRoot={false}
                                parentId={item.guid}
                                onUpdate={onUpdate}
                                darkMode={darkMode}
                                expandedFolders={expandedFolders}
                                toggleFolder={toggleFolder}
                            />
                        </motion.div>
                    )}
            </AnimatePresence>
        </div>
    );
};

export default BookmarkItemComponent;
