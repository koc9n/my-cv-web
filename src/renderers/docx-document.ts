import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageOrientation,
  Paragraph,
  TextRun,
} from "docx";
import { visibleSections, type Cv, type SectionId } from "@/domain/cv";

const heading = (text: string) =>
  new Paragraph({ text: text.toUpperCase(), heading: HeadingLevel.HEADING_1 });
const bullet = (text: string) =>
  new Paragraph({
    text,
    numbering: { reference: "cv-bullets", level: 0 },
    spacing: { after: 35, line: 245 },
  });
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
          children: [new TextRun({ text: j.role, bold: true, size: 21 })],
          keepNext: true,
          spacing: { before: 80, after: 10 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: j.employer, bold: true, color: "BB4D2E" }),
            new TextRun({
              text: ` | ${j.location} | ${j.start} - ${j.end}`,
              color: "5D6964",
            }),
          ],
          keepNext: true,
          spacing: { after: 30 },
        }),
        ...j.achievements.map((a) => bullet(a.text)),
        ...(j.technologies.length
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Stack: ",
                    bold: true,
                    size: 17,
                    color: "5D6964",
                  }),
                  new TextRun({
                    text: j.technologies.join(", "),
                    size: 17,
                    color: "5D6964",
                  }),
                ],
                spacing: { before: 15, after: 45 },
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
              new TextRun({
                text: `${l.language}${l.proficiency ? ": " : ""}`,
                bold: true,
              }),
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
    new Paragraph({
      text: cv.basics.name,
      heading: HeadingLevel.TITLE,
      spacing: { after: 30 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: cv.basics.headline, bold: true, size: 25 }),
      ],
      spacing: { after: 20 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${cv.basics.location} | ${cv.basics.availability}`,
          color: "5D6964",
        }),
      ],
      spacing: { after: 25 },
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
            spacing: { after: 20 },
          }),
      ),
  ];
  for (const section of visibleSections(cv))
    children.push(...sectionParagraphs(cv, section.id, section.label));
  return Packer.toBuffer(
    new Document({
      numbering: {
        config: [
          {
            reference: "cv-bullets",
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: "•",
                alignment: "left",
                style: {
                  paragraph: {
                    indent: { left: 320, hanging: 180 },
                  },
                },
              },
            ],
          },
        ],
      },
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 19, color: "17231F" },
            paragraph: { spacing: { after: 55, line: 250 } },
          },
        },
        paragraphStyles: [
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { font: "Arial", size: 38, bold: true, color: "17231F" },
            paragraph: { spacing: { after: 30 }, keepNext: true },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: { font: "Arial", size: 21, bold: true, color: "BB4D2E" },
            paragraph: {
              spacing: { before: 130, after: 55 },
              keepNext: true,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 11906,
                height: 16838,
                orientation: PageOrientation.PORTRAIT,
              },
              margin: {
                top: 720,
                right: 850,
                bottom: 720,
                left: 850,
                header: 360,
                footer: 360,
              },
            },
          },
          children,
        },
      ],
    }),
  );
}
