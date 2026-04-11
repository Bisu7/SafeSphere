import { useState, useMemo } from "react";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from "recharts";

// ─── tokens ───────────────────────────────────────────────────────────────────
const C = {
    blue: "#185FA5", blueLt: "#E6F1FB", blueDk: "#0C447C",
    red: "#E24B4A", redLt: "#FCEBEB", redDk: "#791F1F",
    amber: "#BA7517", amberLt: "#FAEEDA", amberDk: "#633806",
    green: "#3B6D11", greenLt: "#EAF3DE", greenDk: "#27500A",
    purple: "#534AB7", purpleLt: "#EEEDFE", purpleDk: "#3C3489",
    gray50: "#F8FAFC", gray100: "#F1F5F9", gray200: "#E2E8F0",
    gray300: "#CBD5E1", gray400: "#94A3B8", gray500: "#64748B",
    gray600: "#475569", gray800: "#1E293B", gray900: "#0F172A",
    white: "#FFFFFF", border: "#E2E8F0",
    text: "#111827", muted: "#6B7280", hint: "#9CA3AF",
};
const font = "'DM Sans', system-ui, sans-serif";
const mono = "'DM Mono','Fira Code',monospace";

// ─── data ─────────────────────────────────────────────────────────────────────
const ALL_TXN = [
    { id: 1, date: "2026-04-11", merchant: "Amazon", category: "Shopping", amount: 129.99, status: "Safe" },
    { id: 2, date: "2026-04-11", merchant: "Unknown ATM", category: "Cash", amount: 800.00, status: "Suspicious" },
    { id: 3, date: "2026-04-10", merchant: "Netflix", category: "Subscription", amount: 15.49, status: "Safe" },
    { id: 4, date: "2026-04-10", merchant: "CryptoExch.io", category: "Crypto", amount: 4500.00, status: "Fraud" },
    { id: 5, date: "2026-04-09", merchant: "Starbucks", category: "Food", amount: 6.75, status: "Safe" },
    { id: 6, date: "2026-04-09", merchant: "Shell Gas", category: "Fuel", amount: 68.20, status: "Safe" },
    { id: 7, date: "2026-04-08", merchant: "Intl Wire", category: "Transfer", amount: 2900.00, status: "Fraud" },
    { id: 8, date: "2026-04-08", merchant: "Spotify", category: "Subscription", amount: 9.99, status: "Safe" },
    { id: 9, date: "2026-04-07", merchant: "Best Buy", category: "Electronics", amount: 349.00, status: "Suspicious" },
    { id: 10, date: "2026-04-07", merchant: "Uber", category: "Transport", amount: 22.50, status: "Safe" },
    { id: 11, date: "2026-04-06", merchant: "Unknown POS", category: "Cash", amount: 999.00, status: "Fraud" },
    { id: 12, date: "2026-04-06", merchant: "Whole Foods", category: "Groceries", amount: 87.34, status: "Safe" },
    { id: 13, date: "2026-04-05", merchant: "Google Ads", category: "Business", amount: 210.00, status: "Safe" },
    { id: 14, date: "2026-04-05", merchant: "Offshore Svcs", category: "Transfer", amount: 1800.00, status: "Suspicious" },
    { id: 15, date: "2026-04-04", merchant: "Target", category: "Shopping", amount: 53.12, status: "Safe" },
];

const SPENDING_TREND = [
    { day: "Apr 1", safe: 210, suspicious: 0, fraud: 0 },
    { day: "Apr 2", safe: 95, suspicious: 120, fraud: 0 },
    { day: "Apr 3", safe: 430, suspicious: 0, fraud: 0 },
    { day: "Apr 4", safe: 180, suspicious: 1800, fraud: 0 },
    { day: "Apr 5", safe: 310, suspicious: 0, fraud: 0 },
    { day: "Apr 6", safe: 87, suspicious: 0, fraud: 999 },
    { day: "Apr 7", safe: 372, suspicious: 349, fraud: 0 },
    { day: "Apr 8", safe: 10, suspicious: 0, fraud: 2900 },
    { day: "Apr 9", safe: 75, suspicious: 0, fraud: 0 },
    { day: "Apr 10", safe: 145, suspicious: 0, fraud: 4500 },
    { day: "Apr 11", safe: 130, suspicious: 800, fraud: 0 },
];

