import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bubble", "container"]
  static values = { senderIdentifier: String }

  connect() {
    const currentSender = document.body.dataset.currentSenderIdentifier
    const isMine = this.senderIdentifierValue === currentSender

    if (isMine) {
      this.element.classList.add("align-self-end", "align-items-end")
      this.bubbleTarget.classList.add("chat-bubble-mine")
      this.bubbleTarget.style.borderRadius = "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)"
    } else {
      this.element.classList.add("align-self-start", "align-items-start")
      this.bubbleTarget.classList.add("chat-bubble-other")
      this.bubbleTarget.style.borderRadius = "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)"
    }
    
    // Show the message once styled to prevent flash
    this.element.style.opacity = "1"
  }
}
