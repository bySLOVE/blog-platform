import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetArticleQuery, useUpdateArticleMutation } from './articlesApi';
import ArticleForm from './ArticleForm';
import styles from './CreateArticlePage.module.scss';

const EditArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  const {
    data,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
    error: errorArticle,
  } = useGetArticleQuery(slug);

  const [updateArticle, { isLoading, error }] = useUpdateArticleMutation();

  useEffect(() => {
    if (data && currentUser) {
      const isAuthor = currentUser.username === data.article.author.username;
      if (!isAuthor) {
        navigate('/', { replace: true });
      }
    }
  }, [data, currentUser, navigate]);

  if (isLoadingArticle)
    return <p className={styles.loading}>Загрузка статьи...</p>;
  if (isErrorArticle)
    return (
      <p className={styles.error}>Ошибка загрузки: {errorArticle?.status}</p>
    );

  const article = data?.article;
  if (!article) return <p className={styles.error}>Статья не найдена</p>;

  const handleSubmit = async (formData) => {
    try {
      await updateArticle({ slug, article: formData }).unwrap();
      navigate(`/articles/${slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <ArticleForm
        initialValues={{
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        serverError={error}
      />
    </div>
  );
};

export default EditArticlePage;
