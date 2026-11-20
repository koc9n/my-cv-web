import {
  visibleAdditionalSections,
  visibleSections,
  type Cv,
  type SectionId,
} from "@/domain/cv";

function Section({ id, label, cv }: { id: SectionId; label: string; cv: Cv }) {
  const heading = (
    <h2 id={id} tabIndex={-1}>
      {label}
    </h2>
  );
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
              <h3>{job.role}</h3>
              <p className="job-meta">
                <span className="employer">{job.employer}</span>
                <span>{[job.start, job.end].filter(Boolean).join(" – ")}</span>
                {job.location && <span>{job.location}</span>}
              </p>
              {job.achievements.length > 0 && (
                <ul>
                  {job.achievements.map((item) => (
                    <li key={item.text}>{item.text}</li>
                  ))}
                </ul>
              )}
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
          {cv.languages.map((l, index) => (
            <li key={`${l.language}-${l.proficiency}-${index}`}>
              <strong>
                {l.language}
                {l.proficiency && ":"}
              </strong>{" "}
              {l.proficiency}
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
      {visibleAdditionalSections(cv).map((s) => (
        <section aria-labelledby={`additional-${s.id}`} key={s.id}>
          <h2 id={`additional-${s.id}`} tabIndex={-1}>
            {s.title}
          </h2>
          <ul>
            {s.items
              .filter((item) => item.trim())
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function CvView({ cv, preview = false }: { cv: Cv; preview?: boolean }) {
  const sections = visibleSections(cv);
  const sectionLinks = sections.flatMap((section) =>
    section.id === "additional"
      ? visibleAdditionalSections(cv).map((item) => ({
          id: `additional-${item.id}`,
          label: item.title,
        }))
      : [section],
  );
  const [firstName, ...restOfName] = cv.basics.name.trim().split(/\s+/);
  const remainingName = restOfName.join(" ");
  const profileLinks = cv.basics.links.filter((link) => link.url);

  return (
    <article className={preview ? "cv cv-preview" : "cv"}>
      <header className="hero">
        {!preview && <div className="hero-art" aria-hidden="true" />}
        <div className="hero-identity">
          <h1>
            {firstName}
            {remainingName && (
              <>
                {" "}
                <span>{remainingName}</span>
              </>
            )}
          </h1>
          <p className="headline">{cv.basics.headline}</p>
          <p className="hero-meta">
            {cv.basics.location && <span>{cv.basics.location}</span>}
            {cv.basics.availability && (
              <span className="availability">{cv.basics.availability}</span>
            )}
          </p>
          {!preview && profileLinks.length > 0 && (
            <ul className="print-profiles">
              {profileLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url}>
                    {link.label}: {link.url}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!preview && (
            <nav className="actions" aria-label="CV downloads">
              <a className="button primary" href="/api/export/pdf">
                <span className="download-icon" aria-hidden="true">
                  ↓
                </span>
                Download PDF
              </a>
              <a className="button" href="/api/export/docx">
                Download DOCX
              </a>
            </nav>
          )}
        </div>
      </header>
      <div className="cv-body">
        {!preview && sectionLinks.length > 0 && (
          <nav className="section-nav" aria-label="On this page">
            <p aria-hidden="true">On this page</p>
            <ul>
              {sectionLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        )}
        <div className="cv-sections">
          {sections.map(({ id, label }) => (
            <Section key={id} id={id} label={label} cv={cv} />
          ))}
        </div>
      </div>
    </article>
  );
}
