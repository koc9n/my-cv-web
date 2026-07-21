-- Keep the canonical experience statement exact across the active CV and
-- historical revisions, so restoring an older revision cannot reintroduce it.
-- Only the known previous experience phrase is changed; all other summary
-- wording remains untouched.
UPDATE "CvState"
SET
  "draft" = CASE
    WHEN "draft" ->> 'summary' LIKE '%15+ years of experience%'
    THEN jsonb_set(
      "draft",
      '{summary}',
      to_jsonb(replace(
        "draft" ->> 'summary',
        '15+ years of experience',
        '14 years of experience'
      ))
    )
    ELSE "draft"
  END,
  "published" = CASE
    WHEN "published" ->> 'summary' LIKE '%15+ years of experience%'
    THEN jsonb_set(
      "published",
      '{summary}',
      to_jsonb(replace(
        "published" ->> 'summary',
        '15+ years of experience',
        '14 years of experience'
      ))
    )
    ELSE "published"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE
  "draft" ->> 'summary' LIKE '%15+ years of experience%'
  OR "published" ->> 'summary' LIKE '%15+ years of experience%';

UPDATE "CvRevision"
SET "content" = jsonb_set(
  "content",
  '{summary}',
  to_jsonb(replace(
    "content" ->> 'summary',
    '15+ years of experience',
    '14 years of experience'
  ))
)
WHERE "content" ->> 'summary' LIKE '%15+ years of experience%';
