import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <div className={styles.SiteFooter}>
      <ul className={styles.links}>
        <li>
          <a
            href="https://github.com/gxxcastillo"
            target="_blank"
            rel="noreferrer"
          >
            <span role="img" aria-label="me on github" title="me on github">
              🐙
            </span>
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/gxxcastillo"
            target="_blank"
            rel="noreferrer"
          >
            <span role="img" aria-label="me on x" title="me on x">
              🐦
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SiteFooter;
