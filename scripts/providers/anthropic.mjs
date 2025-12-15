/**
 * Anthropic provider (Messages API).
 * Requires: ANTHROPIC_API_KEY
 */
export async function callAnthropic({ model, system, user, max_tokens = 1800, temperature = 0.2 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY in environment.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      max_tokens,
      temperature,
      system,
      messages: [{ role: "user", content: user }]
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${txt}`);
  }

  const data = await res.json();

  // data.content is typically [{type:'text', text:'...'}]
  const text = Array.isArray(data?.content)
    ? data.content.map((c) => c?.text || "").join("").trim()
    : (data?.text || JSON.stringify(data, null, 2));

  return text;
}
