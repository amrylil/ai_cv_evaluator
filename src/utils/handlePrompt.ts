export const handlePrompt = (
  jdText: string,
  context: string,
  cvText: string
): string => {
  return `
You are evaluating a candidate for a specific job.

Job Description:
${jdText}

Retrieved Context (RAG):
${context}

Candidate CV:
${cvText}

Return ONLY a valid JSON object with the following fields:
{
  "cv_match_rate": number,
  "cv_feedback": string,
  "project_score": number,
  "project_feedback": string,
  "overall_summary": string
}
No explanations, no extra text, no markdown.
  `.trim();
};
