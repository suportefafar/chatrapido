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
      this.bubbleTarget.classList.add("bg-warning", "text-dark")
      this.bubbleTarget.style.borderBottomRightRadius = "0.25rem"
    } else {
      this.element.style.alignSelf = "flex-start"
      this.element.style.alignItems = "flex-start"
      this.bubbleTarget.classList.add("bg-white", "text-dark", "border")
      this.bubbleTarget.style.borderBottomLeftRadius = "0.25rem"
    }
    // Show the message once styled to prevent flash
    this.element.style.opacity = "1"
  }
}
