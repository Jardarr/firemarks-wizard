import { useEffect, useState } from "react";

export function useDarkMode(defaultValue = false) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        return defaultValue;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.add("dark");
            root.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggle = () => setIsDark((prev) => !prev);

    return { value: isDark, toggle };
}
