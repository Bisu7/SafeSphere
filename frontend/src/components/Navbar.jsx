import { useNavigate, useLocation } from "react-router-dom";

const PAGE_LABELS = {
    "/": { title: "Dashboard", sub: "Security overview" },
    "/scam": { title: "Scam detection", sub: "AI-powered scam analysis" },
    "/privacy": { title: "Privacy monitor", sub: "Tracker & data protection" },
    "/financial": { title: "Financial risk", sub: "Account & payment safety" },
    "/advisor": { title: "Security advisor", sub: "Personalized AI guidance" },
};

function SearchIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
                d="M7.5 2a4 4 0 00-4 4v3l-1 1.5h10L11.5 9V6a4 4 0 00-4-4z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            <path d="M6 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
                d="M2 6.5h8M7.5 3l3.5 3.5L7.5 10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const s = {
    navbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "56px",
        background: "#fff",
        borderBottom: "0.5px solid #e2e8f0",
        flexShrink: 0,
    },
    pageTitle: {
        fontSize: "15px",
        fontWeight: 500,
        color: "#111",
        lineHeight: 1.2,
    },
    pageSub: {
        fontSize: "11px",
        color: "#9ca3af",
        marginTop: "1px",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    liveBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "#EAF3DE",
        color: "#27500A",
        fontSize: "11px",
        fontWeight: 500,
        padding: "4px 10px",
        borderRadius: "20px",
    },
    liveDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#639922",
    },
    iconBtn: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "0.5px solid #e2e8f0",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#6b7280",
        flexShrink: 0,
        position: "relative",
    },
    notifDot: {
        position: "absolute",
        top: "6px",
        right: "6px",
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: "#E24B4A",
        border: "1.5px solid #fff",
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "0.5px solid #e2e8f0",
        background: "transparent",
        fontSize: "12px",
        fontWeight: 500,
        color: "#6b7280",
        cursor: "pointer",
        fontFamily: "inherit",
    },
};

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const page = PAGE_LABELS[location.pathname] || { title: "SafeSphere", sub: "Secure platform" };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/auth/login");
    };

    return (
        <div style={s.navbar}>
            <div>
                <div style={s.pageTitle}>{page.title}</div>
                <div style={s.pageSub}>{page.sub}</div>
            </div>

            <div style={s.right}>
                <div style={s.liveBadge}>
                    <div style={s.liveDot} />
                    Live
                </div>

                <button style={s.iconBtn} title="Search" aria-label="Search">
                    <SearchIcon />
                </button>

                <button style={s.iconBtn} title="Notifications" aria-label="Notifications">
                    <BellIcon />
                    <div style={s.notifDot} />
                </button>

                <button style={s.logoutBtn} onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                </button>
            </div>
        </div>
    );
}