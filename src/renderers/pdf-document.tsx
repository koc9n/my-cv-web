import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  visibleAdditionalSections,
  visibleSections,
  type Cv,
  type SectionId,
} from "@/domain/cv";

Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingRight: 36,
    paddingBottom: 32,
    paddingLeft: 36,
    fontFamily: "Helvetica",
    fontSize: 9.1,
    color: "#202027",
    lineHeight: 1.32,
  },
  header: { paddingBottom: 9, borderBottom: "0.75 solid #d4d2dc" },
  name: { fontSize: 23, fontFamily: "Helvetica-Bold", lineHeight: 1.08 },
  headline: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 3,
    marginBottom: 1,
  },
  muted: { color: "#484553" },
  section: { marginTop: 9 },
  title: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.65,
    marginBottom: 4,
    color: "#423462",
  },
  job: { marginBottom: 7 },
  role: { fontFamily: "Helvetica-Bold", fontSize: 9.7, lineHeight: 1.2 },
  jobMeta: { color: "#484553", marginTop: 1 },
  bullet: { marginLeft: 9, marginTop: 1.5 },
  stack: { fontSize: 7.5, color: "#484553", marginTop: 2.5 },
  skill: { marginBottom: 1.5 },
  link: {
    fontSize: 8,
    color: "#202027",
    textDecoration: "underline",
    marginTop: 2,
  },
});
const bold = { fontFamily: "Helvetica-Bold" };
const Title = ({ children }: { children: string }) => (
  <Text style={s.title} minPresenceAhead={16}>
    {children.toUpperCase()}
  </Text>
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
          <View key={`${j.employer}-${j.start}`} style={s.job}>
            <View
              wrap={false}
              minPresenceAhead={j.achievements.length ? 14 : 0}
            >
              <Text style={s.role}>{j.role}</Text>
              <Text style={s.jobMeta}>
                <Text style={bold}>{j.employer}</Text>
                {[[j.start, j.end].filter(Boolean).join(" - "), j.location]
                  .filter(Boolean)
                  .map((value) => ` · ${value}`)
                  .join("")}
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
          <View key={p.name} style={s.job}>
            <Text style={s.role} minPresenceAhead={14}>
              {p.name}
            </Text>
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
          <Text key={e.degree} wrap={false}>
            <Text style={bold}>{e.degree}</Text>
            {"\n"}
            {[e.institution, e.period].filter(Boolean).join(" · ")}
          </Text>
        ))}
      </View>
    );
  if (id === "certifications")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.certifications.map((c) => (
          <Text key={`${c.name}-${c.issuer}`} wrap={false}>
            <Text style={bold}>{c.name}</Text>
            {"\n"}
            {[c.issuer, c.year].filter(Boolean).join(" · ")}
          </Text>
        ))}
      </View>
    );
  if (id === "languages")
    return (
      <View style={s.section}>
        <Title>{label}</Title>
        {cv.languages.map((l, index) => (
          <Text key={`${l.language}-${l.proficiency}-${index}`}>
            <Text style={bold}>
              {l.language}
              {l.proficiency && ": "}
            </Text>
            {l.proficiency || ""}
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
      {visibleAdditionalSections(cv).map((x) => (
        <View key={x.id}>
          <Title>{x.title}</Title>
          {x.items
            .filter((item) => item.trim())
            .map((item) => (
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
            {[cv.basics.location, cv.basics.availability]
              .filter(Boolean)
              .join(" · ")}
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
