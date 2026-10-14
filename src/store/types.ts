export interface Chat {
  id: string;        // chatId из MAX
  name: string;      // пока что номер телефона или chatId
  phone?: string;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  direction: 'in' | 'out';
  timestamp: number; // мс
  status?: 'sending' | 'sent' | 'error';
}