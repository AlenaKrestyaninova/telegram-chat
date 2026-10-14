import { useCallback } from 'react';
import { useCheckAccountMutation, useSendMessageMutation } from '../api/services/greenApi';
import { useAppDispatch } from '../store/hooks';
import { chatOpened, messageAdded, messageStatusChanged } from '../store/chatsSlice';

export function useChatActions() {
  const dispatch = useAppDispatch();
  const [checkAccount] = useCheckAccountMutation();
  const [sendMessage] = useSendMessageMutation();

  /** Бросает ошибку, если номер некорректный или аккаунта MAX нет. */
  const openChat = useCallback(
    async (phone: string) => {
      const digits = phone.replace(/\D/g, '');
      if (!digits) throw new Error('Введите номер телефона');

      const result = await checkAccount(digits).unwrap();
      if (!result.exist) {
        throw new Error('На этом номере нет аккаунта');
      }

      dispatch(chatOpened({ id: result.chatId, name: `+${digits}`, phone: digits }));
    },
    [checkAccount, dispatch],
  );

  /** Оптимистичная отправка: сообщение появляется сразу, статус обновляется по ответу. */
  const send = useCallback(
    async (chatId: string, text: string) => {
      const id = crypto.randomUUID();
      dispatch(
        messageAdded({
          message: { id, chatId, text, direction: 'out', timestamp: Date.now(), status: 'sending' },
        }),
      );

      try {
        await sendMessage({ chatId, message: text }).unwrap();
        dispatch(messageStatusChanged({ chatId, id, status: 'sent' }));
      } catch {
        dispatch(messageStatusChanged({ chatId, id, status: 'error' }));
      }
    },
    [sendMessage, dispatch],
  );

  return { openChat, send };
}