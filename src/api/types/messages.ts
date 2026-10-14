export interface MessageRequest {
  chatId: string;
  message: string;
  typingTime?: number;
  quotedMessageId?: string;
}

export interface MessageResponse {
  idMessage: string;
}