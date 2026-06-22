export interface SocketMessage {
  senderId: string
  receiverId: string
  text: string
  conversationId: string
}

export interface SocketTypingEvent {
  conversationId: string
  senderId: string
  receiverId: string
  isTyping: boolean
}

export interface SocketNotification {
  message: string
  link?: string
}
