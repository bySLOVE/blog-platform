import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetArticleQuery,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from './articlesApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ArticlePage.module.scss';
import { useSelector } from 'react-redux';

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const { data, isLoading, isError, error } = useGetArticleQuery(slug);
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [favoriteArticle, { isLoading: isLiking }] =
    useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnLiking }] =
    useUnfavoriteArticleMutation();
  const isProcessing = isLiking || isUnLiking;

  if (isLoading) return <p>Загрузка статьи...</p>;
  if (isError) return <p>Ошибка загрузки: {error?.status}</p>;

  const {
    title,
    body,
    author,
    updatedAt,
    tagList = [],
    favoritesCount = 0,
    favorited,
    description,
  } = data.article;

  const isAuthor = currentUser?.username === author.username;

  const handleDelete = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить статью?');
    if (!confirmed) return;

    try {
      await deleteArticle(slug).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      alert('Не удалось удалить статью');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!token) {
        alert('Войдите, чтобы поставить лайк');
        return;
      }

      if (favorited) {
        await unfavoriteArticle(slug).unwrap();
      } else {
        await favoriteArticle(slug).unwrap();
      }
    } catch (err) {
      console.error('Ошибка при лайке:', err);
      alert('Не удалось изменить лайк');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleLikeBlock}>
          <h1 className={styles.title}>{title}</h1>

          <button
            className={`${styles.likeBtn} ${favorited ? styles.liked : ''}`}
            onClick={handleToggleFavorite}
            disabled={!token || isProcessing}
          >
            {favorited ? '❤️' : '🤍'} {favoritesCount}
          </button>
        </div>

        <div className={styles.authorInfo}>
          <img
            className={styles.avatar}
            src={author.image || 'https://via.placeholder.com/46'}
            alt={author.username}
          />
          <div className={styles.authorText}>
            <div className={styles.username}>{author.username}</div>
            <div className={styles.date}>
              {new Date(updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {tagList.length > 0 && (
        <div className={styles.tags}>
          {tagList
            .filter((tag) => tag.trim() !== '')
            .map((tag, index) => (
              <span key={`${tag}-${index}`} className={styles.tag}>
                {tag}
              </span>
            ))}
        </div>
      )}

      <div className={styles.tagActions}>
        {isAuthor && (
          <div className={styles.actions}>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={styles.deleteBtn}
            >
              {isDeleting ? 'Удаление...' : 'Delete'}
            </button>
            <Link to={`/articles/${slug}/edit`} className={styles.editBtn}>
              Edit
            </Link>
          </div>
        )}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ArticlePage;
