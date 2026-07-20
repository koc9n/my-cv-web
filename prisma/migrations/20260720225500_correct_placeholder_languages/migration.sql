-- Correct language rows created from the old editor placeholder convention.
-- Only rows with the literal placeholder "Language" and a non-empty
-- proficiency value are swapped; correctly structured rows remain untouched.
UPDATE "CvState"
SET
  "draft" = CASE
    WHEN EXISTS (
      SELECT 1
      FROM jsonb_array_elements("draft" -> 'languages') AS item
      WHERE item ->> 'language' = 'Language'
        AND COALESCE(item ->> 'proficiency', '') <> ''
    )
    THEN jsonb_set(
      "draft",
      '{languages}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN item ->> 'language' = 'Language'
              AND COALESCE(item ->> 'proficiency', '') <> ''
            THEN jsonb_build_object(
              'language', item ->> 'proficiency',
              'proficiency', ''
            )
            ELSE item
          END
          ORDER BY position
        )
        FROM jsonb_array_elements("draft" -> 'languages')
          WITH ORDINALITY AS entries(item, position)
      )
    )
    ELSE "draft"
  END,
  "published" = CASE
    WHEN EXISTS (
      SELECT 1
      FROM jsonb_array_elements("published" -> 'languages') AS item
      WHERE item ->> 'language' = 'Language'
        AND COALESCE(item ->> 'proficiency', '') <> ''
    )
    THEN jsonb_set(
      "published",
      '{languages}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN item ->> 'language' = 'Language'
              AND COALESCE(item ->> 'proficiency', '') <> ''
            THEN jsonb_build_object(
              'language', item ->> 'proficiency',
              'proficiency', ''
            )
            ELSE item
          END
          ORDER BY position
        )
        FROM jsonb_array_elements("published" -> 'languages')
          WITH ORDINALITY AS entries(item, position)
      )
    )
    ELSE "published"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE
  EXISTS (
    SELECT 1
    FROM jsonb_array_elements("draft" -> 'languages') AS item
    WHERE item ->> 'language' = 'Language'
      AND COALESCE(item ->> 'proficiency', '') <> ''
  )
  OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements("published" -> 'languages') AS item
    WHERE item ->> 'language' = 'Language'
      AND COALESCE(item ->> 'proficiency', '') <> ''
  );
