import { ContactForm } from "@/components/contact-form";
import { ContactLinks } from "@/components/contact-links";
import { CvView } from "@/components/cv-view";
import { getPublishedCv } from "@/server/cv-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cv = await getPublishedCv();
  const initials = cv.basics.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className="public-page" id="top">
      <a className="skip-link" href="#cv">
        Skip to CV
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="wordmark" href="#top">
            <span aria-hidden="true">{initials}</span>
            {cv.basics.name}
          </a>
          <a className="header-contact" href="#contact">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <main className="site-main" id="cv" tabIndex={-1}>
        <CvView cv={cv} />
        <section className="contact" aria-labelledby="contact">
          <div>
            <h2 id="contact" tabIndex={-1}>
              Contact
            </h2>
            <p>For engineering roles and consulting opportunities.</p>
            {cv.basics.links
              .filter((link) => link.url)
              .map((link) => (
                <a
                  className="text-link profile-link"
                  key={link.url}
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            <ContactLinks
              emailAvailable={Boolean(process.env.PUBLIC_CONTACT_EMAIL)}
              telegramAvailable={Boolean(process.env.PUBLIC_TELEGRAM_URL)}
            />
          </div>
          <ContactForm />
        </section>
      </main>
      <footer className="site-footer">
        <a className="text-link" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </div>
  );
}
