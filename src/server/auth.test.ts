import { describe, expect, it } from "vitest";
import { adminEnvironmentEnabled, isAllowedAdmin } from "@/server/auth";
describe("admin allowlist", () => {
  it("accepts only the verified configured email", () => {
    expect(
      isAllowedAdmin(
        { email: "Admin@Example.com", email_verified: true },
        "admin@example.com",
      ),
    ).toBe(true);
    expect(
      isAllowedAdmin(
        { email: "admin@example.com", email_verified: false },
        "admin@example.com",
      ),
    ).toBe(false);
    expect(
      isAllowedAdmin(
        { email: "other@example.com", email_verified: true },
        "admin@example.com",
      ),
    ).toBe(false);
  });
  it("fails closed without configuration", () =>
    expect(
      isAllowedAdmin(
        { email: "admin@example.com", email_verified: true },
        undefined,
      ),
    ).toBe(false));
  it("disables preview administration by default", () => {
    expect(adminEnvironmentEnabled("preview", undefined)).toBe(false);
    expect(adminEnvironmentEnabled("preview", "true")).toBe(true);
    expect(adminEnvironmentEnabled("production", undefined)).toBe(true);
  });
});
