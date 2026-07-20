// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
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
    ).toEqual([
      "Summary",
      "Technical skills",
      "Experience",
      "Key achievements",
      "Education",
    ]);
  });
});
