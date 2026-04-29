import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import RiskChart from "../components/Charts/RiskChart";

// ─── helpers ───────────────────────────────────────────────────────────────

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
}

// ─── inline icon helpers ───────────────────────────────────────────────────

function ShieldIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L3 5v4c0 3 2.5 5 5 6 2.5-1 5-3 5-6V5L8 2z" stroke="#3B6D11" strokeWidth="1.2" />
            <path d="M6 8l1.5 1.5L10 7" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#BA7517" strokeWidth="1.2" />
            <path d="M8 5v3l2 2" stroke="#BA7517" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

function ScanIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="#185FA5" strokeWidth="1.2" />
            <path d="M5 8h6M5 5h6M5 11h4" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

// ─── threat breakdown donut chart ─────────────────────────────────────────

function ThreatDonut({ activity }) {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    // Group by type
    const counts = {
        url: activity.filter(a => a.type === 'url').length,
        text: activity.filter(a => a.type === 'text').length,
        image: activity.filter(a => a.type === 'image').length,
        form: activity.filter(a => a.type === 'form').length,
    };

    const displayData = [
        { label: "URLs", count: counts.url, color: "#185FA5" },
        { label: "Text", count: counts.text, color: "#639922" },
        { label: "Images", count: counts.image, color: "#BA7517" },
        { label: "Forms", count: counts.form, color: "#E24B4A" },
    ].filter(d => d.count > 0);

    useEffect(() => {
        let cancelled = false;

        function init() {
            if (!window.Chart || !canvasRef.current || cancelled) return;
            if (instanceRef.current) instanceRef.current.destroy();
            instanceRef.current = new window.Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: displayData.map((d) => d.label),
                    datasets: [{
                        data: displayData.map((d) => d.count),
                        backgroundColor: displayData.map((d) => d.color),
                        borderWidth: 0,
                        hoverOffset: 4,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: { legend: { display: false } },
                },
            });
        }

        if (!window.Chart) {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            script.onload = init;
            document.head.appendChild(script);
        } else {
            init();
        }

        return () => {
            cancelled = true;
            instanceRef.current?.destroy();
        };
    }, [activity]);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {displayData.map((d) => (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        {d.label} — {d.count}
                    </div>
                ))}
                {displayData.length === 0 && <div style={{ fontSize: 12, color: "#9ca3af" }}>No data yet</div>}
            </div>
            <div style={{ position: "relative", height: 140 }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}

// ─── recent threats list ──────────────────────────────────────────────────

function RecentActivityList({ activity }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activity.map((t) => {
                const isSafe = t.verdict === "Safe";
                const dotColor = isSafe ? "#639922" : (t.score > 0.7 ? "#E24B4A" : "#BA7517");
                const badgeBg = isSafe ? "#EAF3DE" : (t.score > 0.7 ? "#FCEBEB" : "#FAEEDA");
                const badgeTc = isSafe ? "#27500A" : (t.score > 0.7 ? "#791F1F" : "#633806");

                return (
                    <div
                        key={t.id}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "8px 10px", background: "#f8fafc", borderRadius: 8,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{t.type.toUpperCase()} Scan: {t.target.substring(0, 30)}...</div>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{formatTimeAgo(t.time)}</div>
                            </div>
                        </div>
                        <div style={{
                            fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
                            background: badgeBg, color: badgeTc, flexShrink: 0,
                        }}>
                            {t.verdict}
                        </div>
                    </div>
                );
            })}
            {activity.length === 0 && <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af", fontSize: "13px" }}>No recent activity</div>}
        </div>
    );
}

// ─── mini stat card ───────────────────────────────────────────────────────

function MiniStat({ icon, iconBg, label, value }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "1rem 1.25rem",
        }}>
            <div style={{
                width: 36, height: 36, borderRadius: 8, background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>{value}</div>
            </div>
        </div>
    );
}

// ─── panel wrapper ────────────────────────────────────────────────────────

function Panel({ title, hint, children }) {
    return (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{title}</div>
                {hint && <div style={{ fontSize: 12, color: "#9ca3af" }}>{hint}</div>}
            </div>
            {children}
        </div>
    );
}

// ─── dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    useEffect(() => {
        fetch("http://localhost:8000/api/dashboard/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard stats", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Loading Dashboard...</div>;
    }

    const dashboardData = stats || {
        riskScore: "0%",
        threatsDetected: 0,
        safeActions: 0,
        totalScans: 0,
        recentActivity: []
    };

    return (
        <div style={{ padding: "1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>

            {/* top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 500, color: "#111" }}>Security dashboard</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Last updated: just now · {today}</div>
                </div>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "#EAF3DE", color: "#27500A", fontSize: 11, fontWeight: 500,
                    padding: "4px 10px", borderRadius: 20,
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#639922" }} />
                    Live monitoring
                </div>
            </div>

            {/* metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: "1.25rem" }}>
                <Card title="Risk Score" value={dashboardData.riskScore} color="text-red-500" />
                <Card title="Threats Detected" value={dashboardData.threatsDetected.toString()} color="text-yellow-500" />
                <Card title="Safe Actions" value={dashboardData.safeActions.toString()} color="text-green-500" />
            </div>

            {/* charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: 12, marginBottom: "1.25rem" }}>
                <Panel title="Risk score over time" hint="Last 7 days">
                    <RiskChart data={dashboardData.history} />
                </Panel>
                <Panel title="Scan breakdown" hint="By type">
                    <ThreatDonut activity={dashboardData.recentActivity} />
                </Panel>
            </div>

            {/* recent activity */}
            <Panel title="Recent activity" hint="Most recent scans">
                <RecentActivityList activity={dashboardData.recentActivity} />
            </Panel>

            {/* bottom stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: "1.25rem" }}>
                <MiniStat icon={<ScanIcon />} iconBg="#E6F1FB" label="Total scans" value={dashboardData.totalScans.toString()} />
                <MiniStat icon={<ClockIcon />} iconBg="#FAEEDA" label="Avg response time" value="0.3s" />
                <MiniStat icon={<ShieldIcon />} iconBg="#EAF3DE" label="Protection uptime" value="99.8%" />
            </div>

        </div>
    );
}