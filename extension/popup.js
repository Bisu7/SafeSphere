document.getElementById("scan-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const url = activeTab.url;

        const riskValue = document.getElementById("risk-value");
        const riskDetail = document.getElementById("risk-detail");

        riskValue.innerText = "Scanning...";
        riskValue.className = "card-value";

        chrome.runtime.sendMessage({ type: "analyze_url", url: url }, (response) => {
            if (response && !response.error) {
                const score = Math.round(response.score * 100);
                const verdict = response.verdict || "Unknown";
                
                riskValue.innerText = verdict;
                
                if (score > 70) {
                    riskValue.className = "card-value danger";
                    riskDetail.innerText = `High risk detected (${score}%). We recommend leaving this site.`;
                } else if (score > 40) {
                    riskValue.className = "card-value warning";
                    riskDetail.innerText = `Suspicious patterns found (${score}%). Be cautious.`;
                } else {
                    riskValue.className = "card-value success";
                    riskDetail.innerText = "This page looks safe. No major threats detected.";
                }
            } else {
                riskValue.innerText = "Error";
                riskDetail.innerText = "Unable to connect to SafeSphere backend.";
            }
        });
    });
});
