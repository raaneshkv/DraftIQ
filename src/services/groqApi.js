const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen/qwen3-32b'

export async function analyzeDocument(providedKey, documentText, domain, prompt, retries = 1) {
  // Use the environment variable containing the developer's API key
  // This ensures the end-user never has to enter a key.
  const apiKey = providedKey || import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is missing from your .env file! Please add it to use the live API.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are DraftIQ, an expert document review AI. You analyze documents and return structured JSON feedback. Always respond with valid JSON only, no markdown formatting, no code blocks. The response must be parseable by JSON.parse().`
        },
        {
          role: 'user',
          content: prompt || `Analyze this text for domain: ${domain}. Text: ${documentText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    if (response.status === 429 && retries > 0) {
      console.warn('Groq Rate Limit hit (429). Stalling for 6.5 seconds to bypass Tokens-Per-Minute queue...')
      await new Promise(r => setTimeout(r, 6500))
      return analyzeDocument(providedKey, documentText, domain, prompt, retries - 1)
    }
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) throw new Error('Empty response from Groq API')

  try {
    return JSON.parse(content)
  } catch {
    throw new Error('Failed to parse AI response as JSON')
  }
}

