import { useState, useRef, useCallback } from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const C = {
    blue: "#185FA5",
    blueLt: "#E6F1FB",
    blueMd: "#378ADD",
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
    gray400: "#94A3B8",
    gray600: "#475569",
    gray800: "#1E293B",
    gray900: "#0F172A",
    white: "#FFFFFF",
    text: "#111827",
    textMuted: "#6B7280",
    textHint: "#9CA3AF",
    border: "#E2E8F0",
};

const font = "'DM Sans', 'Geist', system-ui, sans-serif";
const mono = "'DM Mono', 'Fira Code', monospace";

// ─── risk config ──────────────────────────────────────────────────────────────
const RISK = {
    Low: { color: C.green, bg: C.greenLt, textColor: C.greenDk, bar: "#639922" },
    Medium: { color: C.amber, bg: C.amberLt, textColor: C.amberDk, bar: "#BA7517" },
    High: { color: C.red, bg: C.redLt, textColor: C.redDk, bar: "#E24B4A" },
};

// ─── real history persistence ──────────────────────────────────────────────────
const STORAGE_KEY = "safesphere_scan_history";

function getStoredHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

// ─── call Anthropic API ───────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

/**
 * Maps backend response to frontend UI format
 */
function mapBackendResponse(data) {
    const riskMap = {
        "Safe": "Low",
        "Suspicious": "Medium",
        "Scam": "High"
    };

    return {
        score: Math.round(data.score * 100),
        risk: riskMap[data.risk] || "Low",
        explanation: data.explanation,
        flags: data.highlights || []
    };
}

async function scanText(content) {
    const response = await fetch(`${API_BASE}/scan/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Text scan failed");
    return mapBackendResponse(await response.json());
}

async function scanUrl(url) {
    const response = await fetch(`${API_BASE}/scan/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });
    if (!response.ok) throw new Error("URL scan failed");
    return mapBackendResponse(await response.json());
}

async function scanImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/scan/image`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Image scan failed");
    return mapBackendResponse(await response.json());
}

// ─── inline styles ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-root {
    font-family: ${font};
    color: ${C.text};
    background: ${C.gray50};
    min-height: 100vh;
    padding: 2rem 1.5rem 4rem;
    max-width: 860px;
    margin: 0 auto;
  }

  .sd-page-header { margin-bottom: 2rem; }
  .sd-page-title {
    font-size: 24px;
    font-weight: 600;
    color: ${C.gray900};
    letter-spacing: -0.4px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sd-page-desc { font-size: 14px; color: ${C.textMuted}; max-width: 540px; line-height: 1.6; }

  .sd-card {
    background: ${C.white};
    border: 0.5px solid ${C.border};
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .sd-card-title {
    font-size: 13px;
    font-weight: 600;
    color: ${C.textHint};
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .sd-textarea {
    width: 100%;
    min-height: 110px;
    padding: 12px 14px;
    font-family: ${mono};
    font-size: 13px;
    color: ${C.text};
    background: ${C.gray50};
    border: 0.5px solid ${C.border};
    border-radius: 10px;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    line-height: 1.6;
  }
  .sd-textarea:focus { border-color: ${C.blue}; box-shadow: 0 0 0 3px ${C.blueLt}; }
  .sd-textarea::placeholder { color: ${C.textHint}; }

  .sd-input-row {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .sd-upload-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 8px;
    border: 0.5px solid ${C.border};
    background: ${C.white};
    font-family: ${font};
    font-size: 13px;
    font-weight: 500;
    color: ${C.gray600};
    cursor: pointer;
    transition: background 0.12s;
  }
  .sd-upload-btn:hover { background: ${C.gray100}; }

  .sd-scan-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 20px;
    border-radius: 8px;
    border: none;
    background: ${C.blue};
    font-family: ${font};
    font-size: 13px;
    font-weight: 600;
    color: ${C.white};
    cursor: pointer;
    transition: background 0.12s, transform 0.1s;
    margin-left: auto;
  }
  .sd-scan-btn:hover { background: ${C.blueDk}; }
  .sd-scan-btn:active { transform: scale(0.98); }
  .sd-scan-btn:disabled { background: ${C.gray400}; cursor: not-allowed; transform: none; }

  .sd-file-label {
    font-size: 12px;
    color: ${C.textMuted};
    margin-top: 8px;
    font-family: ${mono};
  }

  .sd-score-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 12px;
  }
  .sd-score-number {
    font-size: 52px;
    font-weight: 700;
    letter-spacing: -2px;
    line-height: 1;
  }
  .sd-score-label { font-size: 13px; color: ${C.textMuted}; margin-top: 4px; }

  .sd-risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .sd-bar-track {
    height: 6px;
    border-radius: 4px;
    background: ${C.gray200};
    margin-bottom: 1.25rem;
    overflow: hidden;
  }
  .sd-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .sd-section-label {
    font-size: 12px;
    font-weight: 600;
    color: ${C.textHint};
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .sd-explanation {
    font-size: 14px;
    line-height: 1.7;
    color: ${C.gray800};
    margin-bottom: 1.25rem;
  }

  .sd-flags { display: flex; flex-wrap: wrap; gap: 6px; }
  .sd-flag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    font-family: ${mono};
    background: ${C.redLt};
    color: ${C.redDk};
    border: 0.5px solid #F7C1C1;
  }
  .sd-flag-safe {
    background: ${C.greenLt};
    color: ${C.greenDk};
    border-color: #C0DD97;
  }

  .sd-skeleton {
    background: ${C.gray100};
    border-radius: 6px;
    animation: sd-shimmer 1.4s ease-in-out infinite;
  }
  @keyframes sd-shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .sd-spin {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: sd-rotate 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes sd-rotate { to { transform: rotate(360deg); } }

  .sd-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    transition: background 0.1s;
    cursor: pointer;
  }
  .sd-history-item:hover { background: ${C.gray50}; }
  .sd-history-preview {
    font-size: 13px;
    font-family: ${mono};
    color: ${C.gray800};
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sd-history-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .sd-history-ts { font-size: 11px; color: ${C.textHint}; }
  .sd-mini-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .sd-divider {
    height: 0.5px;
    background: ${C.border};
    margin: 2px 0;
  }

  .sd-empty {
    text-align: center;
    padding: 2rem 1rem;
    color: ${C.textHint};
    font-size: 13px;
  }

  @media (max-width: 600px) {
    .sd-root { padding: 1.25rem 1rem 3rem; }
    .sd-score-number { font-size: 40px; }
    .sd-card { padding: 1.25rem; }
  }
`;

