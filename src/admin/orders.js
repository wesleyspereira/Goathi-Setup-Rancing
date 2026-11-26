import { signInAnonymously } from 'firebase/auth'
import { collection, doc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore'
import { auth, db } from './firebase'
export async function registerOrder(id, product, price, circuit, notes, name) {
  if (!db) throw new Error('Pedidos indisponíveis no momento.')
  await auth.authStateReady()
  const user = auth.currentUser || (await signInAnonymously(auth)).user
  await setDoc(doc(db, 'orders', id), { uid:user.uid, product:product.id, productName:product.name, quotedCents:price == null ? null : Math.round(price*100), circuit, notes, name, status:'pending', createdAt:serverTimestamp() })
}
export function newOrderId() { return db ? doc(collection(db,'orders')).id : crypto.randomUUID() }
export async function resolveOrder(id, status, cents) {
  const target=doc(db,'orders',id), cash=doc(db,'cashEntries',`order_${id}`)
  await runTransaction(db,async tx=>{
    const order=await tx.get(target)
    if(!order.exists() || order.data().status!=='pending') throw new Error('Este pedido já foi resolvido. Atualize a lista.')
    if(status==='sold') {
      if(!Number.isSafeInteger(cents)||cents<=0||cents>100000000) throw new Error('Informe o valor recebido.')
      const existing=await tx.get(cash)
      if(existing.exists()) throw new Error('Já existe um lançamento para este pedido.')
      tx.set(cash,{date:new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'}).format(new Date()),type:'income',description:`${order.data().productName} · ${id}`,category:'Venda pelo site',cents,updatedAt:serverTimestamp()})
    }
    tx.update(target,{status,receivedCents:status==='sold'?cents:0,resolvedAt:serverTimestamp()})
  })
}
