import { ensureState, getPublishedCv } from "@/server/cv-repository";
import { validateCv } from "@/domain/cv";
import { requireAdmin } from "@/server/require-admin";
export async function exportSource(request: Request) {
  const draft = new URL(request.url).searchParams.get("source") === "draft";
  if (draft) {
    await requireAdmin();
    return { cv: validateCv((await ensureState()).draft), draft: true };
  }
  return { cv: await getPublishedCv(), draft: false };
}
