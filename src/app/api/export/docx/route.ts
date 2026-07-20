import { exportSource } from "@/server/export-source";
import { renderDocx } from "@/renderers/docx-document";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const { cv, draft } = await exportSource(request);
  const buffer = await renderDocx(cv);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=Kostiantyn-Mironchyk-CV${draft ? "-draft" : ""}.docx`,
      "Cache-Control": draft ? "no-store" : "public, max-age=3600",
    },
  });
}
