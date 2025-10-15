import BookmarkList from "./components/bookmarkList";
import { useDarkMode } from "./hooks/useDarkmode";
function App() {
    const darkMode = useDarkMode(false);

    return (
        <div
            className={`min-h-screen ${
                darkMode.value ? 'bg-[url("/wd.jpg")]' : 'bg-[url("/ww.jpg")]'
            } flex flex-col bg-cover bg-fixed bg-center bg-no-repeat font-Pixel`}
        >
            <div className="flex items-center justify-between p-4">
                <div
                    className={`text-base font-bold text-amber-600 p-2 ${
                        darkMode.value
                            ? "bg-indigo-950/50 border-indigo-500"
                            : "bg-amber-950/50 border-amber-500"
                    } border rounded-2xl`}
                >
                    Firemarks<span className="text-indigo-600">Wizard</span>
                </div>
                <button onClick={darkMode.toggle} aria-label="Toggle theme">
                    <img
                        className="w-12 h-12 rounded-lg transition duration-300"
                        src={darkMode.value ? "/fmwd.png" : "/fmw.png"}
                        alt="firemarks wizard"
                    />
                </button>
            </div>
            <BookmarkList darkMode={darkMode} />
        </div>
    );
}

export default App;
