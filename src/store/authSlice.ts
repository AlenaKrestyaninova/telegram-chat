import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Credentials } from '../api/types/auth';

export const CREDENTIALS_KEY = 'max-chat:credentials';

function loadCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? (JSON.parse(raw) as Credentials) : null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { credentials: loadCredentials() } as { credentials: Credentials | null },
  reducers: {
    login(state, action: PayloadAction<Credentials>) {
      state.credentials = action.payload;
    },
    logout(state) {
      state.credentials = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;