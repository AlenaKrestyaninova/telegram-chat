import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { CheckAccountResult, Credentials, Notification } from '../types/auth';

interface ApiArgs {
  method: string; // имя метода GREEN-API, например "sendMessage"
  httpMethod?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  pathSuffix?: string; // для deleteNotification: "/{receiptId}"
  params?: Record<string, string | number>;
}

// Хост инстанса: "3100309139" -> https://3100.api.green-api.com
// Проверь в личном кабинете, что у тебя именно так.
const getBaseUrl = ({ idInstance }: Credentials) =>
  `https://${idInstance.slice(0, 4)}.api.green-api.com/waInstance${idInstance}`;

const baseQuery: BaseQueryFn<ApiArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // Минимальный cast вместо RootState, чтобы не получить циклическую типизацию со стором
  const credentials = (api.getState() as { auth: { credentials: Credentials | null } }).auth
    .credentials;

  if (!credentials) {
    return { error: { status: 'CUSTOM_ERROR', error: 'Нет учётных данных' } };
  }

  const { method, httpMethod = 'GET', body, pathSuffix = '', params } = args;

  return fetchBaseQuery({ baseUrl: getBaseUrl(credentials) })(
    {
      url: `/${method}/${credentials.apiTokenInstance}${pathSuffix}`,
      method: httpMethod,
      body,
      params,
    },
    api,
    extraOptions,
  );
};

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery,
  endpoints: (build) => ({
    /** Номер телефона -> chatId. Если аккаунта MAX нет, exist === false. */
    checkAccount: build.mutation<CheckAccountResult, string>({
      query: (phone) => ({
        method: 'checkAccount',
        httpMethod: 'POST',
        body: { phoneNumber: Number(phone) }, // только цифры, API требует число
      }),
    }),

    sendMessage: build.mutation<{ idMessage: string }, { chatId: string; message: string }>({
      query: (body) => ({ method: 'sendMessage', httpMethod: 'POST', body }),
    }),

    /** Long polling: сервер держит запрос до receiveTimeout секунд. Вернёт null, если пусто. */
    receiveNotification: build.query<Notification | null, void>({
      query: () => ({ method: 'receiveNotification', params: { receiveTimeout: 10 } }),
      keepUnusedDataFor: 0,
    }),

    deleteNotification: build.mutation<{ result: boolean }, number>({
      query: (receiptId) => ({
        method: 'deleteNotification',
        httpMethod: 'DELETE',
        pathSuffix: `/${receiptId}`,
      }),
    }),
  }),
});

export const { useCheckAccountMutation, useSendMessageMutation } = greenApi;