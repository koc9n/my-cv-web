import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { visibleSections, type Cv, type SectionId } from "@/domain/cv";

const heading = (text: string) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_1 });
const bullet = (text: string) => new Paragraph({ text, bullet: { level: 0 } });
function sectionParagraphs(cv: Cv, id: SectionId, label: string): Paragraph[] {
  const out = [heading(label)];
  if (id === "summary") return [...out, new Paragraph(cv.summary)];
  if (id === "skills")
    return [
      ...out,
      ...cv.skills.map(
        (g) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${g.category}: `, bold: true }),
              new TextRun(g.items.join(", ")),
            ],
          }),
      ),
    ];
  if (id === "experience") {
    for (const j of cv.experience)
      out.push(
        new Paragraph({
          children: [new TextRun({ text: j.role, bold: true, size: 24 })],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: j.employer, bold: true }),
            new TextRun(` | ${j.location} | ${j.start} - ${j.end}`),
          ],
        }),
        ...j.achievements.map((a) => bullet(a.text)),
        ...(j.technologies.length
          ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "Stack: ", bold: true }),
                  new TextRun(j.technologies.join(", ")),
                ],
              }),
            ]
          : []),
      );
    return out;
  }
  if (id === "projects") {
    for (const p of cv.projects)
      out.push(
        new Paragraph({
          children: [new TextRun({ text: p.name, bold: true })],
        }),
        new Paragraph(p.description),
        ...(p.technologies.length
          ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "Stack: ", bold: true }),
                  new TextRun(p.technologies.join(", ")),
                ],
              }),
            ]
          : []),
        ...(p.url
          ? [
              new Paragraph({
                children: [
                  new ExternalHyperlink({
                    link: p.url,
                    children: [
                      new TextRun({ text: p.url, style: "Hyperlink" }),
                    ],
                  }),
                ],
              }),
            ]
          : []),
      );
    return out;
  }
  if (id === "education")
    return [
      ...out,
      ...cv.education.map(
        (e) =>
          new Paragraph({
            children: [
              new TextRun({ text: e.degree, bold: true }),
              new TextRun(` | ${e.institution} | ${e.period}`),
            ],
          }),
      ),
    ];
  if (id === "certifications")
    return [
      ...out,
      ...cv.certifications.map(
        (c) =>
          new Paragraph({
            children: [
              new TextRun({ text: c.name, bold: true }),
              new TextRun(` | ${c.issuer} | ${c.year}`),
            ],
          }),
      ),
    ];
  if (id === "languages")
    return [
      ...out,
      ...cv.languages.map(
        (l) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${l.language}: `, bold: true }),
              new TextRun(l.proficiency),
            ],
          }),
      ),
    ];
  if (id === "achievements")
    return [...out, ...cv.achievements.map((a) => bullet(a.text))];
  return cv.additionalSections.flatMap((s) => [
    heading(s.title),
    ...s.items.map(bullet),
  ]);
}

export async function renderDocx(cv: Cv): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ text: cv.basics.name, heading: HeadingLevel.TITLE }),
    new Paragraph({
      children: [
        new TextRun({ text: cv.basics.headline, bold: true, size: 28 }),
      ],
    }),
    new Paragraph({
      text: `${cv.basics.location} | ${cv.basics.availability}`,
    }),
    ...cv.basics.links
      .filter((l) => l.url)
      .map(
        (l) =>
          new Paragraph({
            children: [
              new ExternalHyperlink({
                link: l.url,
                children: [
                  new TextRun({
                    text: `${l.label}: ${l.url}`,
                    style: "Hyperlink",
                  }),
                ],
              }),
            ],
          }),
      ),
  ];
  for (const section of visibleSections(cv))
    children.push(...sectionParagraphs(cv, section.id, section.label));
  return Packer.toBuffer(
    new Document({
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 20 },
            paragraph: { spacing: { after: 80 } },
          },
        },
        paragraphStyles: [
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { font: "Arial", size: 40, bold: true, color: "17231F" },
            paragraph: { spacing: { after: 120 } },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { font: "Arial", size: 25, bold: true, color: "BB4D2E" },
            paragraph: { spacing: { before: 220, after: 100 }, keepNext: true },
          },
        ],
      },
      sections: [{ properties: {}, children }],
    }),
  );
}
