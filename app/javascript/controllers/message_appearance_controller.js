import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bubble", "container"]
  static values = { senderIdentifier: String }

  connect() {
    const currentSender = document.body.dataset.currentSenderIdentifier
    const isMine = this.senderIdentifierValue === currentSender

    if (isMine) {
      this.element.style.alignSelf = "flex-end"
      this.element.style.alignItems = "flex-end"
      this.bubbleTarget.style.background = "var(--color-primary)"
      this.bubbleTarget.style.color = "var(--color-secondary-dark)"
      this.bubbleTarget.style.borderRadius = "var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)"
    } else {
      this.element.style.alignSelf = "flex-start"
      this.element.style.alignItems = "flex-start"
      this.bubbleTarget.style.background = "var(--color-white)"
      this.bubbleTarget.style.color = "var(--color-gray-800)"
      this.bubbleTarget.style.border = "1px solid var(--border-color)"
      this.bubbleTarget.style.borderRadius = "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)"
    }
    // Show the message once styled to prevent flash
    this.element.style.opacity = "1"
  }
}
