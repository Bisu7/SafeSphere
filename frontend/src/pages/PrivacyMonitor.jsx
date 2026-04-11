import { useState, useRef, useEffect } from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const C = {
    blue: "#185FA5",
    blueLt: "#E6F1FB",
    blueDk: "#0C447C",
    red: "#E24B4A",
    redLt: "#FCEBEB",
    redDk: "#791F1F",
    amber: "#BA7517",
    amberLt: "#FAEEDA",
    amberDk: "#633806",
    green: "#3B6D11",
    greenLt: "#EAF3DE",
    greenDk: "#27500A",
    gray50: "#F8FAFC",
    gray100: "#F1F5F9",
    gray200: "#E2E8F0",
    gray300: "#CBD5E1",
    gray400: "#94A3B8",
    gray500: "#64748B",
    gray600: "#475569",
    gray800: "#1E293B",
    gray900: "#0F172A",
    white: "#FFFFFF",
    border: "#E2E8F0",
    text: "#111827",
    textMuted: "#6B7280",
    textHint: "#9CA3AF",
};

const font = "'DM Sans', system-ui, sans-serif";
const mono = "'DM Mono', 'Fira Code', monospace";

const RISK_CFG = {
    Low: { color: C.green, bg: C.greenLt, dk: C.greenDk, dot: "#639922" },
    Medium: { color: C.amber, bg: C.amberLt, dk: C.amberDk, dot: "#BA7517" },
    High: { color: C.red, bg: C.redLt, dk: C.redDk, dot: "#E24B4A" },
};

// ─── initial data ─────────────────────────────────────────────────────────────
const INIT_TRACKERS = [
    { id: 1, name: "Google Analytics", domain: "google-analytics.com", category: "Analytics", blocked: false },
    { id: 2, name: "Meta Pixel", domain: "connect.facebook.net", category: "Advertising", blocked: false },
    { id: 3, name: "DoubleClick", domain: "doubleclick.net", category: "Advertising", blocked: true },
    { id: 4, name: "HubSpot", domain: "js.hs-analytics.net", category: "CRM", blocked: false },
    { id: 5, name: "Hotjar", domain: "static.hotjar.com", category: "Heatmap", blocked: true },
    { id: 6, name: "Twitter Ads", domain: "static.ads-twitter.com", category: "Advertising", blocked: true },
    { id: 7, name: "LinkedIn Insight", domain: "snap.licdn.com", category: "Analytics", blocked: false },
    { id: 8, name: "Criteo", domain: "static.criteo.net", category: "Advertising", blocked: true },
];

const INIT_PERMISSIONS = [
    { id: 1, name: "Camera", icon: "camera", granted: true, risk: "High" },
    { id: 2, name: "Location", icon: "location", granted: true, risk: "High" },
    { id: 3, name: "Microphone", icon: "mic", granted: false, risk: "Medium" },
    { id: 4, name: "Contacts", icon: "contacts", granted: true, risk: "Medium" },
    { id: 5, name: "Notifications", icon: "bell", granted: true, risk: "Low" },
    { id: 6, name: "Storage", icon: "storage", granted: true, risk: "Low" },
];

const ALERTS = [
    { id: 1, title: "Email found in data breach", detail: "your@email.com found in RockYou2024 leak · 10B records", severity: "High", ts: "2 days ago" },
    { id: 2, title: "Password reuse detected", detail: "Same password used on 4 services including a breached site", severity: "High", ts: "5 days ago" },
    { id: 3, title: "Phone number exposed", detail: "Your number appeared in a scraped social media dataset", severity: "Medium", ts: "2 weeks ago" },
    { id: 4, title: "Name & city in broker database", detail: "Found on 3 data broker sites — removal recommended", severity: "Medium", ts: "1 month ago" },
    { id: 5, title: "Old account with weak password", detail: "forum account from 2018 — consider deleting", severity: "Low", ts: "2 months ago" },
];

const CAT_COLORS = {
    Analytics: "#185FA5",
    Advertising: "#E24B4A",
    CRM: "#BA7517",
    Heatmap: "#534AB7",
};

// ─── css ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pm {
  font-family: ${font};
  color: ${C.text};
  background: ${C.gray50};
  min-height: 100vh;
  padding: 2rem 1.5rem 4rem;
  max-width: 960px;
  margin: 0 auto;
}

