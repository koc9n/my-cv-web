CREATE TABLE "CvState" (
  "id" TEXT NOT NULL,
  "draft" JSONB NOT NULL,
  "published" JSONB NOT NULL,
  "lockVersion" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "publishedAt" TIMESTAMP(3),
  CONSTRAINT "CvState_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CvRevision" (
  "id" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CvRevision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CvRevision_createdAt_idx" ON "CvRevision"("createdAt");
