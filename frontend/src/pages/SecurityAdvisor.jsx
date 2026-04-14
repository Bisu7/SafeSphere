import { useState } from "react";

// ─── tokens ───────────────────────────────────────────────────────────────────
const C = {
    blue: "#185FA5", blueLt: "#E6F1FB", blueDk: "#0C447C",
    red: "#E24B4A", redLt: "#FCEBEB", redDk: "#791F1F",
    amber: "#BA7517", amberLt: "#FAEEDA", amberDk: "#633806",
    green: "#3B6D11", greenLt: "#EAF3DE", greenDk: "#27500A",
    purple: "#534AB7", purpleLt: "#EEEDFE", purpleDk: "#3C3489",
    teal: "#0F6E56", tealLt: "#E1F5EE", tealDk: "#085041",
    gray50: "#F8FAFC", gray100: "#F1F5F9", gray200: "#E2E8F0",
    gray300: "#CBD5E1", gray400: "#94A3B8", gray500: "#64748B",
    gray600: "#475569", gray700: "#334155", gray800: "#1E293B",
    gray900: "#0F172A",
    white: "#FFFFFF", border: "#E2E8F0",
    text: "#111827", muted: "#6B7280", hint: "#9CA3AF",
};
const font = "'DM Sans', system-ui, sans-serif";
const mono = "'DM Mono', 'Fira Code', monospace";

// ─── data ─────────────────────────────────────────────────────────────────────
const INIT_RECS = [
    {
        id: 1, priority: "High", done: false,
        icon: "lock2",
        title: "Enable two-factor authentication",
        desc: "Your account has no second factor enabled. A stolen password alone can compromise your account.",
        action: "Enable 2FA",
        impact: "+18 pts",
    },
    {
        id: 2, priority: "High", done: false,
        icon: "key",
        title: "Change weak password",
        desc: "Your current password is under 10 characters and appears in known breach lists. Change it now.",
        action: "Update password",
        impact: "+15 pts",
    },
    {
        id: 3, priority: "Medium", done: false,
        icon: "wifi",
        title: "Avoid public Wi-Fi for banking",
        desc: "You accessed your financial dashboard over an unsecured network 3 times this month.",
        action: "Set VPN reminder",
        impact: "+8 pts",
    },
    {
        id: 4, priority: "Medium", done: false,
        icon: "refresh",
        title: "Review app permissions",
        desc: "4 apps have access to your location and contacts that may not be necessary.",
        action: "Review now",
        impact: "+7 pts",
    },
    {
        id: 5, priority: "Low", done: true,
        icon: "mail",
        title: "Verify recovery email",
        desc: "Your recovery email has been confirmed and is up to date.",
        action: "Done",
        impact: "+5 pts",
    },
    {
        id: 6, priority: "Low", done: true,
        icon: "bell",
        title: "Enable breach alerts",
        desc: "You'll now receive instant notifications if your email appears in a new data breach.",
        action: "Done",
        impact: "+4 pts",
    },
];

const AI_INSIGHTS = [
    {
        id: 1, icon: "brain",
        title: "You're most vulnerable on weekends",
        detail: "85% of your suspicious activity happens Saturday–Sunday when you browse on mobile. Consider enabling stricter security on those days.",
        tag: "Behavioral pattern",
        tagColor: C.purple,
    },
    {
        id: 2, icon: "trend",
        title: "Password reuse detected across 4 services",
        detail: "Your finance and social accounts share a password. A breach on one exposes all four. Use a password manager.",
        tag: "Credential risk",
        tagColor: C.red,
    },
    {
        id: 3, icon: "location",
        title: "New sign-in location detected",
        detail: "An account access from Mumbai, MH was flagged. If this wasn't you, revoke the session immediately.",
        tag: "Access anomaly",
        tagColor: C.amber,
    },
];

const CHECKLIST = [
    { id: 1, label: "Enable 2FA on primary account", done: false },
    { id: 2, label: "Change weak/reused passwords", done: false },
    { id: 3, label: "Verify recovery email", done: true },
    { id: 4, label: "Enable breach notifications", done: true },
    { id: 5, label: "Review third-party app permissions", done: false },
    { id: 6, label: "Set up a VPN for public networks", done: false },
    { id: 7, label: "Enable login activity alerts", done: true },
    { id: 8, label: "Remove unused connected accounts", done: false },
];

