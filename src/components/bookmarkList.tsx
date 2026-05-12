// BookmarkList.tsx
import { useBookmarks } from "../hooks/useBookmarks";
import BookmarkTree from "./bookmarkTree";

interface BookmarkListProps {
	darkMode: { value: boolean; toggle: () => void };
}

export default function BookmarkList({ darkMode }: BookmarkListProps) {
	const { bookmarks, updateBookmarks, loading, error, expandedFolders, toggleFolder } = useBookmarks();

	if (error) {
		return <p className="text-red-800">Ошибка: {error}</p>;
	}

	if (loading) {
		return <p className="text-shadow-emerald-700">Загрузка закладок...</p>;
	}

	return (
		<div>
			{bookmarks.length > 0 ? (
				<BookmarkTree
					items={bookmarks}
					onUpdate={(oldItems, newItems, _isRoot, parentId, oldIndex, newIndex) => updateBookmarks(oldItems, newItems, parentId, oldIndex, newIndex)}
					darkMode={darkMode}
					expandedFolders={expandedFolders}
					toggleFolder={toggleFolder}
				/>
			) : (
				<p className="text-red-800">Нет закладок для отображения</p>
			)}
		</div>
	);
}
