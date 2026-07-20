import { renderToBuffer } from "@react-pdf/renderer";
import { exportSource } from "@/server/export-source";
import { CvPdf } from "@/renderers/pdf-document";
import React from "react";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const { cv, draft } = await exportSource(request);
  const document = React.createElement(CvPdf, { cv }) as unknown as Parameters<
    typeof renderToBuffer
  >[0];
  const buffer = await renderToBuffer(document);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Kostiantyn-Mironchyk-CV${draft ? "-draft" : ""}.pdf`,
      "Cache-Control": draft ? "no-store" : "public, max-age=3600",
    },
  });
}
