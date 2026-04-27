import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  connect() {
    this.autoResize()
  }

  handleKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      if (this.inputTarget.value.trim() !== "") {
        this.element.requestSubmit()
      }
    }

    if (event.key === "Tab") {
      event.preventDefault()
      this.insertTab()
    }
  }

  autoResize() {
    this.inputTarget.style.height = "auto"
    this.inputTarget.style.height = (this.inputTarget.scrollHeight) + "px"
  }

  insertTab() {
    const start = this.inputTarget.selectionStart
    const end = this.inputTarget.selectionEnd
    const value = this.inputTarget.value

    // Insert 2 spaces for tab
    this.inputTarget.value = value.substring(0, start) + "  " + value.substring(end)
    this.inputTarget.selectionStart = this.inputTarget.selectionEnd = start + 2
    this.autoResize()
  }

  reset() {
    setTimeout(() => {
      this.autoResize()
    }, 0)
  }
}
