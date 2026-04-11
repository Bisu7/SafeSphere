export default function Card({ title, value, color = "text-blue-500", icon = null }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition">

            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
            </div>

            {icon && (
                <div className="text-gray-400 dark:text-gray-300">
                    {icon}
                </div>
            )}
        </div>
    );
}