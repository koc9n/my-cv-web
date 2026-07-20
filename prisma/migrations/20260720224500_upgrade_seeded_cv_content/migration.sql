-- Upgrade only CV documents that still contain the original seeded summary.
-- This keeps customized drafts and published revisions untouched.
UPDATE "CvState"
SET
  "draft" = CASE
    WHEN "draft" ->> 'summary' = 'Results-driven Senior Full Stack Developer with 10+ years of experience building scalable, high-performance web applications and enterprise backend systems. Experienced in Java, Node.js, Angular, AWS, Docker, and Kubernetes, with a track record in microservices, infrastructure migrations, performance optimization, and team mentorship.'
    THEN jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            "draft",
            '{summary}',
            to_jsonb('Senior software engineer with 15+ years of experience designing and operating Java-based enterprise systems and full-stack applications. Specialized in Spring Boot microservices, cloud infrastructure, and distributed systems, with hands-on experience across Angular, Node.js, AWS, Kubernetes, Kafka, and Terraform. Led cloud migration and platform modernization work at Allianz Technology while mentoring engineers and improving deployment and operational performance.'::text)
          ),
          '{experience,3,role}',
          to_jsonb('Earlier Java Developer Roles'::text),
          false
        ),
        '{achievements}',
        '[]'::jsonb
      ),
      '{sectionSettings}',
      '[
        {"id":"summary","label":"Summary","visible":true},
        {"id":"experience","label":"Experience","visible":true},
        {"id":"skills","label":"Technical skills","visible":true},
        {"id":"projects","label":"Selected projects","visible":true},
        {"id":"achievements","label":"Key achievements","visible":false},
        {"id":"education","label":"Education","visible":true},
        {"id":"certifications","label":"Certifications","visible":true},
        {"id":"languages","label":"Languages","visible":true},
        {"id":"additional","label":"Additional","visible":true}
      ]'::jsonb
    )
    ELSE "draft"
  END,
  "published" = CASE
    WHEN "published" ->> 'summary' = 'Results-driven Senior Full Stack Developer with 10+ years of experience building scalable, high-performance web applications and enterprise backend systems. Experienced in Java, Node.js, Angular, AWS, Docker, and Kubernetes, with a track record in microservices, infrastructure migrations, performance optimization, and team mentorship.'
    THEN jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            "published",
            '{summary}',
            to_jsonb('Senior software engineer with 15+ years of experience designing and operating Java-based enterprise systems and full-stack applications. Specialized in Spring Boot microservices, cloud infrastructure, and distributed systems, with hands-on experience across Angular, Node.js, AWS, Kubernetes, Kafka, and Terraform. Led cloud migration and platform modernization work at Allianz Technology while mentoring engineers and improving deployment and operational performance.'::text)
          ),
          '{experience,3,role}',
          to_jsonb('Earlier Java Developer Roles'::text),
          false
        ),
        '{achievements}',
        '[]'::jsonb
      ),
      '{sectionSettings}',
      '[
        {"id":"summary","label":"Summary","visible":true},
        {"id":"experience","label":"Experience","visible":true},
        {"id":"skills","label":"Technical skills","visible":true},
        {"id":"projects","label":"Selected projects","visible":true},
        {"id":"achievements","label":"Key achievements","visible":false},
        {"id":"education","label":"Education","visible":true},
        {"id":"certifications","label":"Certifications","visible":true},
        {"id":"languages","label":"Languages","visible":true},
        {"id":"additional","label":"Additional","visible":true}
      ]'::jsonb
    )
    ELSE "published"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE
  "draft" ->> 'summary' = 'Results-driven Senior Full Stack Developer with 10+ years of experience building scalable, high-performance web applications and enterprise backend systems. Experienced in Java, Node.js, Angular, AWS, Docker, and Kubernetes, with a track record in microservices, infrastructure migrations, performance optimization, and team mentorship.'
  OR "published" ->> 'summary' = 'Results-driven Senior Full Stack Developer with 10+ years of experience building scalable, high-performance web applications and enterprise backend systems. Experienced in Java, Node.js, Angular, AWS, Docker, and Kubernetes, with a track record in microservices, infrastructure migrations, performance optimization, and team mentorship.';
