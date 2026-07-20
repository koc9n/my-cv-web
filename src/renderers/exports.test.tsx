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
    expect(text.indexOf("SUMMARY")).toBeLessThan(text.indexOf("EXPERIENCE"));
    expect(text.indexOf("EXPERIENCE")).toBeLessThan(
      text.indexOf("TECHNICAL SKILLS"),
    );
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
