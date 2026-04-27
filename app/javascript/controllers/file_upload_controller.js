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

  reset() {
    this.removeFile()
  }

  formatSize(bytes) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }
}
