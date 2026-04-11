import { useEffect, useRef } from "react";
import Card from "../components/Card";
import RiskChart from "../components/Charts/RiskChart";

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

const THREAT_DATA = [
    { label: "Phishing", count: 6, color: "#E24B4A", bg: "#FCEBEB", tc: "#791F1F" },
    { label: "Scam sites", count: 4, color: "#BA7517", bg: "#FAEEDA", tc: "#633806" },
    { label: "Trackers", count: 3, color: "#185FA5", bg: "#E6F1FB", tc: "#0C447C" },
    { label: "Fake content", count: 1, color: "#639922", bg: "#EAF3DE", tc: "#27500A" },
];

function ThreatDonut() {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        function init() {
            if (!window.Chart || !canvasRef.current || cancelled) return;
            if (instanceRef.current) instanceRef.current.destroy();
            instanceRef.current = new window.Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: THREAT_DATA.map((d) => d.label),
                    datasets: [{
                        data: THREAT_DATA.map((d) => d.count),
                        backgroundColor: THREAT_DATA.map((d) => d.color),
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
    }, []);

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {THREAT_DATA.map((d) => (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        {d.label} — {d.count}
                    </div>
                ))}
            </div>
            <div style={{ position: "relative", height: 140 }}>
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label="Donut chart: phishing 6, scam sites 4, trackers 3, fake content 1."
                >
                    Threat breakdown: phishing 6, scam sites 4, trackers 3, fake content 1.
                </canvas>
            </div>
        </div>
    );
}

// ─── recent threats list ──────────────────────────────────────────────────

const RECENT_THREATS = [
    { dot: "#E24B4A", name: "Phishing email detected", time: "2 min ago · sender: offers@promo-deals.net", badge: "High", bg: "#FCEBEB", tc: "#791F1F" },
    { dot: "#BA7517", name: "Suspicious site blocked", time: "18 min ago · free-iphone-2026.com", badge: "Medium", bg: "#FAEEDA", tc: "#633806" },
    { dot: "#185FA5", name: "Tracker blocked on visit", time: "1 hr ago · news-portal.io", badge: "Low", bg: "#E6F1FB", tc: "#0C447C" },
    { dot: "#639922", name: "Safe site verified", time: "3 hr ago · anthropic.com", badge: "Safe", bg: "#EAF3DE", tc: "#27500A" },
];

function RecentThreats() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RECENT_THREATS.map((t) => (
                <div
                    key={t.name}
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", background: "#f8fafc", borderRadius: 8,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{t.time}</div>
                        </div>
                    </div>
                    <div style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
                        background: t.bg, color: t.tc, flexShrink: 0,
                    }}>
                        {t.badge}
                    </div>
                </div>
            ))}
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
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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

            {/* metric cards — your existing Card component */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: "1.25rem" }}>
                <Card title="Risk Score" value="72%" color="text-red-500" />
                <Card title="Threats Detected" value="14" color="text-yellow-500" />
                <Card title="Safe Actions" value="32" color="text-green-500" />
            </div>

            {/* charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: 12, marginBottom: "1.25rem" }}>
                <Panel title="Risk score over time" hint="Last 7 days">
                    {/* your existing RiskChart component */}
                    <RiskChart />
                </Panel>
                <Panel title="Threat breakdown" hint="This week">
                    <ThreatDonut />
                </Panel>
            </div>

            {/* recent threats */}
            <Panel title="Recent threats" hint="Most recent activity">
                <RecentThreats />
            </Panel>

            {/* bottom stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: "1.25rem" }}>
                <MiniStat icon={<ScanIcon />} iconBg="#E6F1FB" label="URLs scanned" value="1,284" />
                <MiniStat icon={<ClockIcon />} iconBg="#FAEEDA" label="Avg response time" value="0.3s" />
                <MiniStat icon={<ShieldIcon />} iconBg="#EAF3DE" label="Protection uptime" value="99.8%" />
            </div>

        </div>
    );
}