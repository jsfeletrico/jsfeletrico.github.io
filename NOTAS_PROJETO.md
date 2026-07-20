# NOTAS DO PROJETO JSF ELÉTRICO

## F29 CONCLUÍDA — troca de senha (checkpoint 5bd37716)

## F30 EM ANDAMENTO — Favicon no Google

### Diagnóstico
- Os favicons no projeto JÁ SÃO o ícone correto (capacetinho com óculos e raios): favicon.ico (16x16 e 32x32), favicon-48.png, favicon-96.png, favicon-192.png, apple-touch-icon.png (180x180).
- As referências no client/index.html estão corretas (linhas 29-33).
- O problema é que o Google ainda mostra o ícone genérico de globo nos resultados de busca.

### Causa
O Google tem seu próprio processo de rastreamento de favicons. Ele pode demorar semanas/meses para atualizar. Possíveis causas do atraso:
1. O Google pode não ter re-rastreado o favicon desde a última publicação
2. Pode haver cache antigo no Google
3. Pode faltar o arquivo `/favicon.ico` na raiz servida (verificar se o deploy serve de /client/public/)

### Solução
1. Verificar se https://jsfeletrico.com/favicon.ico retorna o ícone correto (200 OK)
2. Verificar se https://jsfeletrico.com/favicon-48.png retorna o ícone correto
3. Se sim: solicitar reindexação no Google Search Console
4. Se não: corrigir o deploy para servir os favicons corretamente
5. Adicionar referência no robots.txt (opcional mas ajuda)
