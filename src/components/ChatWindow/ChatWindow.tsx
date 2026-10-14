import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Avatar } from '../Avatar/Avatar';
import { MessageInput } from '../MessageInput/MessageInput';
import styles from './ChatWindow.module.css';

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export function ChatWindow() {
  const { chats, messages, activeChatId } = useAppSelector((s) => s.chats);
  const chat = chats.find((c) => c.id === activeChatId);
  const list = (activeChatId && messages[activeChatId]) || [];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [list.length, activeChatId]);

  if (!chat) {
    return (
      <main className={`${styles.window} ${styles.background}`}>
        <div className={styles.placeholder}>Выберите чат или создайте новый</div>
      </main>
    );
  }

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        <Avatar name={chat.name} seed={chat.id} size={40} />
        <div className={styles.headerName}>{chat.name}</div>
      </header>

      <div className={`${styles.messages} ${styles.background}`}>
        {list.map((m) => (
          <div
            key={m.id}
            className={`${styles.bubble} ${m.direction === 'out' ? styles.out : styles.in}`}
          >
            <span className={styles.text}>{m.text}</span>
            <span className={styles.meta}>
              {formatTime(m.timestamp)}
              {m.direction === 'out' && m.status === 'sent' && ' ✓'}
              {m.status === 'error' && ' !'}
              {m.status === 'sending' && ' …'}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={chat.id} />
    </main>
  );
}