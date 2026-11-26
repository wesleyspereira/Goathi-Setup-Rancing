# Atualização: pedidos, caixa e feedbacks

1. Publique o conteúdo completo de `firestore.rules` em Firebase > Firestore > Regras. Preserve a coleção `admins` já configurada.
2. Mantenha Authentication > Anônimo habilitado para registrar pedidos e feedbacks públicos.
3. Publique novamente o site e o painel, mantendo as variáveis de ambiente atuais.

## Uso
- O botão Escolher abre o formulário. Ao clicar Continuar compra, registra um pedido pendente e segue para o checkout existente ou WhatsApp com o código do pedido. Abrir o formulário sozinho não registra uma venda nem um pedido.
- Painel > Pedidos: confira o cliente e o valor efetivamente recebido. Confirmar venda cria a receita no caixa, junto com a mudança de status, numa transação. Cliques repetidos não geram duas receitas. Não vendido não altera o caixa.
- Fluxo de caixa continua permitindo lançar, editar e excluir receitas e despesas manuais. Ajustes de lançamentos de vendas no caixa não reabrem pedidos: o status guarda a confirmação original.
- Valores solicitados pelo visitante não comprovam pagamento; confira o recebimento antes de confirmar.
- A área pública de feedbacks mostra apenas a média numérica e não menciona aprovação. A moderação permanece no painel.
- O favicon usa o G vermelho original sobre fundo claro. O Google pode demorar a atualizar o ícone após a publicação.

## Verificação antes de usar em produção
Teste uma solicitação no site, a confirmação no painel, uma tentativa de confirmação repetida e a opção Não vendido. Confira também um lançamento manual. O build foi verificado localmente; não foi executado teste com o Firebase de produção nem realizado deploy.

## Numeração GT
Publique novamente firestore.rules antes de testar. Novos pedidos recebem GT-0001, GT-0002 etc. O contador é criado automaticamente junto com o primeiro novo pedido, em transação. Não apague counters/orders. Pedidos antigos mantêm seus códigos para preservar o histórico. A sequência não reinicia a cada mês ou ano e pode ultrapassar GT-9999.

O painel de pedidos tem filtro por mês (horário de Brasília), combinado ao status. Excluir pede confirmação e remove apenas pedidos pendentes ou não vendidos. Pedidos vendidos não podem ser excluídos; suas receitas ficam preservadas. O contador não é reduzido.
