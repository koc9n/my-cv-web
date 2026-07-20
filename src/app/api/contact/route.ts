import { contactSchema } from "@/server/contact-schema";
import { allowRequest, clientAddress } from "@/server/rate-limit";

export async function POST(request: Request) {
  const rate = allowRequest(
    `message:${clientAddress(request)}`,
    5,
    60 * 60 * 1000,
  );
  if (!rate.allowed)
    return Response.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)),
        },
      },
    );
  const parsed = contactSchema.safeParse(
    Object.fromEntries((await request.formData()).entries()),
  );
  if (!parsed.success)
    return Response.json({ error: "Invalid message" }, { status: 400 });
  const token = process.env.TELEGRAM_BOT_TOKEN,
    chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId)
    return Response.json(
      { error: "Contact delivery is not configured" },
      { status: 503 },
    );
  const { name, email, message } = parsed.data;
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `CV website message\nFrom: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    },
  );
  return response.ok
    ? Response.json({ ok: true })
    : Response.json({ error: "Delivery failed" }, { status: 502 });
}
