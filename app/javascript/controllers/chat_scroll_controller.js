import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["messages"]

  connect() {
    this.scrollToBottom()
    
    // Fallback for when layout takes a moment to settle
    requestAnimationFrame(() => {
      this.scrollToBottom()
    })

    this.currentSender = document.body.dataset.currentSenderIdentifier

    this.observer = new MutationObserver((mutations) => {
      let hasNewExternalMessage = false

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-message-appearance-sender-identifier-value")) {
            const senderId = node.getAttribute("data-message-appearance-sender-identifier-value")
            
            if (senderId !== this.currentSender) {
              hasNewExternalMessage = true
              
              const textContent = node.querySelector('[data-clipboard-target="content"]')?.innerText || "Novo arquivo anexado"
              
              if (document.hidden && "Notification" in window && Notification.permission === "granted") {
                new Notification("ChatRápido - Nova Mensagem", {
                  body: textContent,
                  icon: "/icon.png"
                })
              }
            }
          }
        })
      })

      if (hasNewExternalMessage) {
        this.playNotificationSound()
      }

      this.scrollToBottom(true)
    })

    if (this.hasMessagesTarget) {
      this.observer.observe(this.messagesTarget, { childList: true })
    }

    this.requestPerm = this.requestPerm.bind(this)
    if ("Notification" in window && Notification.permission === "default") {
      document.addEventListener("click", this.requestPerm)
      document.addEventListener("keydown", this.requestPerm)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
    document.removeEventListener("click", this.requestPerm)
    document.removeEventListener("keydown", this.requestPerm)
  }

  scrollToBottom(smooth = false) {
    if (smooth) {
      this.element.scrollTo({ top: this.element.scrollHeight, behavior: "smooth" })
    } else {
      this.element.scrollTop = this.element.scrollHeight
    }
  }

  playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime) 
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1) 
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.3)
    } catch(e) {
      console.log("Audio notification blocked", e)
    }
  }

  requestPerm() {
    Notification.requestPermission()
    document.removeEventListener("click", this.requestPerm)
    document.removeEventListener("keydown", this.requestPerm)
  }
}
