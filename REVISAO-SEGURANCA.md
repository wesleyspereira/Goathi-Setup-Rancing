# Revisão de segurança

Revisão do código entregue, não auditoria do ambiente publicado.

## Verificado no código
- Pedidos e caixa só podem ser lidos por contas presentes em admins com enabled=true.
- Visitantes autenticados anonimamente podem criar somente pedidos pendentes; não podem confirmar vendas, alterar preços ou escrever no caixa.
- A confirmação usa transação e identificador de lançamento fixo por pedido para evitar dupla receita.
- Feedbacks continuam moderados internamente; somente os aprovados são listados publicamente. Dados de pedidos não são públicos.
- A assinatura de mídia verifica o token no Firebase e consulta a autorização de administrador no servidor. O segredo Cloudinary não é enviado ao navegador.
- Não foram encontrados blocos de chave privada nos arquivos de código examinados. Arquivos .env não estão no ZIP.

## Reforços aplicados
- Proteção contra resposta de autorização antiga após mudança de sessão.
- Cabeçalhos contra incorporação em iframe e interpretação incorreta de tipos, e restrição de câmera/microfone/localização na configuração Vercel.
- Prazo máximo nas consultas do endpoint de assinatura de mídia.

## Pendências de produção
- Publicar firestore.rules; as regras locais não substituem automaticamente as regras no console.
- Verificar que a coleção admins contém só as contas autorizadas. Não usar allow read, write: if true.
- App Check e limitação de frequência ainda não estão implementados: pedidos públicos com autenticação anônima podem receber spam. Configure App Check no cliente e no console antes de exigir tokens, para não bloquear visitantes legítimos. App Check não substitui limitação de requisições.
- O limite de tamanho de upload é conferido no navegador; configure também um preset com restrições no Cloudinary para aplicar limites no serviço.
- Os preços informados em pedidos são valores solicitados, não prova de pagamento. O administrador deve conferir o valor recebido.
- Segredos Cloudinary devem ficar somente nas variáveis do servidor, nunca com prefixo VITE_. Use autenticação forte para Firebase, Vercel e Cloudinary.
- Não foram verificados regras realmente publicadas, contas, segredos da Vercel, permissões Cloudinary ou vulnerabilidades das dependências em serviço de auditoria. Não foi executado emulador Firestore.

## Testes realizados
Build do site e do painel. Teste local da lógica de transação com dados simulados: confirmação, repetição, não vendido e valor inválido. Isso não substitui testar permissões com o emulador Firebase ou Rules Playground.
