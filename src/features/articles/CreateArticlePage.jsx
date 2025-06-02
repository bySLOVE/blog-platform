import React, { useState } from 'react';
import { useAddArticleMutation } from './articlesApi';
import { useNavigate } from 'react-router-dom';
import styles from './CreateArticlePage.module.scss';

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [addArticle, { isLoading, error }] = useAddArticleMutation();

  const [form, setForm] = useState({
    title: '',
    description: '',
    body: '',
  });

  const [tags, setTags] = useState([{ id: Date.now(), value: '' }]);
  const [errors, setErrors] = useState({});

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

  const handleTagChange = (id, value) => {
    setTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, value } : tag)),
    );
  };

  const handleAddTag = (index) => {
    const newTag = { id: Date.now() + Math.random(), value: '' };
    const updatedTags = [...tags];
    updatedTags.splice(index + 1, 0, newTag);
    setTags(updatedTags);
  };

  const handleDeleteTag = (id) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Введите заголовок';
    if (!form.description.trim()) newErrors.description = 'Введите описание';
    if (!form.body.trim()) newErrors.body = 'Введите текст статьи';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await addArticle({
        ...form,
        tagList: tags.map((tag) => tag.value.trim()).filter(Boolean),
      }).unwrap();

      const slug = response.article.slug;
      navigate(`/articles/${slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create new article</h2>

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
            placeholder="Title"
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
          {tags.map((tag, index) => (
            <div key={tag.id} className={styles.tagRow}>
              <input
                className={styles.input}
                type="text"
                value={tag.value}
                onChange={(e) => handleTagChange(tag.id, e.target.value)}
                placeholder="Tag"
              />
              <button
                type="button"
                onClick={() => handleDeleteTag(tag.id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
              {index === tags.length - 1 && tag.value.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => handleAddTag(index)}
                  className={styles.addButton}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </label>

        {error?.data?.errors && (
          <ul className={styles.errorList}>
            {Object.entries(error.data.errors).map(([key, value]) => (
              <li key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticlePage;