const CAT_SPEND = [
    { cat: "Shopping", amount: 183 },
    { cat: "Crypto", amount: 4500 },
    { cat: "Transfer", amount: 4700 },
    { cat: "Subscription", amount: 25 },
    { cat: "Food", amount: 6 },
    { cat: "Electronics", amount: 349 },
    { cat: "Cash", amount: 1800 },
    { cat: "Groceries", amount: 87 },
];

const RISK_PATTERNS = [
    { id: 1, icon: "clock", severity: "High", title: "Midnight transaction spike", detail: "3 transactions over $500 occurred between 11 PM – 2 AM on Apr 10." },
    { id: 2, icon: "globe", severity: "High", title: "International wire transfer", detail: "$2,900 sent to an unrecognized offshore account on Apr 8." },
    { id: 3, icon: "repeat", severity: "Medium", title: "Unusual crypto activity", detail: "$4,500 moved to CryptoExch.io — 10× your monthly crypto average." },
    { id: 4, icon: "atm", severity: "Medium", title: "Repeated ATM withdrawals", detail: "$1,800 withdrawn from unknown ATMs over 3 days." },
    { id: 5, icon: "zip", severity: "Low", title: "Out-of-region purchase", detail: "Best Buy transaction detected 480 km from your usual activity zone." },
];

const FRAUD_ALERTS = [
    { id: 1, title: "Possible card skimming", action: "Freeze card immediately · Contact bank", severity: "High" },
    { id: 2, title: "Unrecognized wire transfer", action: "Dispute transaction · Enable wire transfer alerts", severity: "High" },
    { id: 3, title: "Crypto exchange anomaly", action: "Review account · Enable 2FA on exchange", severity: "Medium" },
    { id: 4, title: "Velocity check triggered", action: "Review ATM activity · Set daily withdrawal limit", severity: "Medium" },
];

const STATUS_CFG = {
    Safe: { bg: C.greenLt, text: C.greenDk, dot: "#639922" },
    Suspicious: { bg: C.amberLt, text: C.amberDk, dot: "#BA7517" },
    Fraud: { bg: C.redLt, text: C.redDk, dot: "#E24B4A" },
};

const RISK_CFG = {
    High: { bg: C.redLt, text: C.redDk, dot: "#E24B4A", border: "#F7C1C1" },
    Medium: { bg: C.amberLt, text: C.amberDk, dot: "#BA7517", border: "#FAC775" },
    Low: { bg: C.greenLt, text: C.greenDk, dot: "#639922", border: "#C0DD97" },
};

