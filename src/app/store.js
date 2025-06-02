import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { articlesApi } from '../features/articles/articlesApi';
import { authApi } from '../features/auth/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, articlesApi.middleware),
});
