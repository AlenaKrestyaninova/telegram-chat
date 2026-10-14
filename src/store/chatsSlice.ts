import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chat, Message } from './types';

export interface ChatsState {
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> сообщения
  activeChatId: string | null;
}

const initialState: ChatsState = { chats: [], messages: {}, activeChatId: null };

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatOpened(state, action: PayloadAction<Chat>) {
      const chat = action.payload;
      if (!state.chats.some((c) => c.id === chat.id)) {
        state.chats.push(chat);
        state.messages[chat.id] = [];
      }
      state.activeChatId = chat.id;
    },
    chatSelected(state, action: PayloadAction<string>) {
      state.activeChatId = action.payload;
    },
    messageAdded(state, action: PayloadAction<{ message: Message; senderName?: string }>) {
      const { message, senderName } = action.payload;
      if (state.messages[message.chatId]?.some((m) => m.id === message.id)) return;
      // Входящее от неизвестного собеседника: создаём чат автоматически
      if (!state.chats.some((c) => c.id === message.chatId)) {
        state.chats.push({ id: message.chatId, name: senderName ?? message.chatId });
        state.messages[message.chatId] = [];
      }
      state.messages[message.chatId].push(message);
    },
    messageStatusChanged(
      state,
      action: PayloadAction<{ chatId: string; id: string; status: Message['status'] }>,
    ) {
      const { chatId, id, status } = action.payload;
      const msg = state.messages[chatId]?.find((m) => m.id === id);
      if (msg) msg.status = status;
    },
    chatsReset() {
      return initialState;
    },
    chatsSeeded(_state, action: PayloadAction<ChatsState>) {
        return action.payload;
    },
  },
});

export const { chatOpened, chatSelected, messageAdded, messageStatusChanged, chatsReset, chatsSeeded } =
  chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;