import type { ChatsState } from './store/chatsSlice';

const now = Date.now();
const min = 60_000;

export const mockState: ChatsState = {
  chats: [
    { id: '10000001', name: 'Михаил Степашкин', phone: '79990000001' },
    { id: '10000002', name: 'Анна', phone: '79990000002' },
  ],
  messages: {
    '10000001': [
      { id: 'm1', chatId: '10000001', text: 'Михаил, привет, как дела?:)', direction: 'out', timestamp: now - 30 * min, status: 'sent' },
      { id: 'm2', chatId: '10000001', text: 'Привет! Всё хорошо, а у тебя?', direction: 'in', timestamp: now - 28 * min },
    ],
    '10000002': [
      { id: 'm3', chatId: '10000002', text: 'Ты видела задание?', direction: 'in', timestamp: now - 120 * min },
    ],
  },
  activeChatId: '10000001',
};