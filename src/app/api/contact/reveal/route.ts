import { z } from "zod";
import { allowRequest, clientAddress } from "@/server/rate-limit";

const schema = z.object({ type: z.enum(["email", "telegram"]) });
export async function POST(request: Request) {
  const rate = allowRequest(
    `reveal:${clientAddress(request)}`,
    20,
    60 * 60 * 1000,
  );
  if (!rate.allowed)
    return Response.json({ error: "Too many requests" }, { status: 429 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json({ error: "Invalid contact type" }, { status: 400 });
  const value =
    parsed.data.type === "email"
      ? process.env.PUBLIC_CONTACT_EMAIL
      : process.env.PUBLIC_TELEGRAM_URL;
  if (!value)
    return Response.json(
      { error: "Contact option is not configured" },
      { status: 404 },
    );
  const href = parsed.data.type === "email" ? `mailto:${value}` : value;
  return Response.json(
    { href, label: parsed.data.type === "email" ? value : "Open Telegram" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
