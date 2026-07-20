"use client";
import { useEffect, useRef, useState } from "react";
import { CvView } from "@/components/cv-view";
import type { Cv } from "@/domain/cv";

type Revision = { id: string; reason: string; createdAt: string };
const move = <T,>(items: T[], from: number, to: number) => {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};
const csv = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
function RowActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (to: number) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="row-actions">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => onMove(index + 1)}
      >
        ↓
      </button>
      {onRemove && (
        <button type="button" className="danger" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export function AdminEditor({
  initialCv,
  initialVersion,
  revisions,
}: {
  initialCv: Cv;
  initialVersion: number;
  revisions: Revision[];
}) {
  const [cv, setCv] = useState(initialCv),
    [status, setStatus] = useState("Saved"),
    [tab, setTab] = useState<"edit" | "preview">("edit"),
    first = useRef(true),
    request = useRef(0),
    versionRef = useRef(initialVersion);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("Unsaved changes");
    const snapshot = ++request.current;
    const timer = setTimeout(async () => {
      setStatus("Saving...");
      const r = await fetch("/api/admin/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, lockVersion: versionRef.current }),
      });
      const body = await r.json();
      if (snapshot !== request.current) return;
      if (r.ok) {
        versionRef.current = body.lockVersion;
        setStatus("Saved");
      } else setStatus(body.error ?? "Save failed");
    }, 900);
    return () => clearTimeout(timer);
  }, [cv]);
  const basics = (key: keyof Cv["basics"], value: unknown) =>
    setCv((c) => ({ ...c, basics: { ...c.basics, [key]: value } }));
  const publish = async () => {
    if (!confirm("Publish the current saved draft?")) return;
    const r = await fetch("/api/admin/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    if (r.ok) location.reload();
    else setStatus("Publish failed");
  };
  const restore = async (id: string) => {
    if (!confirm("Restore this revision into the draft?")) return;
    const r = await fetch("/api/admin/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", id }),
    });
    if (r.ok) location.reload();
    else setStatus("Restore failed");
  };
  return (
    <>
      <div className="editor-toolbar">
        <div className="tabs">
          <button
            className={tab === "edit" ? "active" : ""}
            onClick={() => setTab("edit")}
          >
            Edit
          </button>
          <button
            className={tab === "preview" ? "active" : ""}
            onClick={() => setTab("preview")}
          >
            Live preview
          </button>
        </div>
        <div className="draft-exports">
          <a href="/api/export/pdf?source=draft">Draft PDF</a>
          <a href="/api/export/docx?source=draft">Draft DOCX</a>
        </div>
        <span role="status">{status}</span>
        <button
          className="button primary"
          onClick={publish}
          disabled={status !== "Saved"}
        >
          Publish
        </button>
      </div>
      {tab === "preview" ? (
        <CvView cv={cv} preview />
      ) : (
        <div className="editor-layout">
          <div className="editor">
            <fieldset>
              <legend>Identity</legend>
              {(["name", "headline", "location", "availability"] as const).map(
                (k) => (
                  <label key={k}>
                    {k[0].toUpperCase() + k.slice(1)}
                    <input
                      value={cv.basics[k]}
                      onChange={(e) => basics(k, e.target.value)}
                    />
                  </label>
                ),
              )}
              <label>Links</label>
              {cv.basics.links.map((l, i) => (
                <div className="field-row" key={i}>
                  <input
                    aria-label="Link label"
                    value={l.label}
                    onChange={(e) =>
                      basics(
                        "links",
                        cv.basics.links.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <input
                    aria-label="Link URL"
                    type="url"
                    value={l.url}
                    onChange={(e) =>
                      basics(
                        "links",
                        cv.basics.links.map((x, n) =>
                          n === i ? { ...x, url: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <RowActions
                    index={i}
                    length={cv.basics.links.length}
                    onMove={(to) =>
                      basics("links", move(cv.basics.links, i, to))
                    }
                    onRemove={() =>
                      basics(
                        "links",
                        cv.basics.links.filter((_, n) => n !== i),
                      )
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  basics("links", [
                    ...cv.basics.links,
                    { label: "Portfolio", url: "" },
                  ])
                }
              >
                Add link
              </button>
            </fieldset>
            <fieldset>
              <legend>Section order and visibility</legend>
              {cv.sectionSettings.map((s, i) => (
                <div className="section-control" key={s.id}>
                  <input
                    aria-label={`${s.id} label`}
                    value={s.label}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        sectionSettings: c.sectionSettings.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={s.visible}
                      onChange={(e) =>
                        setCv((c) => ({
                          ...c,
                          sectionSettings: c.sectionSettings.map((x, n) =>
                            n === i ? { ...x, visible: e.target.checked } : x,
                          ),
                        }))
                      }
                    />{" "}
                    Visible
                  </label>
                  <RowActions
                    index={i}
                    length={cv.sectionSettings.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        sectionSettings: move(c.sectionSettings, i, to),
                      }))
                    }
                  />
                </div>
              ))}
            </fieldset>
            <fieldset>
              <legend>Summary</legend>
              <textarea
                rows={7}
                value={cv.summary}
                onChange={(e) =>
                  setCv((c) => ({ ...c, summary: e.target.value }))
                }
              />
            </fieldset>
            <fieldset>
              <legend>Skills</legend>
              {cv.skills.map((g, i) => (
                <div className="editor-item" key={i}>
                  <div className="field-row">
                    <input
                      aria-label="Skill category"
                      value={g.category}
                      onChange={(e) =>
                        setCv((c) => ({
                          ...c,
                          skills: c.skills.map((x, n) =>
                            n === i ? { ...x, category: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <textarea
                      aria-label={`${g.category} skills`}
                      rows={2}
                      value={g.items.join(", ")}
                      onChange={(e) =>
                        setCv((c) => ({
                          ...c,
                          skills: c.skills.map((x, n) =>
                            n === i ? { ...x, items: csv(e.target.value) } : x,
                          ),
                        }))
                      }
                    />
                  </div>
                  <RowActions
                    index={i}
                    length={cv.skills.length}
                    onMove={(to) =>
                      setCv((c) => ({ ...c, skills: move(c.skills, i, to) }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        skills: c.skills.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    skills: [
                      ...c.skills,
                      { category: "New category", items: [] },
                    ],
                  }))
                }
              >
                Add skill group
              </button>
            </fieldset>
            <fieldset>
              <legend>Experience</legend>
              {cv.experience.map((job, i) => (
                <div className="editor-item" key={i}>
                  <div className="field-grid">
                    {(
                      ["role", "employer", "location", "start", "end"] as const
                    ).map((k) => (
                      <label key={k}>
                        {k}
                        <input
                          value={job[k]}
                          onChange={(e) =>
                            setCv((c) => ({
                              ...c,
                              experience: c.experience.map((x, n) =>
                                n === i ? { ...x, [k]: e.target.value } : x,
                              ),
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <label>
                    Technologies
                    <input
                      value={job.technologies.join(", ")}
                      onChange={(e) =>
                        setCv((c) => ({
                          ...c,
                          experience: c.experience.map((x, n) =>
                            n === i
                              ? { ...x, technologies: csv(e.target.value) }
                              : x,
                          ),
                        }))
                      }
                    />
                  </label>
                  {job.achievements.map((a, j) => (
                    <div className="field-row" key={j}>
                      <textarea
                        aria-label={`Achievement ${j + 1}`}
                        rows={2}
                        value={a.text}
                        onChange={(e) =>
                          setCv((c) => ({
                            ...c,
                            experience: c.experience.map((x, n) =>
                              n === i
                                ? {
                                    ...x,
                                    achievements: x.achievements.map((y, m) =>
                                      m === j ? { text: e.target.value } : y,
                                    ),
                                  }
                                : x,
                            ),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          setCv((c) => ({
                            ...c,
                            experience: c.experience.map((x, n) =>
                              n === i
                                ? {
                                    ...x,
                                    achievements: x.achievements.filter(
                                      (_, m) => m !== j,
                                    ),
                                  }
                                : x,
                            ),
                          }))
                        }
                      >
                        Remove bullet
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setCv((c) => ({
                        ...c,
                        experience: c.experience.map((x, n) =>
                          n === i
                            ? {
                                ...x,
                                achievements: [
                                  ...x.achievements,
                                  { text: "New achievement" },
                                ],
                              }
                            : x,
                        ),
                      }))
                    }
                  >
                    Add achievement
                  </button>
                  <RowActions
                    index={i}
                    length={cv.experience.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        experience: move(c.experience, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        experience: c.experience.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    experience: [
                      ...c.experience,
                      {
                        role: "New role",
                        employer: "Employer",
                        location: "",
                        start: "",
                        end: "Present",
                        achievements: [],
                        technologies: [],
                      },
                    ],
                  }))
                }
              >
                Add role
              </button>
            </fieldset>
            <fieldset>
              <legend>Projects</legend>
              {cv.projects.map((p, i) => (
                <div className="editor-item" key={i}>
                  <input
                    aria-label="Project name"
                    value={p.name}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        projects: c.projects.map((x, n) =>
                          n === i ? { ...x, name: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <textarea
                    aria-label="Project description"
                    value={p.description}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        projects: c.projects.map((x, n) =>
                          n === i ? { ...x, description: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <input
                    aria-label="Project technologies"
                    placeholder="Technologies, comma separated"
                    value={p.technologies.join(", ")}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        projects: c.projects.map((x, n) =>
                          n === i
                            ? { ...x, technologies: csv(e.target.value) }
                            : x,
                        ),
                      }))
                    }
                  />
                  <input
                    aria-label="Project URL"
                    type="url"
                    value={p.url ?? ""}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        projects: c.projects.map((x, n) =>
                          n === i ? { ...x, url: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <RowActions
                    index={i}
                    length={cv.projects.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        projects: move(c.projects, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        projects: c.projects.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    projects: [
                      ...c.projects,
                      {
                        name: "New project",
                        description: "",
                        technologies: [],
                        url: "",
                      },
                    ],
                  }))
                }
              >
                Add project
              </button>
            </fieldset>
            <fieldset>
              <legend>Education</legend>
              {cv.education.map((e, i) => (
                <div className="editor-item" key={i}>
                  <div className="field-grid">
                    {(["degree", "institution", "period"] as const).map((k) => (
                      <label key={k}>
                        {k}
                        <input
                          value={e[k]}
                          onChange={(ev) =>
                            setCv((c) => ({
                              ...c,
                              education: c.education.map((x, n) =>
                                n === i ? { ...x, [k]: ev.target.value } : x,
                              ),
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <RowActions
                    index={i}
                    length={cv.education.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        education: move(c.education, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        education: c.education.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    education: [
                      ...c.education,
                      {
                        degree: "Degree",
                        institution: "Institution",
                        period: "",
                      },
                    ],
                  }))
                }
              >
                Add education
              </button>
            </fieldset>
            <fieldset>
              <legend>Certifications</legend>
              {cv.certifications.map((cert, i) => (
                <div className="editor-item" key={i}>
                  <div className="field-grid">
                    {(["name", "issuer", "year", "url"] as const).map((k) => (
                      <label key={k}>
                        {k}
                        <input
                          value={cert[k] ?? ""}
                          onChange={(e) =>
                            setCv((c) => ({
                              ...c,
                              certifications: c.certifications.map((x, n) =>
                                n === i ? { ...x, [k]: e.target.value } : x,
                              ),
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <RowActions
                    index={i}
                    length={cv.certifications.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        certifications: move(c.certifications, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        certifications: c.certifications.filter(
                          (_, n) => n !== i,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    certifications: [
                      ...c.certifications,
                      { name: "Certification", issuer: "", year: "", url: "" },
                    ],
                  }))
                }
              >
                Add certification
              </button>
            </fieldset>
            <fieldset>
              <legend>Languages</legend>
              {cv.languages.map((l, i) => (
                <div className="field-row" key={i}>
                  <input
                    aria-label="Language"
                    value={l.language}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        languages: c.languages.map((x, n) =>
                          n === i ? { ...x, language: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <input
                    aria-label="Proficiency"
                    value={l.proficiency}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        languages: c.languages.map((x, n) =>
                          n === i ? { ...x, proficiency: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <RowActions
                    index={i}
                    length={cv.languages.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        languages: move(c.languages, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        languages: c.languages.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    languages: [
                      ...c.languages,
                      { language: "Language", proficiency: "" },
                    ],
                  }))
                }
              >
                Add language
              </button>
            </fieldset>
            <fieldset>
              <legend>Key achievements</legend>
              {cv.achievements.map((a, i) => (
                <div className="field-row" key={i}>
                  <textarea
                    value={a.text}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        achievements: c.achievements.map((x, n) =>
                          n === i ? { text: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <RowActions
                    index={i}
                    length={cv.achievements.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        achievements: move(c.achievements, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        achievements: c.achievements.filter((_, n) => n !== i),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    achievements: [
                      ...c.achievements,
                      { text: "New achievement" },
                    ],
                  }))
                }
              >
                Add achievement
              </button>
            </fieldset>
            <fieldset>
              <legend>Additional sections</legend>
              {cv.additionalSections.map((s, i) => (
                <div className="editor-item" key={s.id}>
                  <input
                    aria-label="Section title"
                    value={s.title}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        additionalSections: c.additionalSections.map((x, n) =>
                          n === i ? { ...x, title: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <textarea
                    aria-label="Section items"
                    rows={4}
                    value={s.items.join("\n")}
                    onChange={(e) =>
                      setCv((c) => ({
                        ...c,
                        additionalSections: c.additionalSections.map((x, n) =>
                          n === i
                            ? {
                                ...x,
                                items: e.target.value
                                  .split("\n")
                                  .map((v) => v.trim())
                                  .filter(Boolean),
                              }
                            : x,
                        ),
                      }))
                    }
                  />
                  <RowActions
                    index={i}
                    length={cv.additionalSections.length}
                    onMove={(to) =>
                      setCv((c) => ({
                        ...c,
                        additionalSections: move(c.additionalSections, i, to),
                      }))
                    }
                    onRemove={() =>
                      setCv((c) => ({
                        ...c,
                        additionalSections: c.additionalSections.filter(
                          (_, n) => n !== i,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCv((c) => ({
                    ...c,
                    additionalSections: [
                      ...c.additionalSections,
                      {
                        id: crypto.randomUUID(),
                        title: "New section",
                        items: [],
                      },
                    ],
                  }))
                }
              >
                Add custom section
              </button>
            </fieldset>
          </div>
          <aside className="revisions">
            <h2>Revisions</h2>
            {revisions.length ? (
              revisions.map((r) => (
                <div key={r.id}>
                  <strong>{r.reason}</strong>
                  <small>{new Date(r.createdAt).toLocaleString()}</small>
                  <button className="text-link" onClick={() => restore(r.id)}>
                    Restore
                  </button>
                </div>
              ))
            ) : (
              <p>No revisions yet.</p>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