// ─── sub-components ───────────────────────────────────────────────────────────

function ShieldIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 5.5v5c0 4 3 7 7 8 4-1 7-4 7-8v-5L10 2z" stroke={C.blue} strokeWidth="1.5" fill={C.blueLt} />
            <path d="M7 10l2.5 2.5L14 8" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function UploadIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 9V2M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function ScanIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 4.5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function FlagIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 1v9M2 1h6l-1.5 3L8 7H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function RiskBadge({ risk, size = "md" }) {
    const cfg = RISK[risk] || RISK.Low;
    const pad = size === "sm" ? "2px 8px" : "6px 14px";
    const fs = size === "sm" ? "11px" : "13px";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: pad,
                borderRadius: 20,
                fontSize: fs,
                fontWeight: 600,
                background: cfg.bg,
                color: cfg.textColor,
                fontFamily: font,
            }}
        >
            <span
                style={{
                    width: size === "sm" ? 5 : 7,
                    height: size === "sm" ? 5 : 7,
                    borderRadius: "50%",
                    background: cfg.bar,
                    flexShrink: 0,
                }}
            />
            {risk}
        </span>
    );
}

function SkeletonResult() {
    return (
        <div className="sd-card">
            <div className="sd-card-title">Analysis result</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                    <div className="sd-skeleton" style={{ width: 80, height: 52, borderRadius: 8 }} />
                    <div className="sd-skeleton" style={{ width: 120, height: 14, marginTop: 8, borderRadius: 4 }} />
                </div>
                <div className="sd-skeleton" style={{ width: 90, height: 32, borderRadius: 20 }} />
            </div>
            <div className="sd-skeleton" style={{ height: 6, borderRadius: 4, marginBottom: 20 }} />
            <div className="sd-skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 4 }} />
            <div className="sd-skeleton" style={{ height: 14, width: "70%", marginBottom: 20, borderRadius: 4 }} />
            <div style={{ display: "flex", gap: 8 }}>
                <div className="sd-skeleton" style={{ width: 120, height: 26, borderRadius: 6 }} />
                <div className="sd-skeleton" style={{ width: 140, height: 26, borderRadius: 6 }} />
            </div>
        </div>
    );
}

