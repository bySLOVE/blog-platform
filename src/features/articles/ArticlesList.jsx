import { useSearchParams } from 'react-router-dom';
import { useGetArticlesQuery } from './articlesApi';
import Pagination from '../../components/Pagination';
import styles from './ArticlesList.module.scss';
import ArticleCard from './ArticleCard';
import React from 'react';

const ArticlesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const { data, isLoading, isError, error } = useGetArticlesQuery(page);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка: {error?.status || 'Неизвестная ошибка'}</p>;
  return (
    <div className={styles.container}>
      {data.articles.map((article) => (
        <ArticleCard
          key={article.slug}
          slug={article.slug}
          title={article.title}
          description={article.description}
          author={article.author}
          createdAt={article.createdAt}
          likesCount={article.favoritesCount}
          tags={article.tagList}
          favorited={article.favorited}
          page={page}
        />
      ))}

      <Pagination
        currentPage={page}
        pageSize={5}
        totalItems={data.articlesCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ArticlesList;
