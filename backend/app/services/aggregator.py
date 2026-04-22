def aggregate_results(rule_result, llm_result):
    rule_score = rule_result.get("score", 0)
    llm_score = llm_result.get("score", 0)

    # Weighted scoring
    final_score = (rule_score * 0.4) + (llm_score * 0.6)

    # Risk classification
    if final_score > 0.75:
        risk = "Scam"
    elif final_score > 0.4:
        risk = "Suspicious"
    else:
        risk = "Safe"

    # Merge highlights
    highlights = list(set(
        rule_result.get("highlights", []) +
        llm_result.get("highlights", [])
    ))

    # Final response
    return {
        "risk": risk,
        "score": round(final_score, 2),
        "explanation": llm_result.get("explanation", ""),
        "highlights": highlights
    }