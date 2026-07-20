import { Document, ExternalHyperlink, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { Cv } from "@/domain/cv";

export async function renderDocx(cv: Cv): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ text: cv.basics.name, heading: HeadingLevel.TITLE }),
    new Paragraph({ children:[new TextRun({text:cv.basics.headline,bold:true,size:28})] }),
    new Paragraph({ text:`${cv.basics.location} | ${cv.basics.availability}` }),
    ...cv.basics.links.map(l=>new Paragraph({children:[new ExternalHyperlink({link:l.url,children:[new TextRun({text:`${l.label}: ${l.url}`,style:"Hyperlink"})]})]})),
    new Paragraph({ text:"Professional Summary", heading:HeadingLevel.HEADING_1 }), new Paragraph(cv.summary),
    new Paragraph({ text:"Technical Skills", heading:HeadingLevel.HEADING_1 }),
    ...cv.skills.map(g=>new Paragraph({children:[new TextRun({text:`${g.category}: `,bold:true}),new TextRun(g.items.join(", "))]})),
    new Paragraph({ text:"Professional Experience", heading:HeadingLevel.HEADING_1 }),
  ];
  for (const j of cv.experience) children.push(new Paragraph({children:[new TextRun({text:j.role,bold:true,size:24})]}),new Paragraph({children:[new TextRun({text:j.employer,bold:true}),new TextRun(` | ${j.location} | ${j.start} - ${j.end}`)]}),...j.achievements.map(a=>new Paragraph({text:a.text,bullet:{level:0}})),new Paragraph({children:[new TextRun({text:"Stack: ",bold:true}),new TextRun(j.technologies.join(", "))]}));
  children.push(new Paragraph({text:"Key Achievements",heading:HeadingLevel.HEADING_1}),...cv.achievements.map(a=>new Paragraph({text:a.text,bullet:{level:0}})),new Paragraph({text:"Education",heading:HeadingLevel.HEADING_1}),...cv.education.map(e=>new Paragraph({children:[new TextRun({text:e.degree,bold:true}),new TextRun(` | ${e.institution} | ${e.period}`)]})));
  return Packer.toBuffer(new Document({styles:{default:{document:{run:{font:"Arial",size:20},paragraph:{spacing:{after:80}}}},paragraphStyles:[{id:"Title",name:"Title",basedOn:"Normal",next:"Normal",quickFormat:true,run:{font:"Arial",size:40,bold:true,color:"17231F"},paragraph:{spacing:{after:120}}},{id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{font:"Arial",size:25,bold:true,color:"BB4D2E"},paragraph:{spacing:{before:220,after:100},keepNext:true}}]},sections:[{properties:{},children}]}));
}
