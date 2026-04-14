export function buildAnalysisPrompt(document, domain) {
  const domainWeights = {
    'Technical Report': 'Emphasize accuracy, completeness, and structure. Technical reports need precise language, clear methodology, and well-organized sections.',
    'Essay': 'Emphasize clarity, argument flow, thesis strength, and persuasiveness. Essays need strong introductions and conclusions.',
    'Research Paper': 'Emphasize methodology, citations, literature review, hypothesis, and reproducibility. Academic rigor is critical.',
    'Business Report': 'Emphasize executive summary, data-driven insights, actionable recommendations, and professional formatting.',
    'General': 'Balance all dimensions equally. Focus on readability, coherence, and completeness.',
  }

  return `Analyze the following document as a ${domain} document.
Domain context: ${domainWeights[domain] || domainWeights['General']}

DOCUMENT:
"""
${document}
"""

Analyze this document comprehensively and return a JSON object with EXACTLY this structure:

{
  "overallScore": <number 0-100>,
  "previousScore": null,
  "confidence": <number 0-100>,
  "scores": {
    "clarity": <number 0-100>,
    "structure": <number 0-100>,
    "completeness": <number 0-100>,
    "accuracy": <number 0-100>,
    "professionalQuality": <number 0-100>,
    "audienceAlignment": <number 0-100>
  },
  "sections": [
    {
      "name": "<section name like Title, Introduction, Body, Conclusion, etc.>",
      "status": "<PRESENT|WEAK|MISSING>",
      "details": "<brief explanation>"
    }
  ],
  "issues": [
    {
      "issue": "<description of the issue>",
      "severity": "<HIGH|MEDIUM|LOW>",
      "scoreImpact": "<e.g. -8% overall, -22% completeness>",
      "confidence": <number 0-100>,
      "correction": {
        "identify": "<what's wrong>",
        "explain": "<why it matters>",
        "reflect": "<question to think about>",
        "suggest": "<what to add or change>",
        "task": "<specific rewrite instruction>",
        "deadline": "Mark as resolved before next review"
      }
    }
  ],
  "beforeAfter": [
    {
      "before": "<original problematic text>",
      "after": "<improved version>",
      "reason": "<why this change was made>"
    }
  ],
  "checklist": [
    {
      "item": "<checklist item>",
      "passed": <true|false>
    }
  ],
  "learningProfile": {
    "weakArea": "<primary weak area>",
    "pattern": "<observed writing pattern>",
    "tip": "<actionable improvement tip>"
  },
  "improvedDocument": "<full improved version of the document>"
}

Important rules:
1. Be thorough and identify ALL issues, not just obvious ones.
2. Scores should be realistic and justified.
3. Provide at least 3-5 issues with detailed corrections.
4. The beforeAfter should show specific text improvements.
5. The checklist should cover: topic clarity, content clarity, required sections, accuracy, structure flow, major mistakes, professional quality.
6. Return ONLY valid JSON, no markdown, no code blocks.`
}
