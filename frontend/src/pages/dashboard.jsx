import Card from "../components/Card";
import RiskChart from "../components/Charts/RiskChart";

export default function Dashboard() {
    return (
        <div className="grid gap-6">

            <div className="grid grid-cols-3 gap-4">
                <Card title="Risk Score" value="72%" color="text-red-500" />
                <Card title="Threats Detected" value="14" color="text-yellow-500" />
                <Card title="Safe Actions" value="32" color="text-green-500" />
            </div>

            <RiskChart />
        </div>
    );
}