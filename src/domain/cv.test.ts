import { describe, expect, it } from "vitest";
import { defaultCv } from "@/data/default-cv";
import { validateCv, visibleSections } from "@/domain/cv";
describe("CV schema", () => {
  it("accepts the canonical CV", () =>
    expect(validateCv(defaultCv).basics.name).toBe("Kostiantyn Mironchyk"));
  it("rejects invalid URLs", () =>
    expect(() =>
      validateCv({
        ...defaultCv,
        basics: {
          ...defaultCv.basics,
          links: [{ label: "bad", url: "not a url" }],
        },
      }),
    ).toThrow());
  it("omits empty and hidden sections while preserving configured order", () => {
    const selected = [
      { id: "education" as const, label: "Study", visible: true },
      { id: "summary" as const, label: "Profile", visible: false },
      { id: "projects" as const, label: "Projects", visible: true },
    ];
    const remaining = defaultCv.sectionSettings.filter(
      (section) => !selected.some((item) => item.id === section.id),
    );
    const cv = validateCv({
      ...defaultCv,
      sectionSettings: [...selected, ...remaining],
    });
    const visible = visibleSections(cv).map((x) => x.id);
    expect(visible[0]).toBe("education");
    expect(visible).not.toContain("summary");
    expect(visible).not.toContain("projects");
  });
  it("upgrades stored version-one documents", () => {
    const legacy = { ...defaultCv, schemaVersion: 1 };
    delete (legacy as Partial<typeof defaultCv>).sectionSettings;
    expect(validateCv(legacy).schemaVersion).toBe(2);
  });
});
