# Goathi | Gestão premium

## Aplicar os arquivos
Extraia o ZIP na raiz da pasta loja-setups (onde está package.json), preservando a estrutura de diretórios. Mantenha o .env e os arquivos do cliente existentes. Não substitua App.jsx, refinements.css nem main.jsx. O pacote pressupõe que a atualização anterior de feedbacks já foi aplicada (Feedback.jsx e feedback.css).

## Firebase
Use o mesmo projeto goathi-setup e os mesmos administradores. Publique o firestore.rules incluído no Firebase Console (Firestore > Regras). O caixa usa a coleção cashEntries, criada automaticamente ao salvar o primeiro lançamento. Somente administradores podem ler e escrever nela. As publicações antigas continuam compatíveis.

## Teste local
npm install
npm run dev
Abra /admin.html no endereço mostrado pelo Vite (ou /admin, como antes). Login, caixa, gráficos, preços, promoções e feedback usam o Firebase. Upload de arquivos depende da função /api/media-sign hospedada na Vercel; o servidor Vite sozinho não executa a função. Links HTTPS de mídia podem ser usados no teste local.

## Vercel (novo projeto independente)
Importe o mesmo repositório em um novo projeto Vercel, mantendo o projeto da loja existente. Root Directory: pasta que contém package.json. Framework: Vite. Build Command (override): node build-admin.mjs. Output Directory (override): dist-admin. Install Command: padrão. Não modifique o Build Command ou Output Directory do projeto da loja. Na Vercel, a página inicial do novo projeto será o login/painel. Adicione o novo domínio em Firebase Authentication > Configurações > Domínios autorizados, se necessário.

Variáveis no novo projeto:
- VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID: mesmos valores do .env já existente.
- VITE_STORE_URL: URL pública atual da loja (opcional, para o link Ver site).
- FIREBASE_API_KEY e FIREBASE_PROJECT_ID: mesmos valores das respectivas variáveis VITE_ acima, usados no servidor para verificar a sessão e a autorização.
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: valores do painel Cloudinary. Não prefixe a chave secreta com VITE_ e não inclua a chave secreta no Git. Não precisa criar preset unsigned. A função serverless verifica o token do Firebase e o documento admins/{uid} antes de assinar o upload.

Faça redeploy após adicionar variáveis. Teste upload de uma foto JPEG/PNG/WebP/GIF (até 10 MB) e um vídeo MP4/WebM/MOV (até 50 MB), respeitando também os limites da conta Cloudinary. Cada publicação tem uma foto e um vídeo opcionais. O upload gera URL pública, mesmo se a publicação ainda for rascunho; não envie conteúdo confidencial. Excluir publicação não exclui o arquivo do Cloudinary; remova mídias sem uso pelo console Cloudinary quando necessário.

## Cliente
O pacote principal não altera o conteúdo público. Para exibir os vídeos de novas publicações na vitrine, aplique também o ZIP opcional (somente src/admin/Content.jsx). Ele adiciona o player de vídeo às publicações existentes sem alterar as classes, o layout ou as seções atuais. Caso você tenha editado esse arquivo localmente, compare antes de substituir. Atualize a loja no endereço e hospedagem atuais com seu processo normal de build/deploy.

## Validação
A sintaxe JavaScript/JSX foi verificada com parser TypeScript. Build completo, regras implantadas, login real, upload e publicação ainda precisam ser testados com as dependências e contas reais. Não há dados financeiros fictícios; lançamentos são manuais.
