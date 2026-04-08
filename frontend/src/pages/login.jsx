import { useState } from "react";

const ShieldIcon = () => (
    <svg width="52" height="56" viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 2L4 11V28C4 40.8 13.6 52.4 26 55C38.4 52.4 48 40.8 48 28V11L26 2Z" fill="#185FA5" fillOpacity="0.12" />
        <path d="M26 2L4 11V28C4 40.8 13.6 52.4 26 55C38.4 52.4 48 40.8 48 28V11L26 2Z" stroke="#185FA5" strokeWidth="2" fill="none" />
        <circle cx="26" cy="27" r="8" fill="#185FA5" fillOpacity="0.2" />
        <path d="M22 27l3 3 6-6" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l2.5 2.5L10 3" stroke="#185FA5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const features = [
    "Scam detection",
    "Phishing alerts",
    "Tracker blocking",
    "Risk analysis",
];

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["#E24B4A", "#EF9F27", "#185FA5", "#1D9E75"];
    const labelColors = ["#A32D2D", "#854F0B", "#0C447C", "#0F6E56"];
    return {
        score,
        label: password.length === 0 ? "" : labels[score - 1] || "Weak",
        color: colors[score - 1] || "#E24B4A",
        labelColor: labelColors[score - 1] || "#A32D2D",
    };
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
        backgroundColor: "#f5f7fa",
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    logoArea: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "1.75rem",
    },
    brand: {
        fontSize: "26px",
        fontWeight: 500,
        color: "#111",
        letterSpacing: "-0.5px",
        marginTop: "12px",
    },
    brandSpan: { color: "#185FA5" },
    tagline: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
    card: {
        background: "#fff",
        border: "0.5px solid #e2e8f0",
        borderRadius: "14px",
        padding: "2rem",
        width: "100%",
        maxWidth: "420px",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "#E6F1FB",
        color: "#0C447C",
        fontSize: "11px",
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: "20px",
        marginBottom: "10px",
    },
    cardTitle: { fontSize: "18px", fontWeight: 500, color: "#111", marginBottom: "6px" },
    cardSub: { fontSize: "14px", color: "#6b7280", marginBottom: "1.5rem" },
    field: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" },
    label: { fontSize: "13px", fontWeight: 500, color: "#374151" },
    inputWrap: { position: "relative" },
    input: {
        width: "100%",
        padding: "10px 38px 10px 12px",
        fontSize: "15px",
        border: "0.5px solid #cbd5e1",
        borderRadius: "8px",
        background: "#f8fafc",
        color: "#111",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
    },
    inputIcon: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#9ca3af",
        display: "flex",
        alignItems: "center",
    },
    fieldRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "1rem",
    },
    btn: {
        width: "100%",
        padding: "11px",
        fontSize: "15px",
        fontWeight: 500,
        border: "none",
        borderRadius: "8px",
        background: "#185FA5",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        marginTop: "0.25rem",
    },
    forgotWrap: { textAlign: "right", marginBottom: "1.25rem" },
    forgotLink: { fontSize: "13px", color: "#185FA5", textDecoration: "none", cursor: "pointer" },
    featuresGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "1.25rem 0" },
    feature: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6b7280" },
    featureDot: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "#E6F1FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    divider: { display: "flex", alignItems: "center", gap: "10px", margin: "1.25rem 0" },
    dividerLine: { flex: 1, height: "0.5px", background: "#e2e8f0" },
    dividerText: { fontSize: "12px", color: "#9ca3af" },
    switchLink: { textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "1.25rem" },
    switchLinkA: { color: "#185FA5", fontWeight: 500, cursor: "pointer", textDecoration: "none" },
    message: (type) => ({
        padding: "10px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        marginBottom: "1rem",
        background: type === "success" ? "#eaf3de" : "#fcebeb",
        color: type === "success" ? "#27500a" : "#791f1f",
        border: `0.5px solid ${type === "success" ? "#97c459" : "#f09595"}`,
    }),
    strengthBars: { display: "flex", gap: "4px", marginTop: "6px" },
    strengthBar: (filled, color) => ({
        height: "3px",
        flex: 1,
        borderRadius: "2px",
        background: filled ? color : "#e2e8f0",
        transition: "background 0.3s",
    }),
    strengthLabel: (color) => ({ fontSize: "11px", marginTop: "4px", color }),
    terms: {
        fontSize: "12px",
        color: "#9ca3af",
        textAlign: "center",
        marginTop: "1rem",
        lineHeight: 1.6,
    },
    termsA: { color: "#185FA5", textDecoration: "none" },
};

