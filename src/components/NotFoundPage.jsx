import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>404 — Страница не найдена</h2>
      <p className={styles.text}>Кажется, вы зашли не туда...</p>
      <button onClick={() => navigate('/')} className={styles.button}>
        Вернуться на главную
      </button>
    </div>
  );
};

export default NotFoundPage;
