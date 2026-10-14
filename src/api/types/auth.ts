export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface WebhookBody {
  typeWebhook: string;
  idMessage?: string;
  timestamp?: number;
  senderData?: {
    chatId: string;
    sender: string;
    senderName?: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: { textMessage: string };
    extendedTextMessageData?: { text: string };
  };
}

export interface Notification {
  receiptId: number;
  body: WebhookBody;
}

export interface CheckAccountResult {
  exist?: boolean;
  chatId: string;
}