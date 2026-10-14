import { useState, type FormEvent } from 'react';
import { useChatActions } from '../../hooks/useChatActions';
import styles from './MessageInput.module.css';

export function MessageInput({ chatId }: { chatId: string }) {
  const { send } = useChatActions();
  const [text, setText] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await send(chatId, trimmed);
  };

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Сообщение"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.send} type="submit" disabled={!text.trim()} aria-label="Отправить">
        ↑
      </button>
    </form>
  );
}