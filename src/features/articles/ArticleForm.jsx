import React, { useState, useEffect } from 'react';
import styles from './CreateArticlePage.module.scss';

const ArticleForm = ({
  initialValues = {},
  onSubmit,
  isLoading,
  serverError,
}) => {
  const [form, setForm] = useState(() => {
    const tags = Array.isArray(initialValues.tagList)
      ? initialValues.tagList
      : typeof initialValues.tagList === 'string'
        ? initialValues.tagList
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [''];

    return {
      title: '',
      description: '',
      body: '',
      ...initialValues,
      tagList: tags.length > 0 ? tags : [''],
    };
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const tags = Array.isArray(initialValues.tagList)
      ? initialValues.tagList
      : typeof initialValues.tagList === 'string'
        ? initialValues.tagList
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [''];

    setForm((prev) => ({
      ...prev,
      ...initialValues,
      tagList: tags.length > 0 ? tags : [''],
    }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      }
      return prevErrors;
    });
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...form.tagList];
    updatedTags[index] = value;
    setForm((prev) => ({ ...prev, tagList: updatedTags }));
  };

  const addTag = () => {
    setForm((prev) => ({ ...prev, tagList: [...prev.tagList, ''] }));
  };

  const removeTag = (index) => {
    setForm((prev) => ({
      ...prev,
      tagList: prev.tagList.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Введите заголовок';
    if (!form.description.trim()) newErrors.description = 'Введите описание';
    if (!form.body.trim()) newErrors.body = 'Введите текст статьи';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const preparedData = {
      title: form.title,
      description: form.description,
      body: form.body,
      tagList: form.tagList.map((tag) => tag.trim()).filter(Boolean),
    };

    onSubmit(preparedData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>
        {initialValues && initialValues.title
          ? 'Edit article'
          : 'Create new article'}
      </h2>

      <label className={styles.label}>
        Title
        <input
          className={`${styles.input} ${errors.title ? styles.errorInput : ''}`}
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        {errors.title && <div className={styles.error}>{errors.title}</div>}
      </label>

      <label className={styles.label}>
        Short description
        <input
          className={`${styles.input} ${
            errors.description ? styles.errorInput : ''
          }`}
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short description"
        />
        {errors.description && (
          <div className={styles.error}>{errors.description}</div>
        )}
      </label>

      <label className={styles.label}>
        Text
        <textarea
          className={`${styles.textarea} ${errors.body ? styles.errorInput : ''}`}
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Text"
        />
        {errors.body && <div className={styles.error}>{errors.body}</div>}
      </label>

      <label className={styles.label}>
        Tags
        {form.tagList.map((tag, index) => (
          <div key={index} className={styles.tagRow}>
            <input
              className={styles.input}
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeTag(index)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
            {index === form.tagList.length - 1 && (
              <button
                type="button"
                onClick={addTag}
                className={styles.addButton}
              >
                Add Tag
              </button>
            )}
          </div>
        ))}
      </label>

      {serverError?.data?.errors && (
        <ul className={styles.errorList}>
          {Object.entries(serverError.data.errors).map(([key, value]) => (
            <li key={key}>
              {key}:{' '}
              {Array.isArray(value)
                ? value.join(', ')
                : typeof value === 'object'
                  ? JSON.stringify(value)
                  : value}
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Send'}
      </button>
    </form>
  );
};

export default ArticleForm;
