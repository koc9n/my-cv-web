import { describe, expect, it } from "vitest";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { defaultCv } from "@/data/default-cv";
import { CvPdf } from "@/renderers/pdf-document";
import { renderDocx } from "@/renderers/docx-document";

describe("CV exports", () => {
  it("produces a selectable PDF in canonical section order", async () => {
    const document = React.createElement(CvPdf, {
      cv: defaultCv,
    }) as unknown as Parameters<typeof renderToBuffer>[0];
    const buffer = await renderToBuffer(document);
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const text = (await parser.getText()).text;
    await parser.destroy();
    expect(text).toContain("Kostiantyn Mironchyk");
    expect(text).toMatch(
      /Allianz Technology[^\n]*Oct 2018 - Nov 2025[^\n]*\s+• Engineered and maintained/,
    );
    expect(text.indexOf("SUMMARY")).toBeLessThan(text.indexOf("EXPERIENCE"));
    expect(text.indexOf("EXPERIENCE")).toBeLessThan(
      text.indexOf("TECHNICAL SKILLS"),
    );
  });
  it("retains achievements across pages for a long experience entry", async () => {
    const cv = {
      ...defaultCv,
      experience: [
        {
          ...defaultCv.experience[0],
          achievements: Array.from({ length: 80 }, (_, index) => ({
            text: `Achievement ${index + 1} in a long experience entry.`,
          })),
        },
      ],
    };
    const document = React.createElement(CvPdf, {
      cv,
    }) as unknown as Parameters<typeof renderToBuffer>[0];
    const parser = new PDFParse({
      data: new Uint8Array(await renderToBuffer(document)),
    });
    const result = await parser.getText();
    await parser.destroy();
    expect(result.total).toBeGreaterThan(1);
    expect(result.text.match(/in a long experience entry\./g)).toHaveLength(80);
    expect(result.text).toContain("Achievement 80");
    expect(result.text).toContain("EDUCATION");
  });
  it("produces an editable DOCX with the same core facts", async () => {
    const buffer = await renderDocx(defaultCv);
    const text = (await mammoth.extractRawText({ buffer })).value;
    for (const value of [
      "Kostiantyn Mironchyk",
      "Allianz Technology",
      "Bachelor's Degree in Computer Science",
    ])
      expect(text).toContain(value);
  });
});