// ─── styles ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.fr{font-family:${font};color:${C.text};background:${C.gray50};min-height:100vh;padding:2rem 1.5rem 4rem;max-width:1040px;margin:0 auto;}
.fr-hdr{margin-bottom:1.75rem;}
.fr-title{font-size:24px;font-weight:600;color:${C.gray900};letter-spacing:-.4px;display:flex;align-items:center;gap:10px;margin-bottom:5px;}
.fr-desc{font-size:14px;color:${C.muted};line-height:1.6;}
.fr-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:1.5rem;}
.fr-metric{background:${C.white};border:0.5px solid ${C.border};border-radius:12px;padding:1.1rem 1.25rem;}
.fr-metric-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.fr-metric-lbl{font-size:12px;font-weight:500;color:${C.hint};letter-spacing:.3px;text-transform:uppercase;}
.fr-metric-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;}
.fr-metric-val{font-size:30px;font-weight:600;letter-spacing:-1px;line-height:1;margin-bottom:4px;}
.fr-metric-sub{font-size:12px;color:${C.muted};}
.fr-card{background:${C.white};border:0.5px solid ${C.border};border-radius:14px;padding:1.25rem;margin-bottom:1.25rem;}
.fr-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px;}
.fr-card-title{font-size:13px;font-weight:600;color:${C.hint};letter-spacing:.5px;text-transform:uppercase;}
.fr-filters{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.fr-filter-btn{padding:5px 12px;border-radius:20px;border:0.5px solid ${C.border};background:transparent;font-family:${font};font-size:12px;font-weight:500;color:${C.gray600};cursor:pointer;transition:background .1s,color .1s;}
.fr-filter-btn.active{background:${C.blueLt};color:${C.blueDk};border-color:${C.blue};}
.fr-filter-btn:hover:not(.active){background:${C.gray100};}
.fr-date-input{padding:5px 10px;border-radius:8px;border:0.5px solid ${C.border};background:${C.gray50};font-family:${mono};font-size:12px;color:${C.gray600};outline:none;}
.fr-tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{text-align:left;padding:8px 10px;font-size:11px;font-weight:600;color:${C.hint};letter-spacing:.4px;text-transform:uppercase;border-bottom:0.5px solid ${C.border};}
td{padding:9px 10px;border-bottom:0.5px solid ${C.gray100};vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr.fraud-row td{background:#fffafa;}
tr:hover td{background:${C.gray50};}
.fr-merchant{font-weight:500;color:${C.gray800};}
.fr-cat{font-size:11px;color:${C.hint};font-family:${mono};}
.fr-amount{font-family:${mono};font-weight:500;}
.fr-date-cell{font-family:${mono};font-size:12px;color:${C.gray500};}
.fr-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;}
.fr-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.fr-charts-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:1.25rem;}
.fr-pattern{display:flex;gap:12px;padding:10px 12px;border-radius:10px;border:0.5px solid transparent;margin-bottom:8px;}
.fr-pattern-ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fr-pattern-title{font-size:13px;font-weight:500;color:${C.gray800};margin-bottom:3px;}
.fr-pattern-detail{font-size:12px;color:${C.muted};line-height:1.5;font-family:${mono};}
.fr-pattern-meta{display:flex;align-items:center;gap:8px;margin-top:5px;}
.fr-alert-row{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:10px;border:0.5px solid transparent;margin-bottom:8px;}
.fr-alert-ico{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fr-alert-title{font-size:13px;font-weight:500;color:${C.gray800};margin-bottom:4px;}
.fr-alert-action{font-size:12px;color:${C.muted};font-family:${mono};}
.fr-main-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:14px;margin-bottom:1.25rem;}
.fr-risk-label{font-size:11px;font-weight:600;color:${C.hint};letter-spacing:.4px;text-transform:uppercase;margin-bottom:8px;}
@media(max-width:720px){.fr-metrics{grid-template-columns:1fr 1fr;}.fr-charts-row,.fr-main-grid{grid-template-columns:1fr;}.fr{padding:1.25rem 1rem 3rem;}}
@media(max-width:420px){.fr-metrics{grid-template-columns:1fr;}}
`;

// ─── icons ────────────────────────────────────────────────────────────────────
function Ic({ n, size = 14, color = "currentColor" }) {
    const p = { width: size, height: size };
    const m = {
        chart: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M2 12l3.5-4 3 3L12 5M2 14h12" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        shield: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 1.5L2 4.5v4c0 3.5 2.5 5.5 6 6.5 3.5-1 6-3 6-6.5v-4L8 1.5z" stroke={color} strokeWidth="1.3" /><path d="M5.5 8l2 2L11 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        alert: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13h13L8 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /><path d="M8 6v3.5M8 11v.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        txn: <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="2" stroke={color} strokeWidth="1.2" /><path d="M1.5 7h13" stroke={color} strokeWidth="1.2" /><path d="M5 10.5h2M10 10.5h1" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        clock: <svg {...p} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" /><path d="M8 5v3l2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        globe: <svg {...p} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" /><path d="M2 8h12M8 2c-1.5 2-2 4-2 6s.5 4 2 6M8 2c1.5 2 2 4 2 6s-.5 4-2 6" stroke={color} strokeWidth="1.2" /></svg>,
        repeat: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 6a5 5 0 019.9-1M13 10a5 5 0 01-9.9 1" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><path d="M12 3l1 3-3-1M4 13l-1-3 3 1" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /></svg>,
        atm: <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="2" stroke={color} strokeWidth="1.2" /><path d="M5 9.5v-3l1.5 2 1.5-2v3M10 6.5v3M10 6.5h1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        zip: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke={color} strokeWidth="1.2" /><path d="M8 5v3l2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        check: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        lock: <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" /><path d="M5 7V5a3 3 0 016 0v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        warning: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13h13L8 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill={color} fillOpacity=".1" /><path d="M8 6v3.5M8 11v.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>,
    };
    return m[n] || null;
}

function Badge({ status }) {
    const c = STATUS_CFG[status] || STATUS_CFG.Safe;
    return (
        <span className="fr-badge" style={{ background: c.bg, color: c.text }}>
            <span className="fr-dot" style={{ background: c.dot }} />
            {status}
        </span>
    );
}

function RiskBadge({ severity }) {
    const c = RISK_CFG[severity];
    return (
        <span className="fr-badge" style={{ background: c.bg, color: c.text }}>
            <span className="fr-dot" style={{ background: c.dot }} />
            {severity}
        </span>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 8,
            padding: "8px 12px", fontSize: 12, fontFamily: mono,
        }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: C.gray800, fontFamily: font }}>{label}</div>
            {payload.map((p) => (
                <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
                    {p.name}: ${p.value.toLocaleString()}
                </div>
            ))}
        </div>
    );
};

// ─── main ─────────────────────────────────────────────────────────────────────
export default function FinancialRisk() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");

    const filtered = useMemo(() => {
        return ALL_TXN.filter((t) => {
            const matchStatus = statusFilter === "All" || t.status === statusFilter;
            const matchDate = !dateFilter || t.date === dateFilter;
            return matchStatus && matchDate;
        });
    }, [statusFilter, dateFilter]);

    const total = ALL_TXN.length;
    const fraudCount = ALL_TXN.filter(t => t.status === "Fraud").length;
    const suspCount = ALL_TXN.filter(t => t.status === "Suspicious").length;
    const safeCount = ALL_TXN.filter(t => t.status === "Safe").length;
    const riskScore = Math.round((fraudCount * 20 + suspCount * 8) / total * 100);
    const scoreColor = riskScore > 60 ? C.red : riskScore > 30 ? C.amber : C.green;
    const scoreLabel = riskScore > 60 ? "High risk" : riskScore > 30 ? "Moderate" : "Low risk";

    return (
        <>
            <style>{CSS}</style>
            <div className="fr">

                {/* header */}
                <div className="fr-hdr">
                    <div className="fr-title">
                        <Ic n="chart" size={22} color={C.blue} />
                        Financial risk
                    </div>
                    <p className="fr-desc">
                        AI-powered transaction monitoring to detect fraud, unusual patterns, and financial exposure.
                    </p>
                </div>

                {/* summary cards */}
                <div className="fr-metrics">
                    <div className="fr-metric">
                        <div className="fr-metric-top">
                            <div className="fr-metric-lbl">Risk score</div>
                            <div className="fr-metric-ico" style={{ background: riskScore > 60 ? C.redLt : riskScore > 30 ? C.amberLt : C.greenLt }}>
                                <Ic n="alert" size={14} color={scoreColor} />
                            </div>
                        </div>
                        <div className="fr-metric-val" style={{ color: scoreColor }}>{riskScore}</div>
                        <div className="fr-metric-sub" style={{ color: scoreColor }}>{scoreLabel}</div>
                    </div>
                    <div className="fr-metric">
                        <div className="fr-metric-top">
                            <div className="fr-metric-lbl">Suspicious / Fraud</div>
                            <div className="fr-metric-ico" style={{ background: C.redLt }}>
                                <Ic n="warning" size={14} color={C.red} />
                            </div>
                        </div>
                        <div className="fr-metric-val" style={{ color: C.red }}>{fraudCount + suspCount}</div>
                        <div className="fr-metric-sub">{fraudCount} fraud · {suspCount} suspicious</div>
                    </div>
                    <div className="fr-metric">
                        <div className="fr-metric-top">
                            <div className="fr-metric-lbl">Safe transactions</div>
                            <div className="fr-metric-ico" style={{ background: C.greenLt }}>
                                <Ic n="check" size={14} color={C.green} />
                            </div>
                        </div>
                        <div className="fr-metric-val" style={{ color: C.green }}>{safeCount}</div>
                        <div className="fr-metric-sub">{Math.round(safeCount / total * 100)}% of total</div>
                    </div>
                </div>

                {/* charts row */}
                <div className="fr-charts-row">
                    <div className="fr-card">
                        <div className="fr-card-hdr">
                            <div className="fr-card-title">Spending trend</div>
                            <span style={{ fontSize: 11, color: C.hint, fontFamily: mono }}>Apr 2026</span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={SPENDING_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={C.gray200} />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.hint, fontFamily: mono }} tickLine={false} axisLine={false} interval={2} />
                                <YAxis tick={{ fontSize: 10, fill: C.hint, fontFamily: mono }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="safe" stroke="#639922" strokeWidth={2} dot={false} name="Safe" />
                                <Line type="monotone" dataKey="suspicious" stroke="#BA7517" strokeWidth={2} dot={false} name="Suspicious" strokeDasharray="4 2" />
                                <Line type="monotone" dataKey="fraud" stroke="#E24B4A" strokeWidth={2} dot={{ r: 3, fill: "#E24B4A" }} name="Fraud" />
                            </LineChart>
                        </ResponsiveContainer>
                        <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                            {[["#639922", "Safe"], ["#BA7517", "Suspicious"], ["#E24B4A", "Fraud"]].map(([c, l]) => (
                                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fr-card">
                        <div className="fr-card-hdr">
                            <div className="fr-card-title">Category expenses</div>
                            <span style={{ fontSize: 11, color: C.hint, fontFamily: mono }}>Total spend</span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={CAT_SPEND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={C.gray200} horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: C.hint, fontFamily: mono }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                <YAxis type="category" dataKey="cat" tick={{ fontSize: 10, fill: C.hint, fontFamily: mono }} tickLine={false} axisLine={false} width={72} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}
                                    fill={C.blue}
                                    label={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* transactions + risk analysis side-by-side */}
                <div className="fr-main-grid">

                    {/* transactions table */}
                    <div className="fr-card">
                        <div className="fr-card-hdr">
                            <div className="fr-card-title">Transactions</div>
                            <div className="fr-filters">
                                <input
                                    className="fr-date-input"
                                    type="date"
                                    value={dateFilter}
                                    onChange={e => setDateFilter(e.target.value)}
                                    title="Filter by date"
                                />
                                {["All", "Safe", "Suspicious", "Fraud"].map(s => (
                                    <button
                                        key={s}
                                        className={`fr-filter-btn ${statusFilter === s ? "active" : ""}`}
                                        onClick={() => setStatusFilter(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                                {dateFilter && (
                                    <button
                                        className="fr-filter-btn"
                                        onClick={() => setDateFilter("")}
                                        style={{ color: C.red }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="fr-tbl-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Merchant</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: "center", color: C.hint, padding: "1.5rem", fontFamily: mono, fontSize: 12 }}>
                                                No transactions match the current filter.
                                            </td>
                                        </tr>
                                    ) : filtered.map(t => (
                                        <tr key={t.id} className={t.status === "Fraud" ? "fraud-row" : ""}>
                                            <td>
                                                <div className="fr-merchant">{t.merchant}</div>
                                                <div className="fr-cat">{t.category}</div>
                                            </td>
                                            <td>
                                                <span
                                                    className="fr-amount"
                                                    style={{ color: t.status === "Fraud" ? C.red : t.status === "Suspicious" ? C.amber : C.gray800 }}
                                                >
                                                    ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td><span className="fr-date-cell">{t.date}</span></td>
                                            <td><Badge status={t.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ fontSize: 11, color: C.hint, marginTop: 10, paddingLeft: 2 }}>
                            Showing {filtered.length} of {total} transactions
                        </div>
                    </div>

                    {/* risk patterns */}
                    <div className="fr-card">
                        <div className="fr-card-hdr">
                            <div className="fr-card-title">Risk patterns</div>
                            <span style={{
                                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                                background: C.redLt, color: C.redDk,
                            }}>
                                {RISK_PATTERNS.filter(p => p.severity === "High").length} critical
                            </span>
                        </div>
                        {RISK_PATTERNS.map(p => {
                            const cfg = RISK_CFG[p.severity];
                            return (
                                <div key={p.id} className="fr-pattern"
                                    style={{ background: cfg.bg, borderColor: cfg.border }}
                                >
                                    <div className="fr-pattern-ico" style={{ background: cfg.bg, border: `0.5px solid ${cfg.dot}` }}>
                                        <Ic n={p.icon} size={13} color={cfg.dot} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="fr-pattern-title">{p.title}</div>
                                        <div className="fr-pattern-detail">{p.detail}</div>
                                        <div className="fr-pattern-meta">
                                            <RiskBadge severity={p.severity} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* fraud alerts */}
                <div className="fr-card">
                    <div className="fr-card-hdr">
                        <div className="fr-card-title">Fraud alerts &amp; actions</div>
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            background: C.redLt, color: C.redDk,
                        }}>
                            {FRAUD_ALERTS.filter(a => a.severity === "High").length} urgent
                        </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 8 }}>
                        {FRAUD_ALERTS.map(a => {
                            const cfg = RISK_CFG[a.severity];
                            return (
                                <div key={a.id} className="fr-alert-row"
                                    style={{ background: cfg.bg, borderColor: cfg.border }}
                                >
                                    <div className="fr-alert-ico"
                                        style={{ background: cfg.bg, border: `0.5px solid ${cfg.dot}` }}
                                    >
                                        <Ic n="alert" size={14} color={cfg.dot} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="fr-alert-title">{a.title}</div>
                                        <div className="fr-alert-action">{a.action}</div>
                                        <div style={{ marginTop: 5 }}>
                                            <RiskBadge severity={a.severity} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </>
    );
}