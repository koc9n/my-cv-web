// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { CvView } from "@/components/cv-view";
import { defaultCv } from "@/data/default-cv";

describe("public CV accessibility", () => {
  afterEach(cleanup);
  it("has no automatically detectable accessibility violations", async () => {
    document.documentElement.lang = "en";
    document.title = "Kostiantyn Mironchyk CV";
    render(
      <main>
        <CvView cv={defaultCv} />
      </main>,
    );
    const result = await axe.run(document, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
  it("uses one primary heading and conventional section headings", () => {
    const { container } = render(<CvView cv={defaultCv} />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(
      [...container.querySelectorAll("h2")].map((x) => x.textContent),
    ).toEqual(["Summary", "Experience", "Technical skills", "Education"]);
  });
  it("links to visible headings in configured order, including custom sections", () => {
    const cv = {
      ...defaultCv,
      sectionSettings: defaultCv.sectionSettings.map((section) => ({
        ...section,
        visible:
          section.id === "additional" ||
          (section.visible && section.id !== "skills"),
      })),
      additionalSections: [
        {
          id: "community",
          title: "Community",
          items: ["Organized an engineering meetup"],
        },
        { id: "empty", title: "Empty section", items: [" "] },
      ],
    };
    const { container } = render(<CvView cv={cv} />);
    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(nav)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") !== "#contact");
    expect(links.map((link) => link.textContent)).toEqual([
      "Summary",
      "Experience",
      "Education",
      "Community",
    ]);
    for (const link of links) {
      expect(
        container.querySelector(`h2${link.getAttribute("href")}`)?.textContent,
      ).toBe(link.textContent);
    }
    expect(screen.queryByText("Empty section")).toBeNull();
  });
});
