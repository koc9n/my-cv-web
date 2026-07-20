import type { Cv } from "@/domain/cv";
import { validateCv } from "@/domain/cv";
import { defaultCv } from "@/data/default-cv";
import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";

const json = (cv: Cv) => cv as unknown as Prisma.InputJsonValue;
export async function ensureState() {
  return db.cvState.upsert({
    where: { id: "primary" },
    create: {
      id: "primary",
      draft: json(defaultCv),
      published: json(defaultCv),
    },
    update: {},
  });
}
export async function getPublishedCv(): Promise<Cv> {
  if (!process.env.DATABASE_URL) return defaultCv;
  try {
    return validateCv((await ensureState()).published);
  } catch {
    return defaultCv;
  }
}
export async function getAdminState() {
  const state = await ensureState();
  return {
    draft: validateCv(state.draft),
    published: validateCv(state.published),
    lockVersion: state.lockVersion,
    updatedAt: state.updatedAt,
    publishedAt: state.publishedAt,
    revisions: await db.cvRevision.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, reason: true, createdAt: true },
    }),
  };
}
export function shouldCreateSnapshot(last: Date | undefined, now = new Date()) {
  return !last || now.getTime() - last.getTime() >= 15 * 60 * 1000;
}
export async function saveDraft(cv: Cv, lockVersion: number) {
  const previous = await ensureState();
  const last = await db.cvRevision.findFirst({
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  const result = await db.cvState.updateMany({
    where: { id: "primary", lockVersion },
    data: { draft: json(cv), lockVersion: { increment: 1 } },
  });
  if (result.count !== 1) throw new Error("STALE_DRAFT");
  if (shouldCreateSnapshot(last?.createdAt))
    await db.cvRevision.create({
      data: {
        content: json(validateCv(previous.draft)),
        reason: "Autosave snapshot",
      },
    });
  const state = await db.cvState.findUniqueOrThrow({
    where: { id: "primary" },
  });
  return state.lockVersion;
}
export async function publishDraft() {
  const state = await ensureState();
  const cv = validateCv(state.draft);
  await db.$transaction([
    db.cvRevision.create({
      data: {
        content: json(validateCv(state.published)),
        reason: "Before publish",
      },
    }),
    db.cvState.update({
      where: { id: "primary" },
      data: {
        published: json(cv),
        publishedAt: new Date(),
        lockVersion: { increment: 1 },
      },
    }),
  ]);
}
export async function restoreRevision(id: string) {
  const revision = await db.cvRevision.findUniqueOrThrow({ where: { id } });
  const cv = validateCv(revision.content);
  const state = await ensureState();
  await db.$transaction([
    db.cvRevision.create({
      data: {
        content: json(validateCv(state.draft)),
        reason: "Before restore",
      },
    }),
    db.cvState.update({
      where: { id: "primary" },
      data: { draft: json(cv), lockVersion: { increment: 1 } },
    }),
  ]);
}
