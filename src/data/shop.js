export const shop = {
  prices: { individual: 9.90, pack: 79.90, ers: 59.90, pro: 129.90 },
  whatsapp: '5527996452596',
  checkout: { individual: '', pack: '', ers: '', pro: '' },
}
export const promotionDefault = { price: 39.90, endDate: '2026-11-30', enabled: true }
export const products = [
  { id: 'individual', name: 'Individual Setup', summary: 'Uma pista. Quatro configurações.', details: ['Qualifying, Race, Parc Fermé e Intermediate', 'Um circuito à sua escolha', 'PDF nos temas escuro e off-white'] },
  { id: 'pack', name: 'Pack Setups', summary: 'Sua preparação para as 25 pistas.', details: ['25 pistas, 4 setups por pista', 'Atualizações dos setups gratuitas', 'PDFs nos temas escuro e off-white'] },
  { id: 'ers', name: 'ERS + Estratégia', badge: 'NOVO', summary: 'Decisões de corrida, curva a curva.', details: ['Mapa de ERS: boost, médio e nenhuma', 'Corridas de 50%: planos A, B e C', 'Dados de pneus para 25 pistas'] },
  { id: 'pro', name: 'Pack Pro', badge: 'MELHOR VALOR', summary: 'Setups, ERS e estratégia juntos.', details: ['Todos os conteúdos para 25 pistas', 'Um PDF por pista: setups na página 1', 'ERS e estratégia na página 2'] },
]
export const money = value => value == null ? 'Preço a consultar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
export function promotionActive(promotion, now = Date.now()) {
  return promotion.enabled && /^\d{4}-\d{2}-\d{2}$/.test(promotion.endDate) && now <= Date.parse(`${promotion.endDate}T23:59:59.999-03:00`)
}
