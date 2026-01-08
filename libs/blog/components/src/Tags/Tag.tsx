import styles from './Tags.module.css';

export type ITags = {
  tags: string[];
};

export function Tags({ tags }: ITags) {
  return (
    <ul className={styles.Tags}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
