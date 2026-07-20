# Canonical CV schema

The CV is stored as a versioned structured document. Every section has an ID, type, display label, order, and visibility state. Empty sections are omitted even if marked visible.

## Root

- `schemaVersion`
- `basics`
- `targetRoles[]`
- `summary`
- `sections[]`
- `settings`

## Basics

- Full name
- Professional headline
- Location and remote/onsite availability
- Public-safe email/contact reference
- Phone reference, optional and protected
- Website/domain, LinkedIn, GitHub, Telegram, and other profiles
- Profile image, optional on web and excluded from the ATS document by default

## Supported section types

- Professional summary
- Core competencies
- Technical skills grouped by category
- Professional experience
- Selected projects
- Education
- Certifications and licenses
- Languages
- Open-source contributions
- Publications
- Speaking and conferences
- Awards and honors
- Volunteering
- Professional memberships
- Patents
- References or “available on request” metadata
- Custom section with validated rich text entries

## Experience entry

- Employer, role, location, work arrangement
- Start/end dates and current-role marker
- Short scope statement
- Achievement bullets, each supporting optional metrics and technology tags
- Technology list
- Optional links

Experience is reverse chronological by default. Bullets should lead with an action and communicate result, scale, or business/engineering impact. Responsibilities without evidence should be minimized.

## Skills

Group skills into readable categories such as languages, backend, frontend, data, cloud/platform, architecture, testing, and delivery. Do not use graphical proficiency bars or self-awarded percentages.

## Settings

- Section ordering and custom labels
- Web visibility and export visibility
- Theme tokens within approved template limits
- Page size and export options
- SEO summary and optional public slug

## Validation

- Runtime validation is mandatory at all write/import boundaries.
- Unknown schema versions must not be published.
- URLs and dates must be normalized.
- Rich text uses a restricted document model; arbitrary HTML and scripts are forbidden.
- A migration function upgrades older document versions without mutating stored snapshots.