function ResultCard({ result }) {
    const cfg = RISK[result.risk] || RISK.Low;
    const scoreColor = cfg.bar;
    const isSafe = result.risk === "Low";

    return (
        <div className="sd-card" style={{ borderLeft: `3px solid ${scoreColor}`, borderRadius: "0 14px 14px 0" }}>
            <div className="sd-card-title">Analysis result</div>

            <div className="sd-score-row">
                <div>
                    <div className="sd-score-number" style={{ color: scoreColor }}>{result.score}%</div>
                    <div className="sd-score-label">Scam probability</div>
                </div>
                <RiskBadge risk={result.risk} />
            </div>

            <div className="sd-bar-track">
                <div className="sd-bar-fill" style={{ width: `${result.score}%`, background: scoreColor }} />
            </div>

            <div className="sd-section-label">AI explanation</div>
            <p className="sd-explanation">{result.explanation}</p>

            {result.flags && result.flags.length > 0 && (
                <>
                    <div className="sd-section-label">{isSafe ? "Notes" : "Suspicious elements"}</div>
                    <div className="sd-flags">
                        {result.flags.map((f, i) => (
                            <span key={i} className={`sd-flag ${isSafe ? "sd-flag-safe" : ""}`}>
                                <FlagIcon />
                                {f}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function HistoryList({ items, onReplay }) {
    if (!items.length) {
        return (
            <div className="sd-card">
                <div className="sd-card-title">Scan history</div>
                <div className="sd-empty">No scans yet — run your first analysis above.</div>
            </div>
        );
    }

    return (
        <div className="sd-card">
            <div className="sd-card-title">Scan history</div>
            {items.map((item, i) => (
                <div key={item.id}>
                    {i > 0 && <div className="sd-divider" />}
                    <div className="sd-history-item" onClick={() => onReplay(item.preview)}>
                        <div className="sd-history-preview">{item.preview}</div>
                        <div className="sd-history-meta">
                            <span className="sd-history-ts">{item.ts}</span>
                            <RiskBadge risk={item.risk} size="sm" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function ScamDetection() {
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [history, setHistory] = useState(getStoredHistory);
    const fileRef = useRef(null);
    const nextId = useRef(10);

    const handleScan = useCallback(async () => {
        const content = input.trim();
        if (!content && !selectedFile) {
            setError("Please enter a URL/text or upload an image to scan.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        try {
            let res;
            let displayPreview = content;

            if (selectedFile) {
                res = await scanImage(selectedFile);
                displayPreview = `[Image] ${fileName}`;
            } else if (content.startsWith("http://") || content.startsWith("https://")) {
                res = await scanUrl(content);
            } else {
                res = await scanText(content);
            }

            setResult(res);
            setHistory((prev) => {
                const newHistory = [
                    {
                        id: Date.now(),
                        preview: displayPreview.length > 60 ? displayPreview.slice(0, 60) + "…" : displayPreview,
                        risk: res.risk,
                        score: res.score,
                        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                    ...prev,
                ].slice(0, 50); // Keep last 50
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
            
            // Reset file after successful scan
            setSelectedFile(null);
            setFileName("");
        } catch (e) {
            console.error(e);
            setError("Scan failed — check backend connection or file format.");
        } finally {
            setLoading(false);
        }
    }, [input, selectedFile, fileName]);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setFileName(file.name);
        setInput(""); // Clear text input if file is selected
    };

    const handleReplay = (preview) => {
        setInput(preview.replace("…", ""));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleKey = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleScan();
    };

    return (
        <>
            <style>{css}</style>
            <div className="sd-root">

                {/* page header */}
                <div className="sd-page-header">
                    <div className="sd-page-title">
                        <ShieldIcon size={22} />
                        Scam detection
                    </div>
                    <p className="sd-page-desc">
                        Paste a URL, suspicious message, or email to get an instant AI-powered scam risk analysis.
                        Upload screenshots for visual content scanning.
                    </p>
                </div>

                {/* input card */}
                <div className="sd-card">
                    <div className="sd-card-title">Analyze content</div>
                    <textarea
                        className="sd-textarea"
                        placeholder="Paste a URL, message, or email text here…&#10;&#10;e.g. https://suspicious-domain.xyz/claim?id=1234&#10;or: 'You've won a $500 gift card! Click here to claim now.'"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                    />
                    {error && (
                        <p style={{ fontSize: 13, color: C.red, marginTop: 8 }}>{error}</p>
                    )}
                    <div className="sd-input-row">
                        <button className="sd-upload-btn" onClick={() => fileRef.current?.click()}>
                            <UploadIcon />
                            Upload screenshot
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFile}
                        />
                        {fileName && (
                            <span className="sd-file-label">{fileName}</span>
                        )}
                        <button className="sd-scan-btn" onClick={handleScan} disabled={loading}>
                            {loading ? <span className="sd-spin" /> : <ScanIcon />}
                            {loading ? "Scanning…" : "Scan now"}
                        </button>
                    </div>
                    <p style={{ fontSize: 11, color: C.textHint, marginTop: 10 }}>
                        Tip: Press <kbd style={{ fontFamily: mono, background: C.gray100, padding: "1px 5px", borderRadius: 4, border: `0.5px solid ${C.border}` }}>⌘ Enter</kbd> to scan
                    </p>
                </div>

                {/* result */}
                {loading && <SkeletonResult />}
                {!loading && result && <ResultCard result={result} />}

                {/* history */}
                <HistoryList items={history} onReplay={handleReplay} />

            </div>
        </>
    );
}