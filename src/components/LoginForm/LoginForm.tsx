import { useState, type FormEvent } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const canSubmit = idInstance.trim() !== '' && apiTokenInstance.trim() !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    dispatch(login({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() }));
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.hint}>Введите данные инстанса GREEN-API</p>

        <input
          className={styles.input}
          placeholder="idInstance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
        <input
          className={styles.input}
          placeholder="apiTokenInstance"
          type="password"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          autoComplete="off"
        />

        <button className={styles.button} type="submit" disabled={!canSubmit}>
          Войти
        </button>
      </form>
    </div>
  );
}