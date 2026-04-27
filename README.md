# ChatRapido 🚀

**ChatRapido** é um webapp minimalista, anônimo e efêmero de troca de mensagens, construído exclusivamente com os recursos nativos do **Ruby on Rails 8** (The "Rails Way").

## 📌 Visão Geral

O projeto foca em simplicidade e velocidade, permitindo que usuários criem salas de chat temporárias sem a necessidade de contas ou configurações complexas. A efemeridade é um pilar central, com limpeza automática de dados.

## 🛠️ Arquitetura e Tecnologias

### 1. Sessão e Identificação
Não há gestão de usuários ou OAuth. O sistema utiliza:
*   **Room ID (Token)**: Código alfanumérico de 6 caracteres (ex: `A1B2C3`), gerado via `SecureRandom`. Caracteres ambíguos (O, 0, I, l, 1) são filtrados.
*   **Acesso via URL**: Rotas amigáveis como `/rooms/:token`.

### 2. Modelo de Dados (Efemeridade)
A persistência utiliza **SQLite3**, otimizado para produção no Rails 8.
*   **Room**: Armazena o token e a data da última atividade (`last_activity_at`).
*   **Message**: Pertence a uma Room. Possui conteúdo limitado e um `sender_identifier` (UUID temporário via session criptografada) para distinguir as mensagens do usuário.

### 3. Engine de Tempo Real (Hotwire)
Interatividade 100% via HTML sobre websockets, sem a complexidade de SPAs em JavaScript.
*   **Action Cable + Solid Cable**: Pub/sub baseado em banco de dados (sem necessidade de Redis).
*   **Turbo Streams**: Broadcast automático de mensagens no `after_create_commit`.
*   **Stimulus JS**: Micro-controladores para tarefas simples como resetar o formulário após o envio.

### 4. UI/UX e Design Responsivo
Design moderno e "Mobile First" utilizando **Tailwind CSS**.
*   **Layout**: Container com altura dinâmica (`100dvh`), cabeçalho fixo e input de mensagem pinado no rodapé.
*   **Estética "Bubble Chat"**: Alternância visual de balões de fala (direita para o autor, esquerda para terceiros).
*   **Acessibilidade**: Foco em contraste WCAG e hitboxes adequadas (> 44px).

### 5. Segurança e Garbage Collection
*   **Limpeza Automática**: Utiliza **Solid Queue** para rodar um `RoomCleanupJob` que remove salas (e suas mensagens em cascata) inativas há mais de 24 horas.
*   **Sanitização**: Proteção nativa contra XSS do Action View.
*   **Rate Limiting**: Pronto para integração com `rack-attack` para prevenir brute force em tokens.

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
*   Ruby 3.3+
*   Rails 8.x
*   SQLite3

### Instalação
1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    bundle install
    ```
3.  Prepare o banco de dados:
    ```bash
    bin/rails db:prepare
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    bin/dev
    ```
5.  Acesse `http://localhost:3000`.

---

Desenvolvido com ❤️ seguindo a filosofia Rails.
