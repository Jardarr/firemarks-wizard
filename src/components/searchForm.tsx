import type { DarkModeType } from "../hooks/useDarkmode";

interface SearchFormProps {
    darkMode: DarkModeType;
}

const SearchForm: React.FC<SearchFormProps> = ({ darkMode }) => {
    return (
        <form
            action="https://www.google.com/search"
            method="get"
            target="_blank"
        >
            <input
                className={`border p-2 rounded-2xl ${
                    darkMode.value
                        ? "border-indigo-500 bg-indigo-950/50 hover:bg-indigo-950/70 text-indigo-200"
                        : "border-amber-500 bg-amber-950/50 hover:bg-amber-900/70 text-amber-200"
                }`}
                type="text"
                name="q"
                placeholder="Search on Google"
            />
            <button
                className={`p-2 ml-2 cursor-pointer ${
                    darkMode.value
                        ? "bg-indigo-950/50 border-indigo-500 text-indigo-200"
                        : "bg-amber-950/50 border-amber-500 text-amber-200"
                } border rounded-2xl`}
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

export default SearchForm;