const PRIORITY_CFG = {
    High: { bg: C.redLt, text: C.redDk, dot: "#E24B4A", border: "#F7C1C1" },
    Medium: { bg: C.amberLt, text: C.amberDk, dot: "#BA7517", border: "#FAC775" },
    Low: { bg: C.greenLt, text: C.greenDk, dot: "#639922", border: "#C0DD97" },
};

// ─── styles ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.sa{font-family:${font};color:${C.text};background:${C.gray50};min-height:100vh;padding:2rem 1.5rem 4rem;max-width:980px;margin:0 auto;}

.sa-hdr{margin-bottom:1.75rem;}
.sa-title{font-size:24px;font-weight:600;color:${C.gray900};letter-spacing:-.4px;display:flex;align-items:center;gap:10px;margin-bottom:5px;}
.sa-desc{font-size:14px;color:${C.muted};line-height:1.6;}

/* score card */
.sa-score-card{background:${C.white};border:0.5px solid ${C.border};border-radius:16px;padding:1.75rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;}
.sa-score-ring{position:relative;width:110px;height:110px;flex-shrink:0;}
.sa-score-ring svg{transform:rotate(-90deg);}
.sa-score-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;}
.sa-score-num{font-size:28px;font-weight:600;line-height:1;letter-spacing:-1px;}
.sa-score-label{font-size:10px;color:${C.hint};margin-top:2px;text-transform:uppercase;letter-spacing:.4px;}
.sa-score-info{flex:1;min-width:180px;}
.sa-score-title{font-size:18px;font-weight:600;color:${C.gray900};margin-bottom:5px;letter-spacing:-.3px;}
.sa-score-sub{font-size:13px;color:${C.muted};line-height:1.6;margin-bottom:1rem;}
.sa-progress-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.sa-progress-label{font-size:12px;color:${C.muted};min-width:100px;}
.sa-progress-track{flex:1;height:6px;background:${C.gray200};border-radius:4px;overflow:hidden;}
.sa-progress-fill{height:100%;border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1);}
.sa-progress-pct{font-size:12px;font-family:${mono};font-weight:500;min-width:32px;text-align:right;}
.sa-score-actions{display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;}

/* section */
.sa-section-title{font-size:13px;font-weight:600;color:${C.hint};letter-spacing:.5px;text-transform:uppercase;margin-bottom:.875rem;}

/* rec grid */
.sa-rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:1.5rem;}
.sa-rec-card{background:${C.white};border:0.5px solid ${C.border};border-radius:13px;padding:1.1rem 1.25rem;display:flex;flex-direction:column;gap:10px;transition:border-color .15s;}
.sa-rec-card:hover{border-color:${C.gray300};}
.sa-rec-card.done{opacity:.65;}
.sa-rec-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
.sa-rec-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sa-rec-title{font-size:13px;font-weight:600;color:${C.gray800};line-height:1.4;flex:1;}
.sa-rec-desc{font-size:12px;color:${C.muted};line-height:1.65;}
.sa-rec-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;}
.sa-impact{font-size:11px;font-family:${mono};font-weight:500;color:${C.teal};background:${C.tealLt};padding:2px 7px;border-radius:20px;}
.sa-priority-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;}
.sa-badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

/* action buttons */
.sa-btn-primary{padding:6px 14px;border-radius:7px;border:none;background:${C.blue};color:${C.white};font-family:${font};font-size:12px;font-weight:600;cursor:pointer;transition:background .12s,transform .1s;}
.sa-btn-primary:hover{background:${C.blueDk};}
.sa-btn-primary:active{transform:scale(.98);}
.sa-btn-primary:disabled{background:${C.gray300};cursor:default;}
.sa-btn-ghost{padding:6px 14px;border-radius:7px;border:0.5px solid ${C.border};background:transparent;color:${C.gray600};font-family:${font};font-size:12px;font-weight:500;cursor:pointer;transition:background .1s;}
.sa-btn-ghost:hover{background:${C.gray100};}

