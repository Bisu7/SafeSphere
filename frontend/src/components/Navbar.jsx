import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function Navbar() {
    const { dark, setDark } = useContext(ThemeContext);

    return (
        <div className="flex justify-between p-4 bg-white dark:bg-gray-800">
            <h1 className="text-lg font-semibold">Dashboard</h1>

            <button onClick={() => setDark(!dark)}>
                {dark ? "🌙 Dark" : "☀️ Light"}
            </button>
        </div>
    );
}