import {auth} from './firebase'
export async function uploadMedia(file,kind){
  const video=kind==='video'; const allowed=video?['video/mp4','video/webm','video/quicktime']:['image/jpeg','image/png','image/webp','image/gif'];
  if(!allowed.includes(file.type)||file.size>(video?50:10)*1024*1024)throw new Error('Formato inválido ou arquivo grande demais (foto 10 MB, vídeo 50 MB).');
  const user=auth?.currentUser;if(!user||user.isAnonymous)throw new Error('Entre como administrador.');
  const response=await fetch('/api/media-sign',{method:'POST',headers:{Authorization:`Bearer ${await user.getIdToken()}`}});
  if(!response.ok)throw new Error('Upload indisponível. Confira a configuração da Vercel.');
  const {timestamp,folder,signature,cloudName,apiKey}=await response.json();
  const data=new FormData();Object.entries({file,timestamp,folder,signature,api_key:apiKey}).forEach(([k,v])=>data.append(k,v));
  const uploaded=await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${video?'video':'image'}/upload`,{method:'POST',body:data});
  const result=await uploaded.json();if(!uploaded.ok||!result.secure_url)throw new Error(result.error?.message||'Falha no upload.');return result.secure_url;
}
