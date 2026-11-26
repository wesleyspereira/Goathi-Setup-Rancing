import React,{useEffect,useState} from 'react'
import {collection,onSnapshot} from 'firebase/firestore'
import {db} from './firebase'
import {money} from '../data/shop'
import {resolveOrder,formatOrderNumber,deleteOrder} from './orderService.js'
const labels={pending:'Pendente',sold:'Venda confirmada',lost:'Não vendido'}
export default function Orders(){
 const [rows,setRows]=useState([]),[month,setMonth]=useState(''),[filter,setFilter]=useState('pending'),[values,setValues]=useState({}),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
 useEffect(()=>onSnapshot(collection(db,'orders'),s=>setRows(s.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))),()=>setMessage('Não foi possível carregar os pedidos. Confira as regras do Firestore.')),[])
 async function resolve(row,status){
  const amount=values[row.id]??(row.quotedCents==null?'':row.quotedCents/100)
  const cents=Math.round(Number(amount)*100)
  if(status==='sold'&&(!Number.isSafeInteger(cents)||cents<=0))return setMessage('Informe um valor recebido maior que zero.')
  if(!window.confirm(status==='sold'?`Confirmar venda de ${money(cents/100)} e lançar no caixa?`:'Marcar este pedido como não vendido?'))return
  setBusy(true);setMessage('')
  try{await resolveOrder(row.id,status,cents);setMessage(status==='sold'?'Venda confirmada e receita lançada no caixa.':'Pedido marcado como não vendido.')}catch(e){setMessage(e.message)}finally{setBusy(false)}
 }
 const inMonth=r=>!month || (r.createdAt?.toDate && new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'}).format(r.createdAt.toDate()).startsWith(month))
 const monthly=rows.filter(inMonth)
 async function remove(row){
  const code=formatOrderNumber(row.number)||row.id
  if(!window.confirm(`Excluir definitivamente o pedido ${code}? O número não será reutilizado.`))return
  setBusy(true);setMessage('')
  try{await deleteOrder(row.id);setMessage('Pedido não vendido excluído.')}catch{setMessage('Não foi possível excluir o pedido. Confira sua conexão e as regras do Firebase.')}finally{setBusy(false)}
 }
 return <section className="admin-panel"><h2>Pedidos do site</h2><p>Solicitações de compra aguardam sua confirmação. Somente vendas confirmadas entram no caixa.</p><div className="gp-toolbar"><label>Mês do pedido<input type="month" value={month} onChange={e=>setMonth(e.target.value)} /></label><button onClick={()=>setMonth('')}>Todos os meses</button></div><div className="admin-actions">{[['all','Todos'],...Object.entries(labels)].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label} ({monthly.filter(r=>id==='all'||r.status===id).length})</button>)}</div><p role="status">{message}</p>{monthly.filter(r=>filter==='all'||r.status===filter).map(r=><article className="admin-post" key={r.id}><div><h3>{r.productName}</h3><p>{r.name||'Cliente não informado'} · {labels[r.status]}</p><small>Pedido {formatOrderNumber(r.number)||r.id}</small><p>{r.createdAt?.toDate().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}</p><p>Valor solicitado: {r.quotedCents==null?'A consultar':money(r.quotedCents/100)}</p>{r.circuit&&<p>Pista: {r.circuit}</p>}{r.notes&&<p className="news-text">{r.notes}</p>}{r.status==='sold'&&<p>Recebido: {money(r.receivedCents/100)}</p>}</div>{r.status==='pending'&&<div><label>Valor recebido (R$)<input type="number" min="0.01" max="1000000" step="0.01" value={values[r.id]??(r.quotedCents==null?'':r.quotedCents/100)} onChange={e=>setValues({...values,[r.id]:e.target.value})}/></label><div className="admin-actions"><button disabled={busy} onClick={()=>resolve(r,'sold')}>Confirmar venda</button><button disabled={busy} onClick={()=>resolve(r,'lost')}>Não vendido</button></div></div>}{r.status!=='sold'&&<button disabled={busy} onClick={()=>remove(r)}>Excluir pedido</button>}</article>)}{!monthly.some(r=>filter==='all'||r.status===filter)&&<p>Nenhum pedido neste filtro.</p>}</section>
}