.pm-header { margin-bottom: 2rem; }
.pm-title {
  font-size: 24px; font-weight: 600; color: ${C.gray900};
  letter-spacing: -0.4px; display: flex; align-items: center; gap: 10px; margin-bottom: 5px;
}
.pm-desc { font-size: 14px; color: ${C.textMuted}; line-height: 1.6; }

.pm-overview {
  display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px; margin-bottom: 1.5rem;
}

.pm-metric {
  background: ${C.white}; border: 0.5px solid ${C.border};
  border-radius: 12px; padding: 1.1rem 1.25rem;
}
.pm-metric-top {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
}
.pm-metric-label { font-size: 12px; font-weight: 500; color: ${C.textHint}; letter-spacing: 0.3px; text-transform: uppercase; }
.pm-metric-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pm-metric-value { font-size: 30px; font-weight: 600; letter-spacing: -1px; line-height: 1; margin-bottom: 4px; }
.pm-metric-sub { font-size: 12px; color: ${C.textMuted}; }

.pm-grid {
  display: grid; grid-template-columns: minmax(0,1.25fr) minmax(0,1fr);
  gap: 14px; margin-bottom: 14px;
}

.pm-card {
  background: ${C.white}; border: 0.5px solid ${C.border};
  border-radius: 14px; padding: 1.25rem;
}
.pm-card-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;
}
.pm-card-title { font-size: 13px; font-weight: 600; color: ${C.textHint}; letter-spacing: 0.5px; text-transform: uppercase; }
.pm-card-hint { font-size: 12px; color: ${C.textHint}; }

.pm-tracker-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 8px; transition: background 0.1s;
}
.pm-tracker-row:hover { background: ${C.gray50}; }
.pm-tracker-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: ${C.white}; flex-shrink: 0;
}
.pm-tracker-name { font-size: 13px; font-weight: 500; color: ${C.gray800}; }
.pm-tracker-domain { font-size: 11px; color: ${C.textHint}; font-family: ${mono}; }
.pm-cat-pill {
  font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
  color: ${C.white}; flex-shrink: 0; letter-spacing: 0.2px;
}
.pm-status-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.pm-divider { height: 0.5px; background: ${C.border}; margin: 2px 0; }

/* toggle switch */
.pm-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
.pm-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.pm-slider {
  position: absolute; inset: 0; border-radius: 20px; cursor: pointer;
  background: ${C.gray300}; transition: background 0.2s;
}
.pm-slider::after {
  content: ''; position: absolute;
  left: 3px; top: 3px; width: 14px; height: 14px;
  border-radius: 50%; background: ${C.white};
  transition: transform 0.2s;
}
.pm-toggle input:checked + .pm-slider { background: ${C.green}; }
.pm-toggle input:checked + .pm-slider::after { transform: translateX(16px); }
.pm-toggle input.pm-blocked:checked + .pm-slider { background: ${C.red}; }

/* permission row */
.pm-perm-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 8px; transition: background 0.1s;
}
.pm-perm-row:hover { background: ${C.gray50}; }
.pm-perm-icon-wrap {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pm-perm-name { font-size: 13px; font-weight: 500; color: ${C.gray800}; flex: 1; }
.pm-perm-status { font-size: 11px; color: ${C.textMuted}; }

/* risk badge */
.pm-risk-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600; padding: 2px 7px;
  border-radius: 20px; flex-shrink: 0;
}

/* alert panel */
.pm-alert {
  display: flex; gap: 12px; padding: 10px 12px;
  border-radius: 10px; margin-bottom: 8px; border: 0.5px solid transparent;
}
.pm-alert-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pm-alert-title { font-size: 13px; font-weight: 500; color: ${C.gray800}; margin-bottom: 2px; }
.pm-alert-detail { font-size: 12px; color: ${C.textMuted}; line-height: 1.5; font-family: ${mono}; }
.pm-alert-meta { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
.pm-alert-ts { font-size: 11px; color: ${C.textHint}; }

/* chart */
.pm-chart-wrap { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.pm-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 120px; }
.pm-legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: ${C.gray600}; }
.pm-legend-sq { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }

/* warning chip */
.pm-warn {
  display: inline-flex; align-items: center; gap: 4px;
  background: ${C.amberLt}; color: ${C.amberDk};
  font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
}

