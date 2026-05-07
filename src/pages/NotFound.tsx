import { useLocation } from "react-router-dom";
import styles from './NotFound.module.css';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <h1 className={styles.glyph}>
        404
      </h1>
      <div className={styles.content}>
        <h1 className={styles.title}>This page has not been generated</h1>
        <p className={styles.path}>{location.pathname}</p>
        <p className={styles.subtitle}>Tell me more about this page, so I can generate it</p>
      </div>
    </div>
  );
}
