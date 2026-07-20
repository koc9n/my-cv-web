import { visibleSections, type Cv, type SectionId } from "@/domain/cv";

function Section({ id, label, cv }: { id: SectionId; label: string; cv: Cv }) {
  const heading = <h2 id={id}>{label}</h2>;
  if (id === "summary")
    return (
      <section aria-labelledby={id}>
        {heading}
        <p className="lede">{cv.summary}</p>
      </section>
    );
  if (id === "skills")
    return (
      <section aria-labelledby={id}>
        {heading}
        <div className="skill-grid">
          {cv.skills.map((group) => (
            <div key={group.category}>
              <h3>{group.category}</h3>
              <p>{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    );
  if (id === "experience")
    return (
      <section aria-labelledby={id}>
        {heading}
        <div className="timeline">
          {cv.experience.map((job) => (
            <article className="job" key={`${job.employer}-${job.start}`}>
              <div className="job-heading">
                <div>
                  <h3>{job.role}</h3>
                  <p className="employer">{job.employer}</p>
                </div>
                <p className="dates">
                  {job.start} - {job.end}
                  <br />
                  {job.location}
                </p>
              </div>
              <ul>
                {job.achievements.map((item) => (
                  <li key={item.text}>{item.text}</li>
                ))}
              </ul>
              {job.technologies.length > 0 && (
                <p className="stack">
                  <strong>Stack:</strong> {job.technologies.join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  if (id === "projects")
    return (
      <section aria-labelledby={id}>
        {heading}
        {cv.projects.map((p) => (
          <article className="item" key={p.name}>
            <h3>
              {p.url ? (
                <a href={p.url} rel="noreferrer" target="_blank">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </h3>
            <p>{p.description}</p>
            {p.technologies.length > 0 && (
              <p className="stack">
                <strong>Stack:</strong> {p.technologies.join(", ")}
              </p>
            )}
          </article>
        ))}
      </section>
    );
  if (id === "education")
    return (
      <section aria-labelledby={id}>
        {heading}
        {cv.education.map((item) => (
          <div className="education" key={item.degree}>
            <h3>{item.degree}</h3>
            <p>
              {item.institution} <span aria-hidden="true">·</span> {item.period}
            </p>
          </div>
        ))}
      </section>
    );
  if (id === "certifications")
    return (
      <section aria-labelledby={id}>
        {heading}
        {cv.certifications.map((c) => (
          <article className="item" key={`${c.name}-${c.issuer}`}>
            <h3>
              {c.url ? (
                <a href={c.url} rel="noreferrer" target="_blank">
                  {c.name}
                </a>
              ) : (
                c.name
              )}
            </h3>
            <p>
              {c.issuer}
              {c.year && ` · ${c.year}`}
            </p>
          </article>
        ))}
      </section>
    );
  if (id === "languages")
    return (
      <section aria-labelledby={id}>
        {heading}
        <ul className="plain-list">
          {cv.languages.map((l) => (
            <li key={l.language}>
              <strong>{l.language}:</strong> {l.proficiency}
            </li>
          ))}
        </ul>
      </section>
    );
  if (id === "achievements")
    return (
      <section aria-labelledby={id}>
        {heading}
        <ul>
          {cv.achievements.map((item) => (
            <li key={item.text}>{item.text}</li>
          ))}
        </ul>
      </section>
    );
  return (
    <>
      {cv.additionalSections.map((s) => (
        <section aria-labelledby={`additional-${s.id}`} key={s.id}>
          <h2 id={`additional-${s.id}`}>{s.title}</h2>
          <ul>
            {s.items.filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function CvView({ cv, preview = false }: { cv: Cv; preview?: boolean }) {
  return (
    <article
      className={`cv${preview ? " cv-preview" : ""}`}
      id={preview ? undefined : "cv"}
    >
      <header className="hero">
        <p className="eyebrow">Senior software engineering</p>
        <h1>{cv.basics.name}</h1>
        <p className="headline">{cv.basics.headline}</p>
        <p className="meta">
          {cv.basics.location} <span aria-hidden="true">/</span>{" "}
          {cv.basics.availability}
        </p>
        {!preview && (
          <nav className="actions" aria-label="CV actions">
            <a className="button primary" href="#contact">
              Contact
            </a>
            <a className="button" href="/api/export/pdf">
              PDF
            </a>
            <a className="button" href="/api/export/docx">
              DOCX
            </a>
            {cv.basics.links
              .filter((link) => link.url)
              .map((link) => (
                <a
                  className="text-link"
                  key={link.url}
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
          </nav>
        )}
      </header>
      {visibleSections(cv).map((section) => (
        <Section
          key={section.id}
          id={section.id}
          label={section.label}
          cv={cv}
        />
      ))}
    </article>
  );
}
