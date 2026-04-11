import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/auth/login");
    };

    return (
        <div className="flex justify-between p-4 bg-white dark:bg-gray-800">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}