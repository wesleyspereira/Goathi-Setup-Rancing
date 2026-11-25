import { createHash } from 'node:crypto'
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Método inválido'});
  const token=(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];
  const {FIREBASE_API_KEY,FIREBASE_PROJECT_ID,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET}=process.env;
  if(!token)return res.status(401).json({error:'Login necessário'});
  if(![FIREBASE_API_KEY,FIREBASE_PROJECT_ID,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET].every(Boolean))return res.status(503).json({error:'Configure as variáveis do servidor na Vercel'});
  try{
    const auth=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_API_KEY)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token})});
    if(!auth.ok)return res.status(401).json({error:'Sessão inválida'});
    const uid=(await auth.json()).users?.[0]?.localId;
    if(!uid)return res.status(401).json({error:'Sessão inválida'});
    const role=await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`,{headers:{Authorization:`Bearer ${token}`}});
    if(!role.ok||(await role.json()).fields?.enabled?.booleanValue!==true)return res.status(403).json({error:'Acesso administrativo necessário'});
    const timestamp=Math.floor(Date.now()/1000),folder='goathi/publicacoes';
    const signature=createHash('sha256').update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`).digest('hex');
    return res.status(200).json({timestamp,folder,signature,cloudName:CLOUDINARY_CLOUD_NAME,apiKey:CLOUDINARY_API_KEY});
  }catch{return res.status(500).json({error:'Falha na autorização de mídia'});}
}
