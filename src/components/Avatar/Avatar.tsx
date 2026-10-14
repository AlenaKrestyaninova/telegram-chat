import styles from './Avatar.module.css';

const COLORS = ['#f2994a', '#27ae60', '#2f80ed', '#9b51e0', '#eb5757', '#00a8b5'];

function colorFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

interface Props {
  name: string;
  seed: string;
  size?: number;
}

export function Avatar({ name, seed, size = 48 }: Props) {
  // Для номеров вида "+7999..." берём цифру/плюс, для имён - первую букву
  const letter = name.replace(/^\+/, '').charAt(0).toUpperCase();
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, background: colorFor(seed), fontSize: size * 0.42 }}
    >
      {letter}
    </div>
  );
}