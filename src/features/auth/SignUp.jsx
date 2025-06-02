import React from 'react';
import styles from './SignUp.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterUserMutation } from './authApi';
import { setUser } from './authSlice';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [serverErrors, setServerErrors] = React.useState({});

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      }).unwrap();

      localStorage.setItem('token', response.user.token);
      navigate('/articles');
      dispatch(setUser(response.user));
    } catch (err) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
    }
  };

  const inputClass = (fieldName) =>
    `${styles.input} ${errors[fieldName] ? styles.inputError : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['sign-up-form']}>
      <h2>Create new account</h2>

      <label className={styles.label}>
        Username
        <input
          placeholder="Username"
          className={inputClass('username')}
          {...register('username', {
            required: 'Имя пользователя обязательно',
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: { value: 20, message: 'Максимум 20 символов' },
          })}
        />
        {errors.username && (
          <p className={styles.errorMessage}>{errors.username.message}</p>
        )}
        {serverErrors.username && (
          <p className={styles.errorMessage}>
            {Array.isArray(serverErrors.username)
              ? serverErrors.username.join(', ')
              : serverErrors.username}
          </p>
        )}
      </label>

      <label className={styles.label}>
        Email address
        <input
          placeholder="Email address"
          className={inputClass('email')}
          {...register('email', {
            required: 'Введите email',
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Введите корректный email',
            },
          })}
        />
        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}
        {serverErrors.email && (
          <p className={styles.errorMessage}>
            {Array.isArray(serverErrors.email)
              ? serverErrors.email.join(', ')
              : serverErrors.email}
          </p>
        )}
      </label>

      <label className={styles.label}>
        Password
        <input
          placeholder="Password"
          type="password"
          className={inputClass('password')}
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: { value: 6, message: 'Минимум 6 символов' },
            maxLength: { value: 40, message: 'Максимум 40 символов' },
          })}
        />
        {serverErrors.password && (
          <p className={styles.errorMessage}>
            {Array.isArray(serverErrors.password)
              ? serverErrors.password.join(', ')
              : serverErrors.password}
          </p>
        )}
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </label>

      <label className={styles.label}>
        Repeat Password
        <input
          placeholder="Password"
          type="password"
          className={inputClass('repeatPassword')}
          {...register('repeatPassword', {
            required: 'Подтвердите пароль',
            validate: (value) => value === password || 'Пароли не совпадают',
          })}
        />
        {errors.repeatPassword && (
          <p className={styles.errorMessage}>{errors.repeatPassword.message}</p>
        )}
      </label>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkboxInput}
          {...register('agree', {
            required: 'Вы должны согласиться с условиями',
          })}
        />
        I agree to the processing of my personal information
      </label>
      {errors.agree && (
        <p className={styles.errorMessage}>{errors.agree.message}</p>
      )}

      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? 'Регистрация...' : 'Create'}
      </button>
      <p className={styles.switchLink}>
        Already have an account? <Link to="/sign-in">Sign In.</Link>
      </p>
    </form>
  );
};

export default SignUp;
