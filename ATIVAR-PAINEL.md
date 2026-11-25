# Painel Goathi — ativação

O site continua na Vercel. O painel usa Firebase Authentication e Cloud Firestore. Esta entrega não criou serviços externos nem publicou alterações. Sem configuração, o site mantém os preços de src/data/shop.js e o painel explica a ativação.

## 1. Firebase
1. Crie um projeto dedicado à Goathi em https://console.firebase.google.com/ (ou use o projeto Goathi existente).
2. Registre um aplicativo Web nas configurações do projeto. Copie apiKey, authDomain, projectId e appId.
3. Copie .env.example para .env.local. Preencha os quatro valores. Não use chaves de conta de serviço nem senhas nessas variáveis.
4. Ative Authentication > método E-mail/senha. Em Usuários, adicione o responsável com e-mail e senha própria. Copie o UID dele.
5. Crie Cloud Firestore em modo produção. Na aba Regras, publique o conteúdo de firestore.rules.
6. Na aba Dados, crie a coleção admins. O ID do documento deve ser exatamente o UID do responsável. Adicione enabled do tipo boolean com valor true. Só o console pode autorizar administradores; o painel não permite criar permissões.
7. Em Authentication > Configurações > Domínios autorizados, adicione goathi-setups.vercel.app, seu domínio próprio e localhost para teste.

## 2. Teste local
Execute npm install e npm run dev. Acesse http://localhost:5173/admin (use a porta indicada no terminal).
Entre com a conta autorizada. Salve os preços; vazio mostra Preço a consultar. Os valores são usados também no pedido enviado pelo WhatsApp. Links de checkout externos continuam em src/data/shop.js; preços do provedor de pagamento precisam ser alterados no próprio provedor.

Crie uma publicação com título, tipo, descrição e, opcionalmente, um link HTTPS direto de imagem. Esta versão usa imagens por URL, sem upload. Pode usar uma imagem em public/novidades publicada na Vercel e copiar seu endereço completo. Marque Publicar no site ou salve como rascunho. Edite ou exclua pela lista. Não há postagens de demonstração no site público.

Verifique em janela anônima: os preços e as publicações devem aparecer; rascunhos não devem aparecer. Uma conta sem documento admins habilitado não pode editar. Excluir uma postagem a remove do site. Teste essas operações antes de anunciar o painel.

## 3. Vercel
No projeto atual, Settings > Environment Variables: cadastre os mesmos quatro nomes de .env.example para Production (e Preview, se usar). Faça novo deploy após preencher as variáveis. Não compartilhe a senha do administrador no repositório.

Copie os arquivos atualizados para sua pasta de trabalho, preservando seu .git. Execute npm install e npm run build. Revise git diff, depois git add ., git commit -m "Adiciona painel e novidades Goathi", e git push. Se a Vercel estiver conectada ao repositório, o deploy será iniciado.

Painel: https://goathi-setups.vercel.app/admin
Site: https://goathi-setups.vercel.app/

## Alterações
- Remove a seção de parceiros e seus imports.
- Adiciona Novidades e promoções, com link no menu.
- Mantém o restante da landing page, vídeo, imagens, carrossel e pedidos.
- Painel responsivo com login, preços, rascunhos, edição e exclusão de posts.
- Regras restringem gravação a administradores autorizados.

A compilação pode ser verificada sem credenciais. Login e persistência reais só podem ser verificados após a configuração Firebase acima.

## Novo catálogo e feedbacks — novembro de 2026
Publique novamente firestore.rules. Os preços agora são salvos em settings/catalogV2 (individual, pack, ers e pro), para não herdar valores do catálogo antigo. A oferta fica em settings/promotion, com price, endDate e enabled. Inicialmente, os valores são 9,90 / 79,90 / 59,90 / 129,90 e oferta 39,90 até 30/11/2026, 23:59:59.999 de Brasília. O painel pode alterar todos esses valores e o prazo. Não é preciso criar esses documentos manualmente: salvar no painel cria os documentos.

Em Authentication > Métodos de login, habilite também Anônimo para o formulário público de feedback. Cada identidade anônima pode criar um depoimento, inicialmente pending; só o administrador pode aprovar (approved) ou ocultar (rejected). Isso limita envios por identidade, mas não substitui proteção contra abuso: antes de divulgação ampla, configure Firebase App Check e monitore uso. Não há depoimentos inventados.

A nova landing usa as artes oficiais e as prévias. Cards e tabela são HTML com preços dinâmicos; as artes de cards com preços gravados não são usadas como vitrine para evitar divergência após edição pelo painel. Metadados de descrição não fixam preços pelo mesmo motivo. A og:image é a arte oficial solicitada e é estática: se ela contiver preços, precisa ser atualizada junto da arte após reajustes. WhatsApp/Instagram podem manter cache e devem ser conferidos depois do deploy; o arquivo local não comprova o card em produção.

O link de compra da oferta vai ao Instagram para conferência do comprovante. Os demais pedidos continuam no WhatsApp. Nenhum pagamento externo foi alterado. O layout novo recria o hero em HTML com as prévias oficiais para manter o preço editável, em vez do vídeo antigo; os vídeos originais foram preservados em public/videos.

## Validação desta entrega
Compilação Vite aprovada; testes de preços e da expiração no limite do dia de Brasília aprovados. Nenhuma ocorrência de 6,90 ou 6.90 em src e index.html. Ainda pendentes: teste visual em 375/768/1440, verificação de contraste completo, login e gravações com Firebase configurado, regras em emulador/projeto, e compartilhamento real após deploy. A ferramenta de navegador não abriu a prévia neste ambiente.


## Revisão visual compacta
O login e o painel ficam em página separada: acesse /admin no mesmo domínio (local: http://localhost:5173/admin). Não há botão administrativo na vitrine. O formulário de feedback abre em “Deixar avaliação”.
O vídeo original permanece no hero, com reprodução ao passar o mouse ou focar, e automática no celular quando visível. A galeria final contém somente quatro fotos, sem fundo ou moldura; o vídeo permanece apenas no início. A fonte Arial/Helvetica e a formatação do hero foram recuperadas do site original. Os quatro produtos e os preços editáveis foram preservados.
Para conferir sem instalar, extraia o ZIP e abra PREVIA-GOATHI.html no navegador. Ela usa valores de demonstração do catálogo e não conecta ao Firebase. O vídeo precisa da pasta loja-setups/public/videos ao lado. Para executar o projeto: npm install, depois npm run dev.
Build de produção validado. Não foi possível executar a conferência visual no navegador deste ambiente; login e gravações dependem da configuração real do Firebase.

## Vídeo de lançamento em Novidades
Incluído o vídeo enviado às 19:14:55, como postagem fixa de apresentação de ERS + Estratégia. Arquivos public/videos/novidade-goathi.mp4 e novidade-goathi.jpg; conteúdo em src/admin/Content.jsx. Essa postagem fixa não é gravada no Firebase nem editada pelo painel. As demais publicações continuam no painel.
