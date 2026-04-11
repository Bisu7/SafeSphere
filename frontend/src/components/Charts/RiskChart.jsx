import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { name: "Mon", risk: 30 },
    { name: "Tue", risk: 60 },
    { name: "Wed", risk: 20 },
];

export default function RiskChart() {
    return (
        <LineChart width={400} height={200} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" />
        </LineChart>
    );
}