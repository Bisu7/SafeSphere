import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 bg-white dark:bg-gray-800 p-4">
            <h2 className="text-xl font-bold mb-6">SafeSphere</h2>

            <nav className="space-y-3">
                <Link to="/">Dashboard</Link>
                <Link to="/scam">Scam Detection</Link>
                <Link to="/privacy">Privacy Monitor</Link>
                <Link to="/financial">Financial Risk</Link>
                <Link to="/advisor">Security Advisor</Link>
            </nav>
        </div>
    );
}