import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RiskChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>No history data</div>;
    }

    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 600 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#185FA5" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#185FA5', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}