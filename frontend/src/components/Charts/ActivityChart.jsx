import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", activity: 20 },
  { day: "Tue", activity: 45 },
  { day: "Wed", activity: 30 },
  { day: "Thu", activity: 60 },
  { day: "Fri", activity: 40 },
  { day: "Sat", activity: 70 },
  { day: "Sun", activity: 50 },
];

export default function ActivityChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Weekly Activity
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="activity"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}