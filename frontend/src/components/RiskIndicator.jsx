export default function RiskIndicator({ level = "low" }) {
    let color = "";
    let text = "";

    if (level === "high") {
        color = "bg-red-500";
        text = "HIGH";
    } else if (level === "medium") {
        color = "bg-yellow-500";
        text = "MEDIUM";
    } else {
        color = "bg-green-500";
        text = "LOW";
    }

    return (
        <span
            className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${color}`}
        >
            {text}
        </span>
    );
}