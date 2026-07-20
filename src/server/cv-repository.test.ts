import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultCv } from "@/data/default-cv";

const mocks = vi.hoisted(() => ({
  upsert: vi.fn(),
  findFirst: vi.fn(),
  updateMany: vi.fn(),
  create: vi.fn(),
  findUniqueOrThrow: vi.fn(),
  update: vi.fn(),
  findUnique: vi.fn(),
  findMany: vi.fn(),
  transaction: vi.fn(),
}));
vi.mock("@/server/db", () => ({
  db: {
    cvState: {
      upsert: mocks.upsert,
      updateMany: mocks.updateMany,
      findUniqueOrThrow: mocks.findUniqueOrThrow,
      update: mocks.update,
    },
    cvRevision: {
      findFirst: mocks.findFirst,
      create: mocks.create,
      findUniqueOrThrow: mocks.findUnique,
      findMany: mocks.findMany,
    },
    $transaction: mocks.transaction,
  },
}));
import {
  publishDraft,
  restoreRevision,
  saveDraft,
  shouldCreateSnapshot,
} from "@/server/cv-repository";

describe("CV lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.upsert.mockResolvedValue({
      id: "primary",
      draft: defaultCv,
      published: defaultCv,
      lockVersion: 3,
    });
    mocks.findFirst.mockResolvedValue(null);
    mocks.findUniqueOrThrow.mockResolvedValue({ lockVersion: 4 });
    mocks.create.mockResolvedValue({});
    mocks.transaction.mockResolvedValue([]);
  });
  it("creates the first snapshot and throttles later snapshots", () => {
    expect(shouldCreateSnapshot(undefined, new Date(0))).toBe(true);
    const last = new Date(0);
    expect(shouldCreateSnapshot(last, new Date(14 * 60 * 1000))).toBe(false);
    expect(shouldCreateSnapshot(last, new Date(15 * 60 * 1000))).toBe(true);
  });
  it("saves with optimistic concurrency and snapshots the previous draft", async () => {
    mocks.updateMany.mockResolvedValue({ count: 1 });
    await expect(saveDraft(defaultCv, 3)).resolves.toBe(4);
    expect(mocks.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "primary", lockVersion: 3 } }),
    );
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ reason: "Autosave snapshot" }),
      }),
    );
  });
  it("rejects a stale draft without creating a revision", async () => {
    mocks.updateMany.mockResolvedValue({ count: 0 });
    await expect(saveDraft(defaultCv, 2)).rejects.toThrow("STALE_DRAFT");
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("publishes and restores through atomic transactions", async () => {
    mocks.update.mockReturnValue("update-operation");
    mocks.create.mockReturnValue("revision-operation");
    await publishDraft();
    expect(mocks.transaction).toHaveBeenCalledWith([
      "revision-operation",
      "update-operation",
    ]);
    mocks.findUnique.mockResolvedValue({ content: defaultCv });
    await restoreRevision("revision-id");
    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { id: "revision-id" },
    });
    expect(mocks.transaction).toHaveBeenCalledTimes(2);
  });
});
