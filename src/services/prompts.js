export function buildAnalysisPrompt(document, domain, goal, scoringData) {
  const domainWeights = {
    'Technical Report': 'Emphasize accuracy, completeness, and structure. Technical reports need precise language, clear methodology, and well-organized sections.',
    'Essay': 'Emphasize clarity, argument flow, thesis strength, and persuasiveness. Essays need strong introductions and conclusions.',
    'Research Paper': 'Emphasize methodology, citations, literature review, hypothesis, and reproducibility. Academic rigor is critical.',
    'Business Report': 'Emphasize executive summary, data-driven insights, actionable recommendations, and professional formatting.',
    'General': 'Balance all dimensions equally. Focus on readability, coherence, and completeness.',
  }

  const goalContext = goal ? `The author's primary goal is to: ${goal}. Tailor your feedback heavily towards achieving this goal.` : ''

  const mathContext = scoringData ? `
CRITICAL CONTEXT FOR HUMAN FEEDBACK:
An objective offline mathematical algorithm has ALREADY safely evaluated this document. You MUST align your "humanFeedback" explanations EXACTLY with these brutal algorithm scores:
- Clarity Score: ${scoringData.clarity}/20
- Coherence Score: ${scoringData.coherence}/20
- Grammar Score: ${scoringData.grammar}/20
- Vocabulary Score: ${scoringData.vocabulary}/20
- Structure Score: ${scoringData.structure}/20

If a score is extremely low (e.g., < 10/20), your explanation inside the 'humanFeedback' object MUST jump straight into harsh, direct criticism identifying exactly why it failed structurally. Under no circumstances should you praise a text that scored poorly in these parameters.` : ''

  return `Analyze the following document as a ${domain} document.
Domain context: ${domainWeights[domain] || domainWeights['General']}
${goalContext}
${mathContext}

DOCUMENT:
"""
${document}
"""

MIXTURE OF EXPERTS RUBRIC INSTRUCTIONS:

1. SEMANTIC COHERENCE EXPERT:
- Evaluate sentence-to-sentence transitions. Penalize abrupt topic shifts and reward logical progression.
- Combine this insight into the "coherence" key of the "humanFeedback" block.

2. EXPERT WRITING COACH (SUGGESTIONS GENERATOR):
- Give ONLY specific, actionable suggestions.
- Avoid generic advice completely.
- Limit to the top 5 highest-impact improvements. Output these in the "issues" array.

Analyze this document using the expert rubrics above and return a JSON object with EXACTLY this structure:

{
  "confidence": <number 0-100 indicating AI confidence in this analysis>,
  "documentType": "<detected type, e.g., Essay, Memo, Resume, Article>",
  "writingStyle": {
    "tone": "<e.g., Formal, Persuasive, Informal, Technical>",
    "feedback": "<brief feedback on the tone and if it suits the domain>"
  },

  "humanFeedback": {
    "clarity": "<human-like conversational feedback explaining this specific dimension, e.g., 'Your argument lacks logical transitions...'>",
    "coherence": "<human-like explanation>",
    "grammar": "<human-like explanation>",
    "vocabulary": "<human-like explanation>",
    "structure": "<human-like explanation>"
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

  "improvedDocument": "[INSERT_REWRITTEN_TEXT]"
}

Important rules:
1. The issues array MUST contain exactly 3-5 specific, highly actionable items. Rank issues by scoreImpactValue (highest impact first).
2. For the "improvedDocument" key, you MUST replace "[INSERT_REWRITTEN_TEXT]" with the fully polished, rewritten version of the user's original text. DO NOT leave it empty.
3. ANTI-HALLUCINATION STRICT RULE: If the original text is extremely short, vague, or incomplete (e.g., "test", "hello"), DO NOT invent fake content, do NOT add dummy placeholders like "Topic A", and do NOT try to generate a full essay from it. ONLY revise the exact words the user provided.
4. The humanFeedback should sound like a real mentor speaking directly to the user (use 'you', 'your'). 
5. The beforeAfter should show specific text improvements AND explain why it's better.
6. Return ONLY valid JSON, no markdown, no code blocks.`
}

export function buildGrammarCorrectionPrompt(input_text) {
  return `You are a deterministic grammar correction engine.

STRICT RULES:
- Fix ONLY grammatical, punctuation, and syntax errors
- DO NOT change meaning, tone, or sentence structure unnecessarily
- DO NOT rewrite stylistically
- Preserve original wording as much as possible
- Each correction must correspond to a real error

TASK:
1. Provide corrected text
2. Count number of corrections
3. Maintain alignment with original text

Text:
"""
\${input_text}
"""

Output JSON ONLY containing exactly the following keys:
- "corrected_text": (string) You MUST output the fully corrected text here. If there are ZERO grammar errors, it MUST literally contain the exact original text. NEVER leave it empty.
- "num_errors": (number) The count of errors fixed.
- "error_density": (number) Float density of errors.
- "confidence": (number)

Do not use placeholders, and do not provide an empty string for corrected_text.`
}
