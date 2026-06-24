# ChatRápido UI Specifications

This document outlines the visual and functional specifications for all pages and components in the ChatRápido application. These specs serve as the blueprint for any future redesigns or CSS implementations.

## 1. Global Layout & Theme

- **Responsiveness**: The application must be mobile-friendly and scale gracefully to desktop sizes.
- **Constraints**: The main chat interface is typically constrained to a maximum width (e.g., `max-width: 48rem` or `768px`) and centered on the screen to prevent messages from spanning too wide on large monitors.
- **Viewport**: The layout should strictly occupy `100vh` to ensure the chat area scrolls internally without scrolling the entire browser window.
- **Theme/Brand**: Uses the Farmácia UFMG institutional identity (Gold/Amber and Dark Gray/Black).

---

## 2. Landing Page (`rooms#index`)

The entry point of the application where users can create or join rooms.

### Structure & Elements:
- **Hero Section**:
  - **Logo**: The ChatRápido icon/logo centered.
  - **Tag/Badge**: Small identifier (e.g., "Farmácia UFMG").
  - **Title**: "ChatRápido" (Prominent, usually serif/display font).
  - **Subtitle**: "Comunicação efêmera, segura e instantânea."
- **Actions Area**:
  - **Create Button**: A prominent primary button to create a new room ("Criar Nova Sala"). Should span the full width of its container.
  - **Divider**: A visual separator with text ("OU ENTRE EM UMA SALA").
  - **Join Form**:
    - **Input Field**: A large text input for the 6-character room token. Should be uppercase, monospaced, with slight letter-spacing.
    - **Submit Button**: Button to join the room ("Entrar"). Placed adjacent to the input field.

---

## 3. Chat Room Layout (`rooms#show`)

The main interface for real-time communication.

### 3.1. Sticky Header
Always visible at the top of the chat view.
- **Left Content**:
  - Small Logo/Icon.
  - Application Name ("ChatRápido").
  - Room Identifier Badge (e.g., "Sala 5L619C").
  - Status/Warning Text (e.g., "Expira em 24h sem uso").
- **Right Content**:
  - **"Copiar Link" Button**: Copies the current room URL to the clipboard.
  - **"Sair" Link**: Exits the room and returns to the landing page.

### 3.2. Scrollable Messages Viewport
- **Behavior**: Takes up all available vertical space (`flex-grow: 1`). Overflow is hidden on the parent and scrolls internally (`overflow-y: auto`). Auto-scrolls to the bottom when new messages arrive.
- **Background**: Neutral/light background to contrast with message bubbles.

### 3.3. Sticky Footer Input
Always visible at the bottom of the chat view.
- **File Preview Bar (Hidden by default)**:
  - Appears above the text input when a file is selected.
  - Shows file icon, filename (truncated), and file size.
  - Contains a clear "X" button to cancel the file attachment.
- **Input Area**:
  - **Attachment Button**: A paperclip icon button to open the OS file picker.
  - **Text Input**: An auto-resizing, multi-line text area. Must not have an intrusive focus ring.
  - **Send Button**: "Enviar" button.

---

## 4. Message Bubble Component (`messages/_message.html.erb`)

Individual messages displayed in the viewport.

### 4.1. Alignment & Styling
- **"My" Messages (Current User)**:
  - **Alignment**: Right-aligned (`align-self-end`).
  - **Background**: Primary brand color (e.g., Gold/Amber).
  - **Text Color**: Dark contrast color.
  - **Border Radius**: Rounded on all corners except the bottom-right corner (which acts as a visual tail).
- **"Other" Messages (Remote Users)**:
  - **Alignment**: Left-aligned (`align-self-start`).
  - **Background**: Neutral/White.
  - **Text Color**: Dark gray/Black.
  - **Border/Shadow**: Should have a subtle border or shadow to stand out from the background.
  - **Border Radius**: Rounded on all corners except the bottom-left corner.

### 4.2. Content Types
- **Text Message**: Standard multiline text. Must support word-wrapping (`word-break: break-word`, `white-space: pre-wrap`) to prevent long contiguous strings from breaking the layout.
- **File Message**:
  - Rendered as a clickable block inside the bubble.
  - Includes a left-aligned file icon (e.g., document icon).
  - Center block with filename and file size (human-readable, e.g., "13.9 KB").
  - Right-aligned download icon.

### 4.3. Message Metadata
- **Timestamp**: Small, muted text displayed directly beneath each message bubble showing the time sent (e.g., "20:31").
- **Copy Button (Text only)**: A small, muted copy icon next to the timestamp allowing the user to copy the message content. Does not appear for file messages.