/* insights */
.sa-insights-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;margin-bottom:1.5rem;}
.sa-insight-card{background:${C.white};border:0.5px solid ${C.border};border-radius:13px;padding:1.1rem 1.25rem;}
.sa-insight-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.sa-insight-ico{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sa-insight-tag{font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;color:${C.white};}
.sa-insight-title{font-size:13px;font-weight:600;color:${C.gray800};margin-bottom:5px;line-height:1.4;}
.sa-insight-detail{font-size:12px;color:${C.muted};line-height:1.65;}

/* checklist */
.sa-checklist-card{background:${C.white};border:0.5px solid ${C.border};border-radius:14px;padding:1.25rem;margin-bottom:1.5rem;}
.sa-checklist-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px;}
.sa-checklist-stat{font-size:12px;color:${C.muted};}
.sa-checklist-stat span{font-weight:600;color:${C.gray800};}
.sa-cl-track{height:5px;background:${C.gray200};border-radius:4px;overflow:hidden;margin-bottom:1rem;}
.sa-cl-fill{height:100%;background:${C.green};border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1);}
.sa-cl-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px;}
.sa-cl-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .1s;}
.sa-cl-item:hover{background:${C.gray50};}
.sa-cl-check{width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:0.5px solid ${C.gray300};background:${C.white};transition:background .15s,border-color .15s;}
.sa-cl-check.checked{background:${C.green};border-color:${C.green};}
.sa-cl-text{font-size:13px;color:${C.gray700};transition:color .15s;}
.sa-cl-text.checked{color:${C.hint};text-decoration:line-through;}

.sa-divider{height:.5px;background:${C.border};margin:1.5rem 0;}

