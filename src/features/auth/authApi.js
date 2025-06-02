import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: { user: userData },
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: userData },
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: 'user',
        method: 'PUT',
        body: { user: userData },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useUpdateUserMutation,
  useLoginUserMutation,
} = authApi;
