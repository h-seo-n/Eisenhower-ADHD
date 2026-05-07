import styles from './page.module.css';

export default function Home() {
  return (
    // This is the template home page, please edit from this page
    <div className={styles.container}>
      <p className={styles.hint}>You can switch pages using this dropdown menu ⬆️</p>
      <div className={styles.content}>
        <h1 className={styles.title}>This is homepage, but there is no content yet</h1>
        <p className={styles.subtitle}>Tell me more about homepage, so I can generate it</p>
      </div>
    </div>
  );
}
