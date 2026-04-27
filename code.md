# Projeto ChatRapido - Guia de Implementação Técnica

Este documento serve como levantamento de requisitos e guia de arquitetura técnica para a construção do **ChatRapido**, um webapp minimalista, anônimo e efêmero de troca de mensagens. A aplicação será construída utilizando exclusivamente recursos nativos do **Ruby on Rails 8** (The "Rails Way").

## 1. Arquitetura de Sessão e Identificação
Não há exigência de criação de contas, gestão de senhas ou OAuth. O sistema define a sessão temporal puramente a partir da posse (ou compartilhamento) de um código único em URL.

*   **Identificador (Room ID)**: Um código alfanumérico curto e seguro contendo 6 caracteres (ex: `A1B2C3`). Por UX e para evitar fricções durante o preenchimento manual, as letras devem ser em maiúsculo (UPPERCASE) e caracteres ambíguos (O, 0, I, l, 1) podem ser filtrados no pool de caracteres geradores.
*   **Geração**: Serão utilizadas bibliotecas nativas de randomização do ecossistema Ruby (ex: `SecureRandom.alphanumeric(6).upcase`).
*   **Roteamento e Acesso**: O acesso a uma Room no navegador se dará através de rotas REST amigáveis como `/rooms/:token` (onde o `:token` substitui o default `:id`).

## 2. Modelo de Dados (Foco em Efemeridade)
Dada a natureza leve da aplicação e seguindo os novos padrões do Rails 8, toda persistência poderá ocorrer perfeitamente sem necessidade de infraestruturas cloud pesadas, dependendo somente do banco local de acesso a disco.

*   **Banco de Dados**: SQLite3. O SQLite pré-calibrado para produção que acompanha o Rails 8 é excepcionalmente performático para cargas transacionais deste formato.
*   **Modelo de Entidades**:
    *   `Room`:
        *   `token:string` (Limitado a 6 caracteres, com índice único a nível lógico e db).
        *   `last_activity_at:datetime` (Para balizamento de limpeza programada).
        *   `timestamps`.
    *   `Message`:
        *   `room_id:references`.
        *   `content:text` (Saneado, validado para não ser nil e preferencialmente limitado a um limite razoável, ex: ~1000 caracteres).
        *   `sender_identifier:string` (Identificador em hash. Como os usuários são anônimos e não possuem models próprios, usa-se a session criptografada default do browser para prover ao visitante um UUID temporário, gerando a noção de "Mensagem minha" x "Mensagem do outro").
        *   `timestamps`.

## 3. Engine de Tempo Real (Hotwire / Turbo Streams)
As camadas de interatividade dependem 100% de HTML em tempo real enviadas sobre websockets. Devem-se evitar ao extremo JS de Single Page Applications (SPA).

*   **Pilha Backend**: O Rails 8 elimina a necessidade imperativa ou padrão de "Redis" para Action Cable. Deve-se engatar o **Solid Cable** como mecanismo de pub/sub assente em SQLite já embarcado.
*   **Estratégia de Broadcast**: 
    *   A camada de modelo de `Message` se ligará em ActionCallbacks (`after_create_commit`) disparando `broadcast_append_to` para a `Room` daquela mensagem.
*   **Escritura (Inputs)**: 
    *   Botões de submit nas views do chat interagirão naturalmente graças ao drive do Turbo. Nenhuma página atualiza. Um microcontrolador simples de JS feito no form via framework Stimulus (`reset_form_controller.js`) cuidará apenas de realizar o "clear/reset" textual no input base assim que a requisição assíncrona for bem sucedida.
*   **Escuta (Leitura)**:
    *   Na action `show` dos chats, inserimos a subscription explícita `<%= turbo_stream_from @room %>`. Todo conteúdo novo de outro Device anexará em uma master `div id="messages"`.

## 4. Fluxo do Usuário
Minimizar as etapas para que do "Acesso ao site" até o "Primeiro oi enviado" sejam, no máximo, 2 clicks de distância.

*   **Acesso Inicial (Página Raiz)**:
    *   **Acão Primária**: Botão destacado "Criar Nova Sala". Um simples `<button>` que engatilha rota POST para `RoomsController#create`, criará o recurso com código em milissegundos e irá providenciar o `redirect_to` instantâneo à sala formatada recém gerada.
    *   **Ação Secundária**: Formulário simples que pede "Insira seu código" seguido de botão de submit que, lendo a String alfanumérica, levará do Home page à dita sala (com um GET direto se suportado ou um tratamento de form base).
*   **Dinâmica da Sala**:
    *   Painel visível evidenciando muito bem o Título/Código da Sala (para ditar por voz ou espelhar via botão de 'Copiar Link').
    *   Rolagem vertical com as mensagens previamente do carregamento da sala (se não foi expulsa ainda do BD).

## 5. UI/UX: Design Responsivo (Tailwind CSS)
Utiliza-se o Rails UI standard, permitindo uma construção baseada em estilos de utilidades e visuais extremamente modernos. Não precisaremos gerar os tradicionais pacotes pesados de assets JS/Node.

*   **Utilitários**: Tailwind CSS (Empacotado pelo padrão `tailwindcss-rails`).
*   **Layout Universal (Mobile First)**:
    *   O container mais extremo do app deve gerenciar o escopo de altura máxima da janela (`h-[100dvh]` com fallbacks), prevenindo que no telemóvel as UI do software nativo interfiram nas quebras de tela.
    *   Telas formadas por Cabeçalhos fixos, Centro rolante onde entra as falas, além do "Input + Submit" pinados firmemente no rodapé.
*   **Estética "Bubble Chat"**:
    *   Flex layouts nos `render partial: message` a fim de alternar visualmente as caixas. Caixas de texto renderizadas proeminentes à direita se os IDs baterem como originados do lado do client solicitante; caixas à esquerda para respostas externas.
*   **Acessibilidade (A11y)**: Hitboxes avantajados acima de 44x44px. Cores respeitando níveis sólidos de contraste WCAG na conversação de cor de fontes (preto sob branco/colorido etc).

## 6. Segurança e Limpeza de Dados (Garbage Collection)
Respeitando sua característica natural "efêmera", a plataforma fará uma rigorosa rotação de memória visando livrar e reciclar dados.

*   **Lixo Automatizado**: 
    *   Uso iminente do **Solid Queue** (Motor oficial introduzido na base local SQLite sem Redis) para criar Scheduled Jobs (Jobs recorrentes).
    *   Criação de um `RoomCleanupJob` rotineiro (ex: acionado a cada 3 horas ou equivalente) limpando permanentemente dados que caiam na regra de distanciamento seguro, como instâncias do modelo `Room` cujo `last_activity_at < 24.hours.ago`. Destruir um Room causaria as `Messages` associadas caírem em cascata (`dependent: :destroy`).
*   **Sanitização de Segurança**:
    *   Campos de `content` deverão se sujeitar a validação XSS natural da escape do Action View; scripts HTML nunca serão renderizados como inner strings.
    *   Possibilidade de adicionar limitações de conexões (`rack-attack` limiters) para evitar brute force em URLs `/rooms/XXXXXX`.
