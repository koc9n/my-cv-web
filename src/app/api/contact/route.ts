import { z } from "zod";

const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().max(160),message:z.string().trim().min(10).max(3000),companyWebsite:z.string().max(0)});
export async function POST(request:Request){
  const parsed=schema.safeParse(Object.fromEntries((await request.formData()).entries()));
  if(!parsed.success) return Response.json({error:"Invalid message"},{status:400});
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return Response.json({error:"Contact delivery is not configured"},{status:503});
  const {name,email,message}=parsed.data;
  const response=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:chatId,text:`CV website message\nFrom: ${name}\nEmail: ${email}\n\n${message}`})});
  return response.ok?Response.json({ok:true}):Response.json({error:"Delivery failed"},{status:502});
}
