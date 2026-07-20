import type { Cv } from "@/domain/cv";

export function CvView({ cv }: { cv: Cv }) {
  return (
    <article className="cv" id="cv">
      <header className="hero">
        <p className="eyebrow">Senior software engineering</p>
        <h1>{cv.basics.name}</h1>
        <p className="headline">{cv.basics.headline}</p>
        <p className="meta">{cv.basics.location} <span aria-hidden="true">/</span> {cv.basics.availability}</p>
        <nav className="actions" aria-label="CV actions">
          <a className="button primary" href="#contact">Contact</a>
          <a className="button" href="/api/export/pdf">PDF</a>
          <a className="button" href="/api/export/docx">DOCX</a>
          {cv.basics.links.map((link) => <a className="text-link" key={link.url} href={link.url} rel="noreferrer" target="_blank">{link.label}</a>)}
        </nav>
      </header>

      <section aria-labelledby="summary"><h2 id="summary">Summary</h2><p className="lede">{cv.summary}</p></section>

      <section aria-labelledby="skills"><h2 id="skills">Technical skills</h2><div className="skill-grid">{cv.skills.map((group) => (
        <div key={group.category}><h3>{group.category}</h3><p>{group.items.join(" · ")}</p></div>
      ))}</div></section>

      <section aria-labelledby="experience"><h2 id="experience">Experience</h2><div className="timeline">{cv.experience.map((job) => (
        <article className="job" key={`${job.employer}-${job.start}`}>
          <div className="job-heading"><div><h3>{job.role}</h3><p className="employer">{job.employer}</p></div><p className="dates">{job.start} - {job.end}<br />{job.location}</p></div>
          <ul>{job.achievements.map((item) => <li key={item.text}>{item.text}</li>)}</ul>
          <p className="stack"><strong>Stack:</strong> {job.technologies.join(", ")}</p>
        </article>
      ))}</div></section>

      <section aria-labelledby="achievements"><h2 id="achievements">Key achievements</h2><ul>{cv.achievements.map((item) => <li key={item.text}>{item.text}</li>)}</ul></section>
      <section aria-labelledby="education"><h2 id="education">Education</h2>{cv.education.map((item) => <div className="education" key={item.degree}><h3>{item.degree}</h3><p>{item.institution} <span aria-hidden="true">·</span> {item.period}</p></div>)}</section>
    </article>
  );
}