@media (max-width: 680px) {
  .pm-overview { grid-template-columns: 1fr 1fr; }
  .pm-grid { grid-template-columns: 1fr; }
  .pm-metric-value { font-size: 24px; }
  .pm { padding: 1.25rem 1rem 3rem; }
}
@media (max-width: 420px) {
  .pm-overview { grid-template-columns: 1fr; }
}
`;

// ─── icons ────────────────────────────────────────────────────────────────────
function Icon({ name, size = 14, color = "currentColor" }) {
    const s = { width: size, height: size };
    const icons = {
        shield: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L2 4.5v4c0 3.5 2.5 5.5 6 6.5 3.5-1 6-3 6-6.5v-4L8 1.5z" stroke={color} strokeWidth="1.3" />
                <path d="M5.5 8l2 2L11 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        camera: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <rect x="1" y="4" width="14" height="10" rx="2" stroke={color} strokeWidth="1.2" />
                <circle cx="8" cy="9" r="2.5" stroke={color} strokeWidth="1.2" />
                <path d="M5.5 4l1-2h3l1 2" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
        ),
        location: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a5 5 0 015 5c0 3.5-5 8.5-5 8.5S3 10 3 6.5a5 5 0 015-5z" stroke={color} strokeWidth="1.2" />
                <circle cx="8" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2" />
            </svg>
        ),
        mic: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke={color} strokeWidth="1.2" />
                <path d="M3 8a5 5 0 0010 0M8 13v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
        contacts: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="1.2" />
                <path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
                <path d="M11 5h3M11 8h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
        bell: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a4 4 0 00-4 4v3.5l-1 1.5h10L12 9V5.5a4 4 0 00-4-4z" stroke={color} strokeWidth="1.2" />
                <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.2" />
            </svg>
        ),
        storage: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <ellipse cx="8" cy="4" rx="5.5" ry="2" stroke={color} strokeWidth="1.2" />
                <path d="M2.5 4v4c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V4" stroke={color} strokeWidth="1.2" />
                <path d="M2.5 8v4c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V8" stroke={color} strokeWidth="1.2" />
            </svg>
        ),
        alert: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <path d="M8 2L1.5 13h13L8 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M8 6v3.5M8 11v.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
        tracker: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" />
                <circle cx="8" cy="8" r="2" stroke={color} strokeWidth="1.2" />
                <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
        eye: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <ellipse cx="8" cy="8" rx="6.5" ry="4" stroke={color} strokeWidth="1.2" />
                <circle cx="8" cy="8" r="2" stroke={color} strokeWidth="1.2" />
            </svg>
        ),
        lock: (
            <svg {...s} viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" />
                <path d="M5 7V5a3 3 0 016 0v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
    };
    return icons[name] || null;
}

// ─── subcomponents ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, variant = "allow" }) {
    return (
        <label className="pm-toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={variant === "block" && checked ? "pm-blocked" : ""}
            />
            <span className="pm-slider" />
        </label>
    );
}

function RiskBadge({ risk, size = "sm" }) {
    const cfg = RISK_CFG[risk] || RISK_CFG.Low;
    return (
        <span className="pm-risk-badge" style={{ background: cfg.bg, color: cfg.dk }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0, display: "inline-block" }} />
            {risk}
        </span>
    );
}

function PermIcon({ name, granted, risk }) {
    const cfg = RISK_CFG[risk];
    const bg = granted ? cfg.bg : C.gray100;
    const color = granted ? cfg.color : C.gray400;
    return (
        <div className="pm-perm-icon-wrap" style={{ background: bg }}>
            <Icon name={name} size={15} color={color} />
        </div>
    );
}

function TrackerInitials({ name }) {
    const word = name.split(" ")[0];
    const letters = word.slice(0, 2).toUpperCase();
    const cat = INIT_TRACKERS.find(t => t.name === name)?.category || "Analytics";
    const bg = CAT_COLORS[cat] || C.blue;
    return (
        <div className="pm-tracker-icon" style={{ background: bg }}>
            {letters}
        </div>
    );
}

// ─── donut chart (canvas) ─────────────────────────────────────────────────────
function TrackerChart({ trackers }) {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    const cats = Object.entries(
        trackers.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {})
    );

    useEffect(() => {
        let cancelled = false;
        function init() {
            if (!window.Chart || !canvasRef.current || cancelled) return;
            instanceRef.current?.destroy();
            instanceRef.current = new window.Chart(canvasRef.current, {
                type: "doughnut",
                data: {
                    labels: cats.map(([k]) => k),
                    datasets: [{
                        data: cats.map(([, v]) => v),
                        backgroundColor: cats.map(([k]) => CAT_COLORS[k] || C.blue),
                        borderWidth: 0,
                        hoverOffset: 5,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                        legend: { display: false }, tooltip: {
                            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} trackers` }
                        }
                    },
                },
            });
        }
        if (!window.Chart) {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
            s.onload = init;
            document.head.appendChild(s);
        } else init();
        return () => { cancelled = true; instanceRef.current?.destroy(); };
    }, [trackers]);

    return (
        <div className="pm-card" style={{ marginBottom: 14 }}>
            <div className="pm-card-header">
                <div className="pm-card-title">Tracker distribution</div>
                <div className="pm-card-hint">{trackers.filter(t => !t.blocked).length} active</div>
            </div>
            <div className="pm-chart-wrap">
                <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                    <canvas ref={canvasRef} role="img" aria-label="Donut chart showing tracker category distribution" />
                    <div style={{
                        position: "absolute", inset: 0, display: "flex",
                        flexDirection: "column", alignItems: "center", justifyContent: "center",
                        pointerEvents: "none",
                    }}>
                        <div style={{ fontSize: 22, fontWeight: 600, color: C.gray900, lineHeight: 1 }}>{trackers.length}</div>
                        <div style={{ fontSize: 10, color: C.textHint, marginTop: 2 }}>total</div>
                    </div>
                </div>
                <div className="pm-legend">
                    {cats.map(([cat, count]) => (
                        <div key={cat} className="pm-legend-item">
                            <div className="pm-legend-sq" style={{ background: CAT_COLORS[cat] || C.blue }} />
                            <span style={{ flex: 1 }}>{cat}</span>
                            <span style={{ fontWeight: 500, color: C.gray800, fontFamily: mono, fontSize: 12 }}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function PrivacyMonitor() {
    const [trackers, setTrackers] = useState(INIT_TRACKERS);
    const [permissions, setPermissions] = useState(INIT_PERMISSIONS);

    const blocked = trackers.filter(t => t.blocked).length;
    const active = trackers.filter(t => !t.blocked).length;
    const granted = permissions.filter(p => p.granted).length;
    const highPerms = permissions.filter(p => p.granted && p.risk === "High").length;

    const exposureScore = Math.round(
        (active * 12 + granted * 8 + ALERTS.filter(a => a.severity === "High").length * 10)
    );

    const scoreColor = exposureScore > 70 ? C.red : exposureScore > 40 ? C.amber : C.green;
    const scoreLabel = exposureScore > 70 ? "High risk" : exposureScore > 40 ? "Moderate" : "Low risk";

    const toggleTracker = (id) =>
        setTrackers(ts => ts.map(t => t.id === id ? { ...t, blocked: !t.blocked } : t));

    const togglePermission = (id) =>
        setPermissions(ps => ps.map(p => p.id === id ? { ...p, granted: !p.granted } : p));

    return (
        <>
            <style>{CSS}</style>
            <div className="pm">

                {/* header */}
                <div className="pm-header">
                    <div className="pm-title">
                        <Icon name="eye" size={22} color={C.blue} />
                        Privacy monitor
                    </div>
                    <p className="pm-desc">
                        Real-time visibility into how your data is being tracked, shared, and exposed across the web.
                    </p>
                </div>

                {/* overview cards */}
                <div className="pm-overview">
                    <div className="pm-metric">
                        <div className="pm-metric-top">
                            <div className="pm-metric-label">Exposure score</div>
                            <div className="pm-metric-icon" style={{ background: exposureScore > 70 ? C.redLt : exposureScore > 40 ? C.amberLt : C.greenLt }}>
                                <Icon name="eye" size={14} color={scoreColor} />
                            </div>
                        </div>
                        <div className="pm-metric-value" style={{ color: scoreColor }}>{exposureScore}</div>
                        <div className="pm-metric-sub" style={{ color: scoreColor }}>{scoreLabel}</div>
                    </div>

                    <div className="pm-metric">
                        <div className="pm-metric-top">
                            <div className="pm-metric-label">Trackers blocked</div>
                            <div className="pm-metric-icon" style={{ background: C.greenLt }}>
                                <Icon name="shield" size={14} color={C.green} />
                            </div>
                        </div>
                        <div className="pm-metric-value" style={{ color: C.green }}>{blocked}</div>
                        <div className="pm-metric-sub">{active} still active</div>
                    </div>

                    <div className="pm-metric">
                        <div className="pm-metric-top">
                            <div className="pm-metric-label">Permissions granted</div>
                            <div className="pm-metric-icon" style={{ background: highPerms > 0 ? C.amberLt : C.greenLt }}>
                                <Icon name="lock" size={14} color={highPerms > 0 ? C.amber : C.green} />
                            </div>
                        </div>
                        <div className="pm-metric-value" style={{ color: highPerms > 0 ? C.amber : C.green }}>{granted}</div>
                        <div className="pm-metric-sub">{highPerms > 0 ? `${highPerms} high-risk` : "no high-risk"}</div>
                    </div>
                </div>

                {/* main grid: trackers + permissions */}
                <div className="pm-grid">

                    {/* active trackers */}
                    <div className="pm-card">
                        <div className="pm-card-header">
                            <div className="pm-card-title">Active trackers</div>
                            <span style={{ fontSize: 11, color: C.textHint, fontFamily: mono }}>
                                {active}/{trackers.length} active
                            </span>
                        </div>
                        {trackers.map((t, i) => (
                            <div key={t.id}>
                                {i > 0 && <div className="pm-divider" />}
                                <div className="pm-tracker-row">
                                    <TrackerInitials name={t.name} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="pm-tracker-name">{t.name}</div>
                                        <div className="pm-tracker-domain">{t.domain}</div>
                                    </div>
                                    <span
                                        className="pm-cat-pill"
                                        style={{ background: CAT_COLORS[t.category] || C.blue }}
                                    >
                                        {t.category}
                                    </span>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div
                                            className="pm-status-dot"
                                            style={{ background: t.blocked ? C.gray300 : "#E24B4A" }}
                                        />
                                        <Toggle
                                            checked={t.blocked}
                                            onChange={() => toggleTracker(t.id)}
                                            variant="block"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div style={{ fontSize: 11, color: C.textHint, marginTop: 10, paddingLeft: 4 }}>
                            Toggle to block trackers · Red = blocked
                        </div>
                    </div>

                    {/* app permissions */}
                    <div className="pm-card">
                        <div className="pm-card-header">
                            <div className="pm-card-title">App permissions</div>
                            {highPerms > 0 && (
                                <span className="pm-warn">
                                    <Icon name="alert" size={10} color={C.amberDk} />
                                    {highPerms} risky
                                </span>
                            )}
                        </div>
                        {permissions.map((p, i) => {
                            const cfg = RISK_CFG[p.risk];
                            return (
                                <div key={p.id}>
                                    {i > 0 && <div className="pm-divider" />}
                                    <div className="pm-perm-row">
                                        <PermIcon name={p.icon} granted={p.granted} risk={p.risk} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span className="pm-perm-name">{p.name}</span>
                                                <RiskBadge risk={p.risk} />
                                            </div>
                                            <div className="pm-perm-status">
                                                {p.granted ? "Access granted" : "Access denied"}
                                            </div>
                                        </div>
                                        <Toggle checked={p.granted} onChange={() => togglePermission(p.id)} />
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ fontSize: 11, color: C.textHint, marginTop: 10, paddingLeft: 4 }}>
                            Toggle to grant or revoke app access
                        </div>
                    </div>
                </div>

                {/* tracker distribution chart */}
                <TrackerChart trackers={trackers} />

                {/* data leak alerts */}
                <div className="pm-card">
                    <div className="pm-card-header">
                        <div className="pm-card-title">Data leak alerts</div>
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            background: C.redLt, color: C.redDk
                        }}>
                            {ALERTS.filter(a => a.severity === "High").length} critical
                        </span>
                    </div>
                    {ALERTS.map((a) => {
                        const cfg = RISK_CFG[a.severity];
                        return (
                            <div
                                key={a.id}
                                className="pm-alert"
                                style={{ background: cfg.bg, borderColor: a.severity === "High" ? "#F7C1C1" : a.severity === "Medium" ? "#FAC775" : "#C0DD97" }}
                            >
                                <div className="pm-alert-icon" style={{ background: cfg.bg, border: `0.5px solid ${cfg.dot}` }}>
                                    <Icon name="alert" size={13} color={cfg.color} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="pm-alert-title">{a.title}</div>
                                    <div className="pm-alert-detail">{a.detail}</div>
                                    <div className="pm-alert-meta">
                                        <RiskBadge risk={a.severity} />
                                        <span className="pm-alert-ts">{a.ts}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </>
    );
}