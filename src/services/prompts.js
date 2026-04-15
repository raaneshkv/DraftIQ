export function buildAnalysisPrompt(document, domain, goal) {
  const domainWeights = {
    'Technical Report': 'Emphasize accuracy, completeness, and structure. Technical reports need precise language, clear methodology, and well-organized sections.',
    'Essay': 'Emphasize clarity, argument flow, thesis strength, and persuasiveness. Essays need strong introductions and conclusions.',
    'Research Paper': 'Emphasize methodology, citations, literature review, hypothesis, and reproducibility. Academic rigor is critical.',
    'Business Report': 'Emphasize executive summary, data-driven insights, actionable recommendations, and professional formatting.',
    'General': 'Balance all dimensions equally. Focus on readability, coherence, and completeness.',
  }

  const goalContext = goal ? `The author's primary goal is to: ${goal}. Tailor your feedback heavily towards achieving this goal.` : ''

  return `Analyze the following document as a ${domain} document.
Domain context: ${domainWeights[domain] || domainWeights['General']}
${goalContext}

DOCUMENT:
"""
${document}
"""

Analyze this document comprehensively and return a JSON object with EXACTLY this structure:

{
  "confidence": <number 0-100 indicating AI confidence in this analysis>,
  "documentType": "<detected type, e.g., Essay, Memo, Resume, Article>",
  "writingStyle": {
    "tone": "<e.g., Formal, Persuasive, Informal, Technical>",
    "feedback": "<brief feedback on the tone and if it suits the domain>"
  },
  "audienceAlignment": {
    "level": "<School | College | Professional | Research>",
    "feedback": "<e.g., 'Content is suitable for college-level but lacks depth for research audience'>",
    "features": ["<e.g. High vocabulary complexity>", "<e.g. Long sentence length>"]
  },
  "scores": {
    "clarity": <number 0-100>,
    "structure": <number 0-100>,
    "impact": <number 0-100>,
    "grammar": <number 0-100>,
    "vocabulary": <number 0-100>,
    "relevance": <number 0-100>
  },
  "humanFeedback": {
    "clarity": "<human-like conversational feedback explaining this specific score, e.g., 'Your argument lacks logical transitions...'>",
    "structure": "<human-like explanation>",
    "impact": "<human-like explanation>",
    "grammar": "<human-like explanation>",
    "vocabulary": "<human-like explanation>",
    "relevance": "<human-like explanation>"
  },
  "explainableAI": {
    "modelReasoning": "<A detailed explanation of why these scores were assigned overall based on the input text>",
    "confidenceFactors": "<What made the model confident or uncertain, e.g. 'High confidence due to clear structure and standard vocabulary'>"
  },
  "benchmarking": {
    "percentBetterThan": <number 1-99 estimating percentile compared to average documents of this type>,
    "category": "<e.g., similar academic essays>"
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
      "scoreImpactValue": <number representing positive impact if fixed, e.g. 5 or 8>,
      "rootCause": {
        "why": "<WHY this error happened (e.g. 'Missing transitions between paragraphs')>",
        "causedBy": "<WHAT caused it contextually (e.g. 'Rushing the logical leap from point A to B')>"
      },
      "correction": {
        "identify": "<what's wrong>",
        "suggest": "<what to add or change>"
      }
    }
  ],
  "beforeAfter": [
    {
      "before": "<original problematic text>",
      "after": "<improved version>",
      "explanation_why_better": "<Specifically explain why this rewrite is an improvement>"
    }
  ],
  "checklist": [
    {
      "item": "<checklist item>",
      "passed": <boolean true or false>
    }
  ],
  "learningProfile": {
    "weakArea": "<primary weak area>",
    "pattern": "<observed writing pattern, e.g., 'Frequent passive voice usage detected'>",
    "tip": "<actionable improvement tip>"
  },
  "improvedDocument": "<Return the COMPLETE uploaded document, fully rewritten and edited to exceptional quality, fixing all grammar issues, improving vocabulary, structure, and flow to match the specific domain and goal. Do NOT truncate or abbreviate.>"
}

Important rules:
1. Be thorough and identify ALL issues, not just obvious ones.
2. Provide at least 3-5 issues in the issues list. Rank issues by scoreImpactValue (highest impact first).
3. The humanFeedback should sound like a real mentor speaking directly to the user (use 'you', 'your'). 
4. The beforeAfter should show specific text improvements AND explain why it's better.
5. Return ONLY valid JSON, no markdown, no code blocks.`
}
