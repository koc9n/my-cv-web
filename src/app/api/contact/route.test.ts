import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";
import { contactSchema } from "@/server/contact-schema";
describe("contact endpoint", () => {
  it("rejects bot honeypot content", () =>
    expect(
      contactSchema.safeParse({
        name: "Valid Name",
        email: "valid@example.com",
        message: "A sufficiently long message",
        companyWebsite: "spam",
      }).success,
    ).toBe(false));
  it("fails safely when delivery is not configured", async () => {
    const form = new FormData();
    form.set("name", "Valid Name");
    form.set("email", "valid@example.com");
    form.set("message", "A sufficiently long message");
    form.set("companyWebsite", "");
    const response = await POST(
      new Request("http://test/api/contact", {
        method: "POST",
        body: form,
        headers: { "x-forwarded-for": `test-${Math.random()}` },
      }),
    );
    expect(response.status).toBe(503);
  });
});
