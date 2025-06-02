import React from 'react';
import styles from './SignIn.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginUserMutation } from './authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './authSlice';

const SignIn = () => {
  const user = useSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '',
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [serverErrors, setServerErrors] = React.useState({});

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();

      localStorage.setItem('token', response.user.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch(setUser(response.user));
      navigate('/articles');
    } catch (err) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
    }
  };

  const inputClass = (field) =>
    `${styles.input} ${errors[field] ? styles.inputError : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['sign-in-form']}>
      <h2>Sign In</h2>

      <label className={styles.label}>
        Email address
        <input
          placeholder="Email address"
          className={inputClass('email')}
          {...register('email', {
            required: 'Введите email',
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Некорректный email',
            },
          })}
        />
        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}
        {serverErrors.email && (
          <p className={styles.errorMessage}>{serverErrors.email.join(', ')}</p>
        )}
      </label>

      <label className={styles.label}>
        Password
        <input
          type="password"
          placeholder="Password"
          className={inputClass('password')}
          {...register('password', {
            required: 'Введите пароль',
          })}
        />
        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
        {serverErrors['email or password'] && (
          <p className={styles.errorMessage}>Неверный email или пароль</p>
        )}
      </label>

      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className={styles.bottomText}>
        Don’t have an account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </form>
  );
};

export default SignIn;
