import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Cv } from "@/domain/cv";

const s = StyleSheet.create({ page:{padding:28,fontFamily:"Helvetica",fontSize:8.2,color:"#17231f",lineHeight:1.3}, header:{paddingBottom:8,borderBottom:"1 solid #d8d7cf"}, name:{fontSize:24,fontFamily:"Helvetica-Bold",lineHeight:1.15}, headline:{fontSize:12,marginTop:4}, muted:{color:"#5d6964"}, section:{marginTop:8}, title:{fontSize:11.5,fontFamily:"Helvetica-Bold",marginBottom:3,color:"#bb4d2e"}, row:{flexDirection:"row",justifyContent:"space-between",gap:8}, job:{marginBottom:5}, role:{fontFamily:"Helvetica-Bold",fontSize:9.5}, employer:{fontFamily:"Helvetica-Bold",color:"#bb4d2e"}, dates:{textAlign:"right",color:"#5d6964"}, bullet:{marginLeft:7,marginTop:1}, stack:{fontSize:7.3,color:"#5d6964",marginTop:2}, skill:{marginBottom:1}, link:{color:"#17231f",textDecoration:"underline",marginTop:2} });

export function CvPdf({ cv }: { cv: Cv }) {
  return <Document title={`${cv.basics.name} - CV`} author={cv.basics.name}><Page size="A4" style={s.page}>
    <View style={s.header}><Text style={s.name}>{cv.basics.name}</Text><Text style={s.headline}>{cv.basics.headline}</Text><Text style={s.muted}>{cv.basics.location} / {cv.basics.availability}</Text>{cv.basics.links.map(l=><Link key={l.url} src={l.url} style={s.link}>{l.label}: {l.url}</Link>)}</View>
    <View style={s.section}><Text style={s.title}>SUMMARY</Text><Text>{cv.summary}</Text></View>
    <View style={s.section}><Text style={s.title}>TECHNICAL SKILLS</Text>{cv.skills.map(g=><Text key={g.category} style={s.skill}><Text style={{fontFamily:"Helvetica-Bold"}}>{g.category}: </Text>{g.items.join(", ")}</Text>)}</View>
    <View style={s.section}><Text style={s.title}>PROFESSIONAL EXPERIENCE</Text>{cv.experience.map(j=><View key={`${j.employer}-${j.start}`} style={s.job} wrap={false}><View style={s.row}><View><Text style={s.role}>{j.role}</Text><Text style={s.employer}>{j.employer}</Text></View><Text style={s.dates}>{j.start} - {j.end}{"\n"}{j.location}</Text></View>{j.achievements.map(a=><Text key={a.text} style={s.bullet}>• {a.text}</Text>)}<Text style={s.stack}>Stack: {j.technologies.join(", ")}</Text></View>)}</View>
    <View style={s.section}><Text style={s.title}>KEY ACHIEVEMENTS</Text>{cv.achievements.map(a=><Text key={a.text} style={s.bullet}>• {a.text}</Text>)}</View>
    <View style={s.section}><Text style={s.title}>EDUCATION</Text>{cv.education.map(e=><View key={e.degree} style={s.row}><Text><Text style={{fontFamily:"Helvetica-Bold"}}>{e.degree}</Text>{"\n"}{e.institution}</Text><Text style={s.dates}>{e.period}</Text></View>)}</View>
  </Page></Document>;
}
