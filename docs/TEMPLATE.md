# ATS-friendly template specification

## Recommended direction

Use a minimal, lightly creative “editorial technical” design: strong typography, restrained accent color, generous spacing, and subtle rules. The core CV content stays in one semantic column. On wide web screens, a narrow sticky navigation or action rail may sit outside the document flow, but it must not change extracted content order.

## ATS and extraction rules

- Use conventional headings such as Summary, Skills, Experience, Projects, Education, and Certifications.
- Render real text, never text embedded in images.
- Use one main reading column for CV content.
- Avoid tables, text boxes, skill charts, icons as the sole meaning, and essential content in headers/footers.
- Use standard bullet characters and clear reverse chronology.
- Include relevant keywords naturally in summary, skills, and achievement context; never keyword-stuff or hide text.
- Keep contact labels understandable when icons or protected reveal controls are used.
- PDF text must remain selectable and extract in logical order.
- DOCX uses native paragraphs, headings, lists, and links.

## Web layout

- Header: name, professional headline, short availability line, primary contact actions, and download actions
- Summary: concise positioning and differentiators
- Skills: grouped text chips or compact lists that degrade to plain text
- Experience: employer/role/date hierarchy followed by achievement bullets and technology context
- Remaining sections: same semantic component rhythm, omitted when empty
- Optional web enhancements: section navigation, print preview, theme-aware accent, subtle motion respecting reduced-motion preferences

## Visual constraints

- Use a readable sans-serif or restrained sans/serif pairing with local or privacy-conscious font delivery.
- Body text must meet accessible contrast and comfortable line length.
- Accent color is decorative; meaning never depends on color alone.
- Print mode removes navigation, admin controls, animation, and nonessential decoration.
- The layout targets A4 first and should also behave acceptably on Letter.

## Conversion-oriented content guidance

- Headline aligns with the target role family rather than listing every technology.
- Summary communicates seniority, Java/backend strength, full-stack range, domain context, and differentiating outcomes once supported by the source CV.
- Recent roles receive the most detail.
- Achievement bullets favor measurable improvements: latency, throughput, reliability, cost, revenue, delivery time, team scope, or user scale.
- Projects appear prominently only when they provide evidence beyond employment history.

## Template assets

Do not add a generic downloaded CV template with unclear licensing. Implement the template as repository-owned React/CSS components based on this specification after the source CV is reviewed.

## Validation checklist

- Copy all visible CV text into a plain-text file and confirm coherent order.
- Extract generated PDF/DOCX text and compare headings, dates, roles, and bullets.
- Test at narrow mobile width, common desktop widths, A4 print preview, and Letter print preview.
- Confirm links have meaningful visible labels and exports include usable URLs.
