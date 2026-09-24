# Goathi Setups

Site em React + Vite com temas claro/escuro, catálogo F1 26 DLC, preços,
seleção de produto e pedido pelo WhatsApp.

```bash
npm install
npm run dev
```

Para produção: `npm run build`. Saída: `dist/`.

## Configuração comercial

Edite `src/data/shop.js` para preços e links HTTPS de pagamento. Com links
vazios, o site envia o pedido ao WhatsApp. Não processa pagamento, confirma
transações nem entrega arquivos automaticamente. O checkout externo deve
permitir selecionar o circuito no caso dos setups individuais.

## Temas

As cores estão em `src/index.css`. O botão do cabeçalho alterna o tema e salva
em `localStorage` usando `goathi-theme`. Na primeira visita, segue a preferência
do dispositivo. O vídeo mantém um fundo escuro para preservar a legibilidade.

Leia `ATUALIZAR.txt` para detalhes das alterações e publicação.
