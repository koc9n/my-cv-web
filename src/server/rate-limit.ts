type Entry = { count: number; resetAt: number };
const globalStore = globalThis as unknown as {
  cvRateLimits?: Map<string, Entry>;
};
const store = globalStore.cvRateLimits ?? new Map<string, Entry>();
globalStore.cvRateLimits = store;

export function clientAddress(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
export function allowRequest(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  current.count += 1;
  if (store.size > 5000)
    for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}
