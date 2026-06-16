import { Controller } from "@hotwired/stimulus"

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export default class extends Controller {
  static targets = ["input", "preview", "filename", "filesize", "messageInput"]

  openFilePicker() {
    this.inputTarget.click()
  }

  fileSelected() {
    const file = this.inputTarget.files[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert("O arquivo excede o limite de 25MB.")
      this.removeFile()
      return
    }

    this.filenameTarget.textContent = file.name
    this.filesizeTarget.textContent = this.formatSize(file.size)
    this.previewTarget.classList.remove("d-none")
    this.previewTarget.classList.add("d-flex")
    
    if (this.hasMessageInputTarget) {
      this.messageInputTarget.disabled = true
      this.messageInputTarget.placeholder = "Arquivo selecionado..."
      this.messageInputTarget.value = ""
      this.messageInputTarget.dispatchEvent(new Event('input'))
    }
  }

  removeFile() {
    this.inputTarget.value = ""
    this.previewTarget.classList.add("d-none")
    this.previewTarget.classList.remove("d-flex")
    
    if (this.hasMessageInputTarget) {
      this.messageInputTarget.disabled = false
      this.messageInputTarget.placeholder = "Digite sua mensagem..."
      this.messageInputTarget.dispatchEvent(new Event('input'))
    }
  }

  submitStart(event) {
    if (this.inputTarget.files.length > 0) {
      const filename = this.inputTarget.files[0].name
      const container = document.getElementById("messages")
      if (!container) return

      const dummyHtml = `
        <div id="dummy-upload-message" class="d-flex flex-column mb-3" style="align-self: flex-end; align-items: flex-end; max-width: 85%;">
          <div class="p-2 px-3 shadow-sm rounded-3 bg-warning text-dark opacity-75 d-flex align-items-center gap-2" style="width: fit-content; border-bottom-right-radius: 0.25rem;">
            <div class="spinner-border spinner-border-sm text-dark" role="status">
              <span class="visually-hidden">Enviando...</span>
            </div>
            <span class="fw-bold small">Enviando ${filename}...</span>
          </div>
        </div>
      `
      container.insertAdjacentHTML('beforeend', dummyHtml)
      
      const messagesContainer = document.getElementById('messages_container')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }

  reset() {
    const dummy = document.getElementById("dummy-upload-message")
    if (dummy) dummy.remove()
    this.removeFile()
  }

  formatSize(bytes) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }
}
