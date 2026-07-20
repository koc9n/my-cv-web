import { getPublishedCv } from "@/server/cv-repository";
import { renderDocx } from "@/renderers/docx-document";
export const runtime = "nodejs";
export async function GET() { const buffer=await renderDocx(await getPublishedCv()); return new Response(new Uint8Array(buffer),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","Content-Disposition":"attachment; filename=Kostiantyn-Mironchyk-CV.docx","Cache-Control":"public, max-age=3600"}}); }
