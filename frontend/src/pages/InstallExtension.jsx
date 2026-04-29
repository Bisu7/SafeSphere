import React, { useState } from "react";

export default function InstallExtension() {
    const [isInstalling, setIsInstalling] = useState(false);

    const handleAddClick = () => {
        setIsInstalling(true);
        // Trigger download as a fallback/initial step
        const link = document.createElement('a');
        link.href = '/extension.zip';
        link.download = 'safesphere-extension.zip';
        link.click();
        
        // In a real production app with Web Store listing:
        // window.open('https://chrome.google.com/webstore/detail/your-extension-id', '_blank');
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "'Inter', system-ui, sans-serif" }}>
            
            {/* Mock Web Store Header */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                background: "#fff", 
                padding: "24px", 
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                marginBottom: "2rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ 
                        width: "64px", 
                        height: "64px", 
                        background: "linear-gradient(135deg, #185FA5 0%, #3B82F6 100%)",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 15px -3px rgba(24, 95, 165, 0.2)"
                    }}>
                        <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1z" stroke="white" strokeWidth="1.5" />
                            <path d="M5.5 8l2 2L11 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: "#111" }}>SafeSphere Protection</h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                            <span style={{ color: "#185FA5", fontSize: "14px", fontWeight: 500 }}>SafeSphere Official</span>
                            <span style={{ color: "#9ca3af", fontSize: "14px" }}>•</span>
                            <span style={{ color: "#6b7280", fontSize: "14px" }}>Productivity</span>
                            <span style={{ color: "#9ca3af", fontSize: "14px" }}>•</span>
                            <div style={{ display: "flex", color: "#F59E0B" }}>
                                ★★★★★ <span style={{ color: "#6b7280", marginLeft: "4px" }}>(1,240)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAddClick}
                    style={{
                        background: "#185FA5",
                        color: "white",
                        padding: "12px 32px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "15px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 6px -1px rgba(24, 95, 165, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#114B84"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#185FA5"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add to Chrome
                </button>
            </div>

            {/* Installation Flow */}
            {isInstalling && (
                <div style={{ 
                    background: "#E6F1FB", 
                    border: "1px solid #185FA5", 
                    borderRadius: "16px", 
                    padding: "24px", 
                    marginBottom: "2rem",
                    animation: "fadeIn 0.4s ease-out"
                }}>
                    <div style={{ display: "flex", alignItems: "start", gap: "16px" }}>
                        <div style={{ 
                            background: "#185FA5", 
                            color: "white", 
                            width: "28px", 
                            height: "28px", 
                            borderRadius: "50%", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            flexShrink: 0,
                            fontWeight: 700
                        }}>!</div>
                        <div>
                            <h3 style={{ margin: "0 0 8px 0", color: "#0C447C", fontSize: "16px" }}>Complete your installation</h3>
                            <p style={{ margin: "0 0 16px 0", color: "#185FA5", fontSize: "14px", lineHeight: "1.5" }}>
                                Since this is a specialized security tool, Chrome requires a 30-second manual verification for the Developer Build.
                            </p>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                                {[
                                    { step: 1, text: "Extract the downloaded ZIP folder" },
                                    { step: 2, text: "Go to chrome://extensions and enable 'Developer Mode'" },
                                    { step: 3, text: "Click 'Load unpacked' and select the folder" }
                                ].map(s => (
                                    <div key={s.step} style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid #c9e2f8" }}>
                                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", marginBottom: "4px" }}>STEP {s.step}</div>
                                        <div style={{ fontSize: "12px", color: "#111", lineHeight: "1.4" }}>{s.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Features Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                <FeatureCard 
                    title="Phishing Shield" 
                    desc="Real-time detection of malicious URLs using SafeSphere AI." 
                    icon="🛡️"
                />
                <FeatureCard 
                    title="Form Verifier" 
                    desc="Flags suspicious input fields and insecure data forms." 
                    icon="📝"
                />
                <FeatureCard 
                    title="Link Hover" 
                    desc="Preview risk scores for any link before you click." 
                    icon="🖱️"
                />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function FeatureCard({ title, desc, icon }) {
    return (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600 }}>{title}</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: "1.5" }}>{desc}</p>
        </div>
    );
}
