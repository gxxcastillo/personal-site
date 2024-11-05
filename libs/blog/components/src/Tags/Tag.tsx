import styles from './Tags.module.css';

export type ITags = {
  tags: string[];
};

export function Tags({ tags }: ITags) {
  return (
    <ul className={styles.Tags}>
      {tags.map((tag) => (
        <div key={tag}>#{tag}</div>
      ))}
    </ul>
  );
}
