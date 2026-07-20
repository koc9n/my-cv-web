import { beforeEach, describe, expect, it } from "vitest";
import { defaultCv } from "@/data/default-cv";
import { db } from "@/server/db";
import {
  ensureState,
  getAdminState,
  publishDraft,
  restoreRevision,
  saveDraft,
} from "@/server/cv-repository";

const databaseDescribe =
  process.env.RUN_DB_TESTS === "true" ? describe : describe.skip;
databaseDescribe("PostgreSQL CV lifecycle", () => {
  beforeEach(async () => {
    await db.cvRevision.deleteMany();
    await db.cvState.deleteMany();
  });
  it("persists a draft, publishes it, records revisions, and restores prior content", async () => {
    const initial = await ensureState();
    const changed = {
      ...defaultCv,
      summary: "Integration test draft summary.",
    };
    const version = await saveDraft(changed, initial.lockVersion);
    expect(version).toBe(initial.lockVersion + 1);
    await publishDraft();
    let state = await getAdminState();
    expect(state.published.summary).toBe(changed.summary);
    const previousPublication = state.revisions.find(
      (revision) => revision.reason === "Before publish",
    );
    expect(previousPublication).toBeDefined();
    await restoreRevision(previousPublication!.id);
    state = await getAdminState();
    expect(state.draft.summary).toBe(defaultCv.summary);
    expect(state.published.summary).toBe(changed.summary);
  });
});
