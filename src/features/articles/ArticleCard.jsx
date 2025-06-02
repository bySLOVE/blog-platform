import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  articlesApi,
} from './articlesApi';
import { useState, useEffect } from 'react';

const ArticleCard = ({
  slug,
  title,
  description,
  author,
  createdAt,
  likesCount = 0,
  tags = [],
  favorited = false,
  page,
}) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [favoriteArticle, { isLoading: isLiking }] =
    useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnLiking }] =
    useUnfavoriteArticleMutation();
  const isProcessing = isLiking || isUnLiking;

  const [isFavorited, setIsFavorited] = useState(favorited);
  const [count, setCount] = useState(likesCount);

  useEffect(() => {
    setIsFavorited(favorited);
    setCount(likesCount);
  }, [favorited, likesCount]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Войдите, чтобы поставить лайк');
      return;
    }

    try {
      if (isFavorited) {
        const result = await unfavoriteArticle(slug).unwrap();
        setIsFavorited(false);
        setCount((c) => c - 1);

        dispatch(
          articlesApi.util.updateQueryData('getArticles', page, (draft) => {
            const article = draft.articles.find((a) => a.slug === slug);
            if (article) {
              article.favorited = result.article.favorited;
              article.favoritesCount = result.article.favoritesCount;
            }
          }),
        );
      } else {
        const result = await favoriteArticle(slug).unwrap();
        setIsFavorited(true);
        setCount((c) => c + 1);

        dispatch(
          articlesApi.util.updateQueryData('getArticles', page, (draft) => {
            const article = draft.articles.find((a) => a.slug === slug);
            if (article) {
              article.favorited = result.article.favorited;
              article.favoritesCount = result.article.favoritesCount;
            }
          }),
        );
      }
    } catch (err) {
      console.error('Ошибка при лайке:', err);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Link to={`/articles/${slug}`} className={styles.title}>
            <h2>{title}</h2>
          </Link>

          <button
            className={styles.likes}
            onClick={handleToggleFavorite}
            disabled={isProcessing}
          >
            {isFavorited ? '❤️' : '🤍'} {count}
          </button>
        </div>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags
              .filter((tag) => tag.trim() !== '')
              .map((tag, index) => (
                <span key={`${slug}-tag-${index}`} className={styles.tag}>
                  {tag}
                </span>
              ))}
          </div>
        )}

        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.authorInfo}>
        <div className={styles.authorText}>
          <span className={styles.username}>{author.username}</span>
          <span className={styles.createdAt}>
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <img
          src={author.image || 'https://via.placeholder.com/40'}
          alt={author.username}
          className={styles.avatar}
        />
      </div>
    </div>
  );
};

export default ArticleCard;
