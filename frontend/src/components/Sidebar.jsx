import { Link, useLocation } from "react-router-dom";


const NAV_SECTIONS = [
    {
        label: "Main",
        items: [
            {
                to: "/",
                label: "Dashboard",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                ),
            },
        ],
    },
    {
        label: "Protection",
        items: [
            {
                to: "/scam",
                label: "Scam detection",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                ),
            },
            {
                to: "/privacy",
                label: "Privacy monitor",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                        <path
                            d="M2 8h12M8 2c-1.5 2-2 4-2 6s.5 4 2 6M8 2c1.5 2 2 4 2 6s-.5 4-2 6"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        />
                    </svg>
                ),
            },
            {
                to: "/financial",
                label: "Financial risk",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                ),
            },
        ],
    },
    {
        label: "AI",
        items: [
            {
                to: "/advisor",
                label: "Security advisor",
                icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2L2 5v4c0 3 2.5 5 6 6 3.5-1 6-3 6-6V5L8 2z" stroke="currentColor" strokeWidth="1.2" />
                        <path
                            d="M5.5 8l2 2L11 6"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ),
            },
        ],
    },
];

const s = {
    sidebar: {
        width: "220px",
        background: "#fff",
        borderRight: "0.5px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
    },
    logoArea: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "18px 16px 14px",
        borderBottom: "0.5px solid #e2e8f0",
        flexShrink: 0,
    },
    logoIcon: {
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        background: "#E6F1FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    brandText: {
        fontSize: "15px",
        fontWeight: 500,
        color: "#111",
        letterSpacing: "-0.3px",
    },
    nav: {
        flex: 1,
        padding: "10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        overflowY: "auto",
    },
    sectionLabel: {
        fontSize: "10px",
        fontWeight: 500,
        color: "#9ca3af",
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        padding: "8px 8px 4px",
    },
    navItem: (active) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: active ? 500 : 400,
        color: active ? "#0C447C" : "#4b5563",
        background: active ? "#E6F1FB" : "transparent",
        transition: "background 0.12s, color 0.12s",
    }),
    navIcon: (active) => ({
        flexShrink: 0,
        color: active ? "#185FA5" : "#9ca3af",
        display: "flex",
        alignItems: "center",
    }),
    footer: {
        padding: "12px 10px",
        borderTop: "0.5px solid #e2e8f0",
        flexShrink: 0,
    },
    userRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        borderRadius: "8px",
    },
    avatar: {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        background: "#E6F1FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontWeight: 500,
        color: "#0C447C",
        flexShrink: 0,
        letterSpacing: "0.3px",
    },
    userName: {
        fontSize: "12px",
        fontWeight: 500,
        color: "#111",
        lineHeight: 1.3,
    },
    userEmail: {
        fontSize: "11px",
        color: "#9ca3af",
        lineHeight: 1.3,
    },
    versionBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#f8fafc",
        border: "0.5px solid #e2e8f0",
        borderRadius: "20px",
        padding: "3px 8px",
        fontSize: "10px",
        color: "#9ca3af",
        marginBottom: "8px",
        marginLeft: "10px",
    },
};

export default function Sidebar() {
    const location = useLocation();

    const userName = localStorage.getItem("user_name") || "Guest User";
    const userEmail = localStorage.getItem("user_email") || "[EMAIL_ADDRESS]";
    const initials = userName.substring(0, 2).toUpperCase();

    const isActive = (to) =>
        to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

    return (
        <div style={s.sidebar}>
            {/* logo */}
            <div style={s.logoArea}>
                <div style={s.logoIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1z" stroke="#185FA5" strokeWidth="1.3" />
                        <path
                            d="M5.5 8l2 2L11 6.5"
                            stroke="#185FA5"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div style={s.brandText}>
                    Safe<span style={{ color: "#185FA5" }}>Sphere</span>
                </div>
            </div>

            {/* nav */}
            <nav style={s.nav}>
                {NAV_SECTIONS.map((section) => (
                    <div key={section.label}>
                        <div style={s.sectionLabel}>{section.label}</div>
                        {section.items.map((item) => {
                            const active = isActive(item.to);
                            return (
                                <Link key={item.to} to={item.to} style={s.navItem(active)}>
                                    <span style={s.navIcon(active)}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* user footer */}
            <div style={s.footer}>
                <div style={s.versionBadge}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="3" stroke="#9ca3af" strokeWidth="1" />
                        <path d="M4 2.5v1.5l1 1" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" />
                    </svg>
                    v1.0.0
                </div>
                <div style={s.userRow}>
                    <div style={s.avatar}>{initials}</div>
                    <div>
                        <div style={s.userName}>{userName}</div>
                        <div style={s.userEmail}>{userEmail}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}