import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { getAdminState } from "@/server/cv-repository";
import { AdminEditor } from "@/components/admin-editor";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/sign-in");
  const state = await getAdminState();
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Private workspace</p>
          <h1 className="admin-title">Edit CV</h1>
        </div>
        <a className="button" href="/" target="_blank" rel="noreferrer">
          View website
        </a>
      </header>
      <AdminEditor
        initialCv={state.draft}
        initialVersion={state.lockVersion}
        revisions={state.revisions.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
