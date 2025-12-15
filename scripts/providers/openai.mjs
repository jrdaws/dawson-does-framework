/**
 * OpenAI provider (Responses API style payload, but kept minimal and resilient).
 * Requires: OPENAI_API_KEY
 */
export async function callOpenAI({ model, system, user, temperature = 0.2 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY in environment.");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      // Keep it simple: system + user in input. If your account/model needs different format,
      // you can adjust here without touching orchestrate.mjs.
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${txt}`);
  }

  const data = await res.json();

  // Try common shapes; fall back to stringifying.
  // Newer Responses API often returns output[]; we extract text safely.
  const text =
    extractTextFromResponses(data) ||
    data.output_text ||
    data.text ||
    JSON.stringify(data, null, 2);

  return text;
}

function extractTextFromResponses(data) {
  try {
    const out = data.output;
    if (!Array.isArray(out)) return null;
    let acc = "";
    for (const item of out) {
      // item.content might be array with {type:'output_text', text:'...'}
      const content = item?.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          if (typeof c?.text === "string") acc += c.text;
        }
      }
    }
    return acc.trim() ? acc : null;
  } catch {
    return null;
  }
}
