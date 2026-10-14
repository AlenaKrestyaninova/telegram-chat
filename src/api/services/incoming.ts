import { greenApi } from './greenApi';
import { messageAdded } from '../../store/chatsSlice';
import type { Message } from '../../store/types';
import type { WebhookBody } from '../types/auth';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Оставляем только входящие текстовые сообщения, остальное игнорируем. */
function toIncomingMessage(body: WebhookBody): { message: Message; senderName?: string } | null {
  if (body.typeWebhook !== 'incomingMessageReceived') return null;

  const data = body.messageData;
    const text =
    data?.typeMessage === 'textMessage'
        ? data.textMessageData?.textMessage
        : data?.typeMessage === 'extendedTextMessage'
        ? data.extendedTextMessageData?.text
        : undefined;

    if (!text) return null;
    if (!body.senderData || !body.idMessage) return null;

  return {
    message: {
      id: body.idMessage,
      chatId: body.senderData.chatId,
      text,
      direction: 'in',
      timestamp: (body.timestamp ?? Date.now() / 1000) * 1000,
    },
    senderName: body.senderData.senderName,
  };
}

const incomingApi = greenApi.injectEndpoints({
  endpoints: (build) => ({
    // Аргумент - idInstance: при смене инстанса создаётся новая запись кэша и новый цикл.
    // queryFn ничего не запрашивает: вся работа происходит в onCacheEntryAdded.
    watchIncoming: build.query<null, string>({
      queryFn: () => ({ data: null }),
      keepUnusedDataFor: 1,

      async onCacheEntryAdded(_idInstance, { dispatch, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded;

        let stopped = false;
        let current: { abort: () => void } | null = null;

        // Срабатывает, когда на запись больше никто не подписан (выход, размонтирование)
        void cacheEntryRemoved.then(() => {
          stopped = true;
          current?.abort();
        });

        while (!stopped) {
          const request = dispatch(
            greenApi.endpoints.receiveNotification.initiate(undefined, {
              forceRefetch: true,
              subscribe: false,
            }),
          );
          current = request;

          try {
            const notification = await request.unwrap();
            if (!notification) continue; // очередь пуста, сразу ждём следующее

            // TODO: убрать после проверки на реальном аккаунте
            console.debug('[GREEN-API] notification', notification);

            const incoming = toIncomingMessage(notification.body);
            if (incoming) dispatch(messageAdded(incoming));

            // Удаляем всегда, даже если уведомление проигнорировали, иначе оно придёт снова
            await dispatch(
              greenApi.endpoints.deleteNotification.initiate(notification.receiptId),
            ).unwrap();
          } catch {
            if (stopped) break;
            await sleep(3000); // ошибка сети или API: не долбим сервер в цикле
          }
        }
      },
    }),
  }),
});

export const { useWatchIncomingQuery } = incomingApi;