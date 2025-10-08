import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';

export const categoriesApiCall = createApi({
  reducerPath: 'categoriesApiCall',
  baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
  endpoints: builder => ({
    getCategories: builder.query({
      query: ({lang}) => {
        return {
          url: `categories`,
          params: {lang: lang},
        };
      },
    }),
    getCategory: builder.query({
      query: ({id}) => `categories/${id}`,
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
    getSubCategories: builder.query({
      query: () => `subcategories`,
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
    getSubCategory: builder.query({
      query: () => `subcategories/${params}`,
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetSubCategoriesQuery,
  useGetSubCategoryQuery,
} = categoriesApiCall;
