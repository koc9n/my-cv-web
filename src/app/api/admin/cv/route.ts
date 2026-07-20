import { cvSchema } from "@/domain/cv";
import { getAdminState, publishDraft, restoreRevision, saveDraft } from "@/server/cv-repository";
import { requireAdmin } from "@/server/require-admin";

export async function GET(){try{await requireAdmin();return Response.json(await getAdminState())}catch{return Response.json({error:"Unauthorized"},{status:401})}}
export async function PUT(request:Request){try{await requireAdmin();const body=await request.json();const cv=cvSchema.parse(body.cv);const version=await saveDraft(cv,Number(body.lockVersion));return Response.json({lockVersion:version})}catch(e){if(e instanceof Error&&e.message==="STALE_DRAFT")return Response.json({error:"Draft changed elsewhere. Reload before saving."},{status:409});return Response.json({error:"Unable to save"},{status:400})}}
export async function POST(request:Request){try{await requireAdmin();const body=await request.json();if(body.action==="publish")await publishDraft();else if(body.action==="restore"&&typeof body.id==="string")await restoreRevision(body.id);else return Response.json({error:"Invalid action"},{status:400});return Response.json({ok:true})}catch{return Response.json({error:"Unable to complete action"},{status:400})}}
