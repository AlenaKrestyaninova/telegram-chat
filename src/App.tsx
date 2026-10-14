import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { chatsSeeded } from './store/chatsSlice';
import { mockState } from './mocks';
import { LoginForm } from './components/LoginForm/LoginForm';
import { ChatList } from './components/ChatList/ChatList';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import styles from './App.module.css';
import { useWatchIncomingQuery } from './api/services/incoming';
import { skipToken } from '@reduxjs/toolkit/query';

export default function App() {
  const dispatch = useAppDispatch();
  const credentials = useAppSelector((s) => s.auth.credentials);

  useWatchIncomingQuery(credentials?.idInstance ?? skipToken);

  useEffect(() => {
    if (credentials && import.meta.env.VITE_USE_MOCKS === 'true') {
      dispatch(chatsSeeded(mockState));
    }
  }, [credentials, dispatch]);

  if (!credentials) return <LoginForm />;

  return (
    <div className={styles.layout}>
      <ChatList />
      <ChatWindow />
    </div>
  );
}