@media(max-width:640px){
  .sa{padding:1.25rem 1rem 3rem;}
  .sa-score-card{gap:1.25rem;}
  .sa-score-ring{width:90px;height:90px;}
  .sa-score-num{font-size:22px;}
}
`;

// ─── icons ────────────────────────────────────────────────────────────────────
function Ic({ n, size = 14, color = "currentColor" }) {
    const p = { width: size, height: size };
    const icons = {
        shield: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 1.5L2 4.5v4c0 3.5 2.5 5.5 6 6.5 3.5-1 6-3 6-6.5v-4L8 1.5z" stroke={color} strokeWidth="1.3" /><path d="M5.5 8l2 2L11 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        lock2: <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" /><path d="M5 7V5a3 3 0 016 0v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><circle cx="8" cy="11" r="1" fill={color} /></svg>,
        key: <svg {...p} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="7" r="3.5" stroke={color} strokeWidth="1.2" /><path d="M9 9.5l4 4M11.5 10.5l1.5 1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        wifi: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M1.5 6a9 9 0 0113 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><path d="M4 9a5.5 5.5 0 018 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><path d="M6.5 12a2.5 2.5 0 013 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><circle cx="8" cy="14" r="1" fill={color} /></svg>,
        refresh: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 109.9-1M13 4l-.1 3-3-.1" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        mail: <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke={color} strokeWidth="1.2" /><path d="M1.5 5.5l6.5 4 6.5-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        bell: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 1.5a4 4 0 00-4 4v3.5l-1 1.5h10L12 9V5.5a4 4 0 00-4-4z" stroke={color} strokeWidth="1.2" /><path d="M6.5 12.5a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.2" /></svg>,
        brain: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 3C6 3 4.5 4.3 4.5 6c0 .8.3 1.5.8 2C4 8.4 3 9.4 3 10.5 3 12 4.3 13 6 13h4c1.7 0 3-1 3-2.5 0-1.1-1-2.1-2.3-2.5.5-.5.8-1.2.8-2C11.5 4.3 10 3 8 3z" stroke={color} strokeWidth="1.2" /><path d="M8 6v4M6.5 7.5h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>,
        trend: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M2 11l3.5-4 3 2.5L13 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 4h3v3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        location: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 015 5c0 3.5-5 8.5-5 8.5S3 10 3 6.5a5 5 0 015-5z" stroke={color} strokeWidth="1.2" /><circle cx="8" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2" /></svg>,
        check: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        star: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3.5H13l-3 2.5 1 3.5L8 9.5 5 11.5l1-3.5L3 5.5h3.5L8 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /></svg>,
        bolt: <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M9.5 2L5 9h5l-1.5 5L14 7H9L9.5 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /></svg>,
    };
    return icons[n] || null;
}

// ─── score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, color }) {
    const r = 46;
    const circ = 2 * Math.PI * r;
    const filled = circ * (score / 100);
    return (
        <div className="sa-score-ring">
            <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={r} fill="none" stroke={C.gray200} strokeWidth="8" />
                <circle
                    cx="55" cy="55" r={r} fill="none"
                    stroke={color} strokeWidth="8"
                    strokeDasharray={`${filled} ${circ - filled}`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="sa-score-inner">
                <div className="sa-score-num" style={{ color }}>{score}</div>
                <div className="sa-score-label">/ 100</div>
            </div>
        </div>
    );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function SecurityAdvisor() {
    const [recs, setRecs] = useState(INIT_RECS);
    const [checklist, setChecklist] = useState(CHECKLIST);
    const [fixedToast, setFixedToast] = useState("");

    const doneRecs = recs.filter(r => r.done).length;
    const totalRecs = recs.length;
    const clDone = checklist.filter(c => c.done).length;
    const clTotal = checklist.length;
    const clPct = Math.round((clDone / clTotal) * 100);

    // score = 40 base + checklist progress * 0.4 + completed recs * 4
    const score = Math.min(100, Math.round(40 + clPct * 0.4 + doneRecs * 4));
    const scoreColor = score >= 75 ? C.green : score >= 50 ? C.amber : C.red;
    const scoreLabel = score >= 75 ? "Good standing" : score >= 50 ? "Needs attention" : "At risk";

    const fixRec = (id) => {
        setRecs(rs => rs.map(r => r.id === id ? { ...r, done: true } : r));
        const rec = recs.find(r => r.id === id);
        if (rec) {
            setFixedToast(`✓ "${rec.title}" marked as done`);
            setTimeout(() => setFixedToast(""), 3000);
            // also tick matching checklist item
            setChecklist(cs => cs.map(c =>
                c.label.toLowerCase().includes(rec.title.toLowerCase().slice(0, 12))
                    ? { ...c, done: true } : c
            ));
        }
    };

    const toggleCl = (id) =>
        setChecklist(cs => cs.map(c => c.id === id ? { ...c, done: !c.done } : c));

    const pending = recs.filter(r => !r.done);
    const completed = recs.filter(r => r.done);

    return (
        <>
            <style>{CSS}</style>

            {/* toast */}
            {fixedToast && (
                <div style={{
                    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                    background: C.gray900, color: C.white, fontSize: 13, fontFamily: font,
                    padding: "10px 18px", borderRadius: 10, zIndex: 9999,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    animation: "fadeInUp .2s ease",
                }}>
                    {fixedToast}
                </div>
            )}

            <div className="sa">

                {/* header */}
                <div className="sa-hdr">
                    <div className="sa-title">
                        <Ic n="shield" size={22} color={C.blue} />
                        Security advisor
                    </div>
                    <p className="sa-desc">
                        AI-driven recommendations tailored to your activity — fix issues in order of impact.
                    </p>
                </div>

                {/* overall score card */}
                <div className="sa-score-card">
                    <ScoreRing score={score} color={scoreColor} />

                    <div className="sa-score-info">
                        <div className="sa-score-title">
                            Overall security score
                            <span style={{
                                marginLeft: 10, fontSize: 12, fontWeight: 500,
                                padding: "2px 9px", borderRadius: 20,
                                background: score >= 75 ? C.greenLt : score >= 50 ? C.amberLt : C.redLt,
                                color: score >= 75 ? C.greenDk : score >= 50 ? C.amberDk : C.redDk,
                            }}>
                                {scoreLabel}
                            </span>
                        </div>
                        <p className="sa-score-sub">
                            {pending.length > 0
                                ? `Fix ${pending.length} open recommendation${pending.length > 1 ? "s" : ""} to improve your score.`
                                : "All recommendations resolved — great work!"}
                        </p>

                        <div className="sa-progress-row">
                            <div className="sa-progress-label">Recommendations</div>
                            <div className="sa-progress-track">
                                <div
                                    className="sa-progress-fill"
                                    style={{ width: `${Math.round(doneRecs / totalRecs * 100)}%`, background: scoreColor }}
                                />
                            </div>
                            <div className="sa-progress-pct" style={{ color: scoreColor }}>
                                {doneRecs}/{totalRecs}
                            </div>
                        </div>

                        <div className="sa-progress-row">
                            <div className="sa-progress-label">Checklist</div>
                            <div className="sa-progress-track">
                                <div className="sa-progress-fill" style={{ width: `${clPct}%`, background: C.teal }} />
                            </div>
                            <div className="sa-progress-pct" style={{ color: C.teal }}>{clPct}%</div>
                        </div>

                        <div className="sa-score-actions">
                            {pending.length > 0 && (
                                <button className="sa-btn-primary" onClick={() => {
                                    const first = pending.find(r => r.priority === "High") || pending[0];
                                    if (first) fixRec(first.id);
                                }}>
                                    Fix top issue
                                </button>
                            )}
                            <button className="sa-btn-ghost">Download report</button>
                        </div>
                    </div>
                </div>

                {/* recommendations */}
                <div className="sa-section-title">
                    Recommendations · {pending.length} open
                </div>

                <div className="sa-rec-grid">
                    {[...pending, ...completed].map(rec => {
                        const pcfg = PRIORITY_CFG[rec.priority];
                        const iconBg =
                            rec.priority === "High" ? C.redLt :
                                rec.priority === "Medium" ? C.amberLt : C.blueLt;
                        const iconColor =
                            rec.priority === "High" ? C.red :
                                rec.priority === "Medium" ? C.amber : C.blue;

                        return (
                            <div key={rec.id} className={`sa-rec-card${rec.done ? " done" : ""}`}>
                                <div className="sa-rec-card-top">
                                    <div className="sa-rec-icon" style={{ background: iconBg }}>
                                        <Ic n={rec.icon} size={16} color={iconColor} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="sa-rec-title">{rec.title}</div>
                                    </div>
                                    <span
                                        className="sa-priority-badge"
                                        style={{ background: pcfg.bg, color: pcfg.text }}
                                    >
                                        <span className="sa-badge-dot" style={{ background: pcfg.dot }} />
                                        {rec.priority}
                                    </span>
                                </div>

                                <p className="sa-rec-desc">{rec.desc}</p>

                                <div className="sa-rec-footer">
                                    <span className="sa-impact">{rec.impact}</span>
                                    <button
                                        className="sa-btn-primary"
                                        onClick={() => !rec.done && fixRec(rec.id)}
                                        disabled={rec.done}
                                        style={rec.done ? { background: C.greenLt, color: C.greenDk, border: `0.5px solid ${C.greenDk}22` } : {}}
                                    >
                                        {rec.done ? "✓ Done" : rec.action}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="sa-divider" />

                {/* ai insights */}
                <div className="sa-section-title">AI insights</div>

                <div className="sa-insights-grid">
                    {AI_INSIGHTS.map(ins => (
                        <div key={ins.id} className="sa-insight-card">
                            <div className="sa-insight-top">
                                <div className="sa-insight-ico" style={{ background: ins.tagColor + "22" }}>
                                    <Ic n={ins.icon} size={15} color={ins.tagColor} />
                                </div>
                                <span
                                    className="sa-insight-tag"
                                    style={{ background: ins.tagColor }}
                                >
                                    {ins.tag}
                                </span>
                            </div>
                            <div className="sa-insight-title">{ins.title}</div>
                            <p className="sa-insight-detail">{ins.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="sa-divider" />

                {/* checklist */}
                <div className="sa-checklist-card">
                    <div className="sa-checklist-meta">
                        <div className="sa-section-title" style={{ margin: 0 }}>Security checklist</div>
                        <div className="sa-checklist-stat">
                            <span>{clDone}</span> of <span>{clTotal}</span> completed
                        </div>
                    </div>

                    <div className="sa-cl-track">
                        <div className="sa-cl-fill" style={{ width: `${clPct}%` }} />
                    </div>

                    <div className="sa-cl-items">
                        {checklist.map(item => (
                            <div key={item.id} className="sa-cl-item" onClick={() => toggleCl(item.id)}>
                                <div className={`sa-cl-check${item.done ? " checked" : ""}`}>
                                    {item.done && <Ic n="check" size={11} color={C.white} />}
                                </div>
                                <span className={`sa-cl-text${item.done ? " checked" : ""}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}