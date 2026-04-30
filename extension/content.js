// Content Script for SafeSphere

console.log("SafeSphere Content Script Loaded");

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
