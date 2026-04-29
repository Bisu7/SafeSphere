const API_BASE = "http://localhost:8000";

chrome.runtime.onInstalled.addListener(() => {
    console.log("SafeSphere Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "analyze_url") {
        analyzeUrl(request.url, sendResponse);
        return true;
    }
    if (request.type === "analyze_form") {
        analyzeForm(request.data, sendResponse);
        return true;
    }
    if (request.type === "analyze_text") {
        analyzeText(request.content, sendResponse);
        return true;
    }
});

async function analyzeUrl(url, sendResponse) {
    try {
        const response = await fetch(`${API_BASE}/scan/url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        const result = await response.json();
        sendResponse(result);
    } catch (error) {
        sendResponse({ error: "Scan Failed" });
    }
}

async function analyzeForm(data, sendResponse) {
    try {
        const response = await fetch(`${API_BASE}/extension/analyze-form`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.risk_score > 0.5) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "SafeSphere Alert",
                message: `Suspicious form detected on ${data.domain}!`,
                priority: 2
            });
        }
        sendResponse(result);
    } catch (error) {
        sendResponse({ error: "Form Analysis Failed" });
    }
}

async function analyzeText(content, sendResponse) {
    try {
        const response = await fetch(`${API_BASE}/scan/text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: content })
        });
        const result = await response.json();
        sendResponse(result);
    } catch (error) {
        sendResponse({ error: "Text Analysis Failed" });
    }
}