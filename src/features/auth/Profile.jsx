import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';
import { useUpdateUserMutation } from './authApi';
import { setUser } from './authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    image: user?.image || '',
  });

  const [errors, setErrors] = useState({});
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Минимум 3 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else {
      const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = 'Некорректный email';
      }
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен быть не менее 6 символов';
      }
    }

    if (formData.image) {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Некорректный URL';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      image: formData.image.trim(),
    };
    if (formData.password) payload.password = formData.password;

    try {
      const response = await updateUser(payload).unwrap();
      dispatch(setUser(response.user));
      navigate('/');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['sign-up-form']}>
      <h2>Edit Profile</h2>

      <label className={styles.label}>
        Username
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
        />
        {errors.username && (
          <div className={styles.errorMessage}>{errors.username}</div>
        )}
      </label>

      <label className={styles.label}>
        Email address
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
        />
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}
      </label>

      <label className={styles.label}>
        New password
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
        />
        {errors.password && (
          <div className={styles.errorMessage}>{errors.password}</div>
        )}
      </label>

      <label className={styles.label}>
        Avatar image (url)
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
        />
        {errors.image && (
          <div className={styles.errorMessage}>{errors.image}</div>
        )}
      </label>

      {error && (
        <div className={styles.errorMessage}>Failed to update profile.</div>
      )}

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default Profile;
