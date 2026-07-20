import { renderToBuffer } from "@react-pdf/renderer";
import { getPublishedCv } from "@/server/cv-repository";
import { CvPdf } from "@/renderers/pdf-document";
import React from "react";

export const runtime = "nodejs";
export async function GET() {
  const cv=await getPublishedCv();
  const document = React.createElement(CvPdf, { cv }) as unknown as Parameters<typeof renderToBuffer>[0];
  const buffer = await renderToBuffer(document);
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=Kostiantyn-Mironchyk-CV.pdf", "Cache-Control": "public, max-age=3600" } });
}
