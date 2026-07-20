import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { visibleSections, type Cv, type SectionId } from "@/domain/cv";

const s = StyleSheet.create({
  page: {
    padding: 28,
    fontFamily: "Helvetica",
    fontSize: 8.2,
    color: "#17231f",
    lineHeight: 1.3,
  },
  header: { paddingBottom: 8, borderBottom: "1 solid #d8d7cf" },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", lineHeight: 1.15 },
  headline: { fontSize: 12, marginTop: 4 },
  muted: { color: "#5d6964" },
  section: { marginTop: 8 },
  title: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: "#bb4d2e",
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  job: { marginBottom: 5 },
  role: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  employer: { fontFamily: "Helvetica-Bold", color: "#bb4d2e" },
  dates: { textAlign: "right", color: "#5d6964" },
  bullet: { marginLeft: 7, marginTop: 1 },
  stack: { fontSize: 7.3, color: "#5d6964", marginTop: 2 },
  skill: { marginBottom: 1 },
  link: { color: "#17231f", textDecoration: "underline", marginTop: 2 },
});
const bold = { fontFamily: "Helvetica-Bold" };
const Title = ({ children }: { children: string }) => (
  <Text style={s.title}>{children.toUpperCase()}</Text>
);

function PdfSection({
  id,
  label,
  cv,
}: {
  id: SectionId;
  label: string;
  cv: Cv;
}) {
  if (id === "summary")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        <Text>{cv.summary}</Text>
      </View>
    );
  if (id === "skills")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.skills.map((g) => (
          <Text key={g.category} style={s.skill}>
            <Text style={bold}>{g.category}: </Text>
            {g.items.join(", ")}
          </Text>
        ))}
      </View>
    );
  if (id === "experience")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.experience.map((j) => (
          <View key={`${j.employer}-${j.start}`} style={s.job} wrap={false}>
            <View style={s.row}>
              <View>
                <Text style={s.role}>{j.role}</Text>
                <Text style={s.employer}>{j.employer}</Text>
              </View>
              <Text style={s.dates}>
                {j.start} - {j.end}
                {"\n"}
                {j.location}
              </Text>
            </View>
            {j.achievements.map((a) => (
              <Text key={a.text} style={s.bullet}>
                • {a.text}
              </Text>
            ))}
            {j.technologies.length > 0 && (
              <Text style={s.stack}>Stack: {j.technologies.join(", ")}</Text>
            )}
          </View>
        ))}
      </View>
    );
  if (id === "projects")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.projects.map((p) => (
          <View key={p.name} style={s.job} wrap={false}>
            <Text style={s.role}>{p.name}</Text>
            <Text>{p.description}</Text>
            {p.technologies.length > 0 && (
              <Text style={s.stack}>Stack: {p.technologies.join(", ")}</Text>
            )}
            {p.url && (
              <Link src={p.url} style={s.link}>
                {p.url}
              </Link>
            )}
          </View>
        ))}
      </View>
    );
  if (id === "education")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.education.map((e) => (
          <View key={e.degree} style={s.row} wrap={false}>
            <Text>
              <Text style={bold}>{e.degree}</Text>
              {"\n"}
              {e.institution}
            </Text>
            <Text style={s.dates}>{e.period}</Text>
          </View>
        ))}
      </View>
    );
  if (id === "certifications")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.certifications.map((c) => (
          <View key={`${c.name}-${c.issuer}`} style={s.row} wrap={false}>
            <Text>
              <Text style={bold}>{c.name}</Text>
              {"\n"}
              {c.issuer}
            </Text>
            <Text style={s.dates}>{c.year}</Text>
          </View>
        ))}
      </View>
    );
  if (id === "languages")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.languages.map((l) => (
          <Text key={l.language}>
            <Text style={bold}>{l.language}: </Text>
            {l.proficiency}
          </Text>
        ))}
      </View>
    );
  if (id === "achievements")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.achievements.map((a) => (
          <Text key={a.text} style={s.bullet}>
            • {a.text}
          </Text>
        ))}
      </View>
    );
  return (
    <View style={s.section}>
      {cv.additionalSections.map((x) => (
        <View key={x.id}>
          <Title>{x.title}</Title>
          {x.items.map((item) => (
            <Text key={item} style={s.bullet}>
              • {item}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function CvPdf({ cv }: { cv: Cv }) {
  return (
    <Document title={`${cv.basics.name} - CV`} author={cv.basics.name}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{cv.basics.name}</Text>
          <Text style={s.headline}>{cv.basics.headline}</Text>
          <Text style={s.muted}>
            {cv.basics.location} / {cv.basics.availability}
          </Text>
          {cv.basics.links
            .filter((l) => l.url)
            .map((l) => (
              <Link key={l.url} src={l.url} style={s.link}>
                {l.label}: {l.url}
              </Link>
            ))}
        </View>
        {visibleSections(cv).map((section) => (
          <PdfSection
            key={section.id}
            id={section.id}
            label={section.label}
            cv={cv}
          />
        ))}
      </Page>
    </Document>
  );
}
