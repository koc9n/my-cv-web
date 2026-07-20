import { describe, expect, it } from "vitest";
import { allowRequest } from "@/server/rate-limit";
describe("rate limiter", () => {
  it("limits within a window and resets", () => {
    const key = `test-${Math.random()}`;
    expect(allowRequest(key, 2, 1000, 0).allowed).toBe(true);
    expect(allowRequest(key, 2, 1000, 1).allowed).toBe(true);
    expect(allowRequest(key, 2, 1000, 2).allowed).toBe(false);
    expect(allowRequest(key, 2, 1000, 1001).allowed).toBe(true);
  });
});
