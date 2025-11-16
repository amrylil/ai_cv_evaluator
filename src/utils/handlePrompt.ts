export const handlePrompt = (
  jdText: string,
  context: string,
  cvText: string
): string => {
  return `
You are an AI evaluator. You MUST return valid JSON only.

Job Description:
${jdText}

Retrieved Context:
${context}

Candidate CV:
${cvText}

Your task:
Return ONLY a valid JSON object. 
- No explanation
- No commentary
- No markdown
- No backticks
- No surrounding text

The JSON format MUST be exactly:

{
  "cv_match_rate": number,
  "cv_feedback": string,
  "project_score": number,
  "project_feedback": string,
  "overall_summary": string
}
`.trim();
};
