import { ContactForm } from "@/components/contact-form";
import { ContactLinks } from "@/components/contact-links";
import { CvView } from "@/components/cv-view";
import { getPublishedCv } from "@/server/cv-repository";

export const dynamic = "force-dynamic";
export default async function Home() {
  const cv = await getPublishedCv();
  return (
    <main>
      <CvView cv={cv} />
      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Let&apos;s build something useful</p>
          <h2 id="contact-title">Contact</h2>
          <p>
            For senior Java, full-stack, software engineering, and consulting
            opportunities.
          </p>
          <ContactLinks />
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
                Connect on {link.label}
              </a>
            ))}
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
