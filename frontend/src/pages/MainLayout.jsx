import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}