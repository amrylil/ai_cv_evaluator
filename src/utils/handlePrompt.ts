export const handlePrompt = (
  jdText: string,
  context: string,
  cvText: string,
  projectText: string
): string => {
  return `
You are an AI evaluation engine. You MUST return ONLY valid JSON. 
No explanation. No markdown. No commentary. No backticks.

====================================
JOB DESCRIPTION
${jdText}

====================================
RETRIEVED KNOWLEDGE (RAG)
${context}

====================================
CANDIDATE CV
${cvText}

====================================
PROJECT REPORT
${projectText}

====================================
EVALUATION RULES
You must score using the standardized scoring rubric.

1) CV EVALUATION (Score each parameter 1–5)
- technical_skills: backend, APIs, databases, cloud, AI/LLM exposure.
- experience_level: years, project complexity.
- achievements: scale, impact, contributions.
- cultural_fit: communication, learning attitude.

Compute:
cv_match_rate = (technical_skills + experience_level + achievements + cultural_fit) / 20
Result must be a decimal between 0 and 1.

2) PROJECT EVALUATION (Score each parameter 1–5)
- correctness: meets requirements (prompting, chaining, RAG, error handling).
- code_quality: modularity, readability, structure.
- resilience: retries, fallback, long-running tasks.
- documentation: clarity of README, explanation of reasoning.
- creativity: bonus improvements.

Compute:
project_score = average of all 5 parameters (range 1–5).

3) OVERALL SUMMARY
Provide 3–5 sentences summarizing:
- strengths
- weaknesses
- hiring recommendation
- improvement suggestions

====================================
RETURN JSON ONLY WITH THIS EXACT STRUCTURE:

{
  "cv_match_rate": number,
  "cv_feedback": string,
  "project_score": number,
  "project_feedback": string,
  "overall_summary": string
}

Do NOT include scoring breakdown in the JSON. Summaries only.
`.trim();
};
