import { useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { chatSelected, chatsReset } from '../../store/chatsSlice';
import { logout } from '../../store/authSlice';
import { useChatActions } from '../../hooks/useChatActions';
import { Avatar } from '../Avatar/Avatar';
import styles from './ChatList.module.css';
import { errorMessage } from '../../api/services/errors';

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export function ChatList() {
  const dispatch = useAppDispatch();
  const { openChat } = useChatActions();
  const { chats, messages, activeChatId } = useAppSelector((s) => s.chats);

  const [isCreating, setIsCreating] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        await openChat(phone);
        setPhone('');
        setIsCreating(false);
    } catch (err) {
        setError(errorMessage(err));
    } finally {
        setIsLoading(false);
    }
    };

  const handleLogout = () => {
    dispatch(chatsReset());
    dispatch(logout());
  };

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Чаты</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsCreating((v) => !v)}
          aria-label="Новый чат"
        >
          {isCreating ? '×' : '+'}
        </button>
      </header>

      {isCreating && (
        <form className={styles.newChat} onSubmit={handleCreate}>
          <input
            className={styles.phoneInput}
            placeholder="Номер телефона, например 79991234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoFocus
          />
          <button className={styles.createButton} type="submit" disabled={!phone.trim() || isLoading}>
            {isLoading ? 'Проверяем…' : 'Создать чат'}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      )}

      <ul className={styles.list}>
        {chats.length === 0 && <li className={styles.empty}>Чатов пока нет. Нажмите «+»</li>}
        {chats.map((chat) => {
          const last = messages[chat.id]?.at(-1);
          return (
            <li key={chat.id}>
              <button
                className={`${styles.item} ${chat.id === activeChatId ? styles.active : ''}`}
                onClick={() => dispatch(chatSelected(chat.id))}
              >
                <Avatar name={chat.name} seed={chat.id} />
                <div className={styles.info}>
                  <div className={styles.row}>
                    <span className={styles.name}>{chat.name}</span>
                    {last && <span className={styles.time}>{formatTime(last.timestamp)}</span>}
                  </div>
                  <div className={styles.preview}>{last?.text ?? 'Нет сообщений'}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <button className={styles.logout} onClick={handleLogout}>
        Выйти
      </button>
    </aside>
  );
}