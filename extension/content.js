// Content Script for SafeSphere

console.log("SafeSphere Content Script Loaded");

// ─── Link Hover Analyzer ──────────────────────────────────────────────────

let tooltip = null;

function createTooltip() {
    tooltip = document.createElement("div");
    tooltip.id = "safesphere-tooltip";
    tooltip.style.cssText = `
        position: fixed;
        z-index: 1000000;
        padding: 12px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        color: #111;
        pointer-events: none;
        display: none;
        max-width: 250px;
    `;
    document.body.appendChild(tooltip);
}

createTooltip();

document.addEventListener("mouseover", async (e) => {
    const link = e.target.closest("a");
    if (link && link.href) {
        const url = link.href;
        if (url.startsWith("http")) {
            showTooltip(e.clientX, e.clientY, "Analyzing link...");
            
            chrome.runtime.sendMessage({ type: "analyze_url", url: url }, (response) => {
                if (response && !response.error) {
                    const score = Math.round(response.score * 100);
                    const verdict = response.verdict || "Unknown";
                    let color = "#639922"; // Safe
                    if (score > 40) color = "#BA7517"; // Suspicious
                    if (score > 70) color = "#E24B4A"; // Danger

                    tooltip.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 4px; color: ${color}">SafeSphere Scan: ${verdict}</div>
                        <div style="color: #6b7280; font-size: 11px; word-break: break-all;">${url}</div>
                        <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                            <div style="flex-grow: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${score}%; height: 100%; background: ${color}"></div>
                            </div>
                            <span style="font-weight: 500">${score}%</span>
                        </div>
                    `;
                } else {
                    tooltip.innerHTML = "Scan Failed";
                }
            });
        }
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a")) {
        tooltip.style.display = "none";
    }
});

function showTooltip(x, y, text) {
    tooltip.innerHTML = text;
    tooltip.style.display = "block";
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
}

// ─── Form Safety Checker ──────────────────────────────────────────────────

function checkForms() {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        const inputs = form.querySelectorAll("input");
        const fields = Array.from(inputs).map(i => i.name || i.placeholder || i.type);
        const data = {
            domain: window.location.hostname,
            fields: fields
        };

        chrome.runtime.sendMessage({ type: "analyze_form", data: data }, (response) => {
            if (response && response.risk_score > 0.5) {
                form.style.border = "3px solid #E24B4A";
                form.style.position = "relative";
                const warning = document.createElement("div");
                warning.innerText = "⚠️ SafeSphere: High Risk Form Detected";
                warning.style.cssText = `
                    background: #E24B4A;
                    color: white;
                    padding: 4px 8px;
                    font-size: 12px;
                    font-weight: bold;
                    position: absolute;
                    top: -25px;
                    left: 0;
                    border-radius: 4px;
                `;
                form.prepend(warning);
            }
        });
    });
}

// ─── Page Scanner ─────────────────────────────────────────────────────────

let lastScannedContent = "";

function scanPageContent() {
    const text = document.body.innerText.substring(0, 3000);
    
    // Skip if content hasn't changed
    if (text === lastScannedContent) return;
    lastScannedContent = text;

    chrome.runtime.sendMessage({ type: "analyze_text", content: text }, (response) => {
        if (response && response.score > 0.6) {
            console.log("SafeSphere: Suspicious page content detected", response);
            if (response.highlights) {
                response.highlights.forEach(phrase => {
                    highlightText(phrase);
                });
            }
        }
    });
}

function highlightText(text) {
    if (!text) return;
    const regex = new RegExp(`(${text})`, "gi");
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
        if (node.parentElement && node.parentElement.tagName !== "SCRIPT" && node.parentElement.tagName !== "STYLE") {
            const matches = node.nodeValue.match(regex);
            if (matches) {
                const span = document.createElement("span");
                span.innerHTML = node.nodeValue.replace(regex, '<mark style="background: #E24B4A; color: white; border-radius: 2px;">$1</mark>');
                node.replaceWith(span);
            }
        }
    });
}

// ─── Execution ────────────────────────────────────────────────────────────

setTimeout(() => {
    checkForms();
    scanPageContent();
}, 30000); // Wait 30s after load for background scan

// Background monitoring every 5 minutes (300,000 ms)
setInterval(() => {
    scanPageContent();
}, 300000);
