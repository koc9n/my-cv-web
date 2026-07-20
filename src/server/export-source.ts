import { getAdminState, getPublishedCv } from "@/server/cv-repository";
import { requireAdmin } from "@/server/require-admin";
export async function exportSource(request: Request) {
  const draft = new URL(request.url).searchParams.get("source") === "draft";
  if (draft) {
    await requireAdmin();
    return { cv: (await getAdminState()).draft, draft: true };
  }
  return { cv: await getPublishedCv(), draft: false };
}
