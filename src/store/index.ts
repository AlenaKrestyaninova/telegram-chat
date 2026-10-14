import { configureStore } from '@reduxjs/toolkit';
import { authReducer, CREDENTIALS_KEY } from './authSlice';
import { chatsReducer } from './chatsSlice';
import { greenApi } from '../api/services/greenApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    [greenApi.reducerPath]: greenApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
});

// Сохраняем креды в localStorage вне редьюсера, чтобы редьюсеры остались чистыми
store.subscribe(() => {
  const { credentials } = store.getState().auth;
  try {
    if (credentials) localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    else localStorage.removeItem(CREDENTIALS_KEY);
  } catch {
    /* localStorage может быть недоступен, это не критично */
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;