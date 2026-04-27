import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "button"]
  static values = { successText: String }

  copy() {
    const text = this.contentTarget.innerText
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess()
    })
  }

  showSuccess() {
    const originalContent = this.buttonTarget.innerHTML
    this.buttonTarget.innerHTML = "✓"
    this.buttonTarget.classList.add("text-success")
    
    setTimeout(() => {
      this.buttonTarget.innerHTML = originalContent
      this.buttonTarget.classList.remove("text-success")
    }, 2000)
  }
}
