/**
 * Models wrap JSON in prose or code fences often enough that a plain JSON.parse
 * is not a reliable contract. Returns null instead of throwing.
 */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return null

  const candidates = [trimmed, stripCodeFence(trimmed), sliceOutermostObject(trimmed)]

  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      return JSON.parse(candidate)
    } catch {
      continue
    }
  }

  return null
}

function stripCodeFence(input: string): string | null {
  const match = input.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  return match ? match[1] : null
}

function sliceOutermostObject(input: string): string | null {
  const start = input.indexOf('{')
  const end = input.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  return input.slice(start, end + 1)
}
