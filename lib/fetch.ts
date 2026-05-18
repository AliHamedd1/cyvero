export async function safeReadJson<T>(response: Response) {
  const fallback = {} as T;

  try {
    const text = await response.text();

    if (!text.trim()) {
      return fallback;
    }

    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function readApiPayload<T extends { error?: string }>(
  response: Response,
  fallbackError: string,
) {
  const payload = await safeReadJson<T>(response);

  if (!response.ok) {
    throw new Error(payload.error || fallbackError);
  }

  return payload;
}
