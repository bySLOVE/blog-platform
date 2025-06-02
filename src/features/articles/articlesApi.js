import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
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
  tagTypes: ['Articles'],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (page = 1) => `articles?limit=5&offset=${(page - 1) * 5}`,
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ slug }) => ({
                type: 'Articles',
                id: slug,
              })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
    }),
    getArticle: builder.query({
      query: (slug) => `articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Articles', id: slug }],
    }),
    addArticle: builder.mutation({
      query: (articleData) => ({
        url: 'articles',
        method: 'POST',
        body: { article: articleData },
      }),
      invalidatesTags: ['Articles'],
    }),
    updateArticle: builder.mutation({
      query: ({ slug, article }) => ({
        url: `articles/${slug}`,
        method: 'PUT',
        body: { article },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
    favoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' },
      ],
    }),

    unfavoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} = articlesApi;
