import React from 'react';
import styles from './Pagination.module.scss';

const Pagination = ({
  currentPage,
  totalItems,
  pageSize = 5,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];

  pages.push(1);

  const addEllipsis = (key) => (
    <span key={key} className="ellipsis">
      ...
    </span>
  );

  let startPage = currentPage - 2;
  let endPage = currentPage + 2;

  if (startPage <= 2) {
    startPage = 2;
    endPage = Math.min(5, totalPages - 1);
  }

  if (endPage >= totalPages - 1) {
    endPage = totalPages - 1;
    startPage = Math.max(totalPages - 4, 2);
  }

  if (startPage > 2) {
    pages.push(addEllipsis('start-ellipsis'));
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push(addEllipsis('end-ellipsis'));
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      {pages.map((page) =>
        typeof page === 'number' ? (
          <button
            key={page}
            className={styles.button}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ) : (
          <span key={page.key} className={styles.ellipsis}>
            ...
          </span>
        ),
      )}

      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