function PasswordInput({ id, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div style={styles.inputWrap}>
            <input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={styles.input}
            />
            <span style={styles.inputIcon} onClick={() => setShow((s) => !s)}>
                {show ? <EyeOffIcon /> : <EyeIcon />}
            </span>
        </div>
    );
}

function Message({ text, type }) {
    if (!text) return null;
    return <div style={styles.message(type)}>{text}</div>;
}

function LoginForm({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [msgType, setMsgType] = useState("error");

    const handleLogin = async () => {
        setMessage("");
        if (!email || !password) {
            setMsgType("error");
            setMessage("Please fill in all fields.");
            return;
        }
        setMsgType("success");
        setMessage("Signing in...");
        try {
            const res = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                setMsgType("success");
                setMessage("Login successful! Redirecting...");
            } else {
                setMsgType("error");
                setMessage(data.error || "Invalid login credentials.");
            }
        } catch {
            setMsgType("error");
            setMessage("Network error. Make sure the backend is running.");
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.badge}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" fill="#185FA5" />
                    <path d="M3 5l1.5 1.5L7 3.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Secure login
            </div>
            <div style={styles.cardTitle}>Welcome back</div>
            <div style={styles.cardSub}>Sign in to your SafeSphere account</div>

            <Message text={message} type={msgType} />

            <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <div style={styles.inputWrap}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={styles.input}
                    />
                    <span style={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                    </span>
                </div>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>

            <div style={styles.forgotWrap}>
                <span style={styles.forgotLink}>Forgot password?</span>
            </div>

            <button style={styles.btn} onClick={handleLogin}>
                Sign in to SafeSphere
            </button>

            <div style={styles.featuresGrid}>
                {features.map((f) => (
                    <div key={f} style={styles.feature}>
                        <div style={styles.featureDot}><CheckIcon /></div>
                        {f}
                    </div>
                ))}
            </div>

            <div style={styles.switchLink}>
                Don't have an account?{" "}
                <span style={styles.switchLinkA} onClick={onSwitch}>
                    Create one free
                </span>
            </div>
        </div>
    );
}

function RegisterForm({ onSwitch }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [msgType, setMsgType] = useState("error");

    const strength = getPasswordStrength(password);

    const handleRegister = async () => {
        setMessage("");
        if (!name || !email || !password || !confirm) {
            setMsgType("error");
            setMessage("Please fill in all fields.");
            return;
        }
        if (password !== confirm) {
            setMsgType("error");
            setMessage("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setMsgType("error");
            setMessage("Password must be at least 8 characters.");
            return;
        }
        setMsgType("success");
        setMessage("Creating your account...");
        try {
            const res = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMsgType("success");
                setMessage("Account created! Please sign in.");
                setTimeout(onSwitch, 1500);
            } else {
                setMsgType("error");
                setMessage(data.error || "Registration failed.");
            }
        } catch {
            setMsgType("error");
            setMessage("Network error. Make sure the backend is running.");
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.badge}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" fill="#185FA5" />
                    <path d="M5 3v4M3 5h4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                New account
            </div>
            <div style={styles.cardTitle}>Create your account</div>
            <div style={styles.cardSub}>Start protecting yourself with AI-powered security</div>

            <Message text={message} type={msgType} />

            <div style={styles.field}>
                <div style={styles.field}>
                    <label style={styles.label}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex"
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <div style={styles.inputWrap}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={styles.input}
                    />
                    <span style={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                    </span>
                </div>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                />
                <div style={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={styles.strengthBar(i <= strength.score, strength.color)} />
                    ))}
                </div>
                {strength.label && (
                    <div style={styles.strengthLabel(strength.labelColor)}>{strength.label}</div>
                )}
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Confirm password</label>
                <PasswordInput
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                />
            </div>

            <button style={styles.btn} onClick={handleRegister}>
                Create my SafeSphere account
            </button>

            <div style={styles.terms}>
                By registering, you agree to our{" "}
                <a href="#" style={styles.termsA}>Terms of Service</a> and{" "}
                <a href="#" style={styles.termsA}>Privacy Policy</a>.
            </div>

            <div style={styles.switchLink}>
                Already have an account?{" "}
                <span style={styles.switchLinkA} onClick={onSwitch}>
                    Sign in
                </span>
            </div>
        </div>
    );
}

export default function Login() {
    const [view, setView] = useState("login");

    return (
        <div style={styles.page}>
            <div style={styles.logoArea}>
                <ShieldIcon />
                <div style={styles.brand}>
                    Safe<span style={styles.brandSpan}>Sphere</span>
                </div>
                <div style={styles.tagline}>AI-powered protection for the digital world</div>
            </div>

            {view === "login" ? (
                <LoginForm onSwitch={() => setView("register")} />
            ) : (
                <RegisterForm onSwitch={() => setView("login")} />
            )}
        </div>
    );
}