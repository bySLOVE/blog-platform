import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const defaultAvatarUrl =
  'https://cdn.iz.ru/sites/default/files/styles/900x600/public/photo_item-2017-08/1502184447.jpg?itok=rFnPC0If';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <NavLink
        to="/articles"
        className={({ isActive }) =>
          isActive ? `${styles.logo} ${styles.activeLink}` : styles.logo
        }
      >
        Realworld Blog
      </NavLink>

      <nav className={styles.nav}>
        {user ? (
          <>
            <NavLink
              to="/new-article"
              className={({ isActive }) =>
                isActive
                  ? `${styles.userLink} ${styles.activeLink}`
                  : styles.userLink
              }
            >
              Create article
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? `${styles.userLink} ${styles.activeLink}`
                  : styles.userLink
              }
            >
              <span>{user.username}</span>
              <img
                src={user.image || defaultAvatarUrl}
                alt="avatar"
                className={styles.avatar}
              />
            </NavLink>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
            >
              Sign In
            </NavLink>
            <NavLink
              to="/sign-up"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
            >
              Sign Up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
