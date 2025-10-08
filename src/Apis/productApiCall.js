import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';
export const productApiCall = createApi({
  reducerPath: 'productApiCall',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getAllProducts: builder.query({
      query: () => `products`,
    }),
    getAllAprovedProducts: builder.query({
      query: params => {
        return {
          url: `products/verified`,
          params: params,
        };
      },
    }),
    getSpecificProduct: builder.query({
      query: ({id}) => ({
        url: `products/${id}`,
        method: 'GET',
      }),
    }),
    getProductsByCategories: builder.query({
      query: id => `products/category/${id}`,
    }),
    getProductsBySubCategories: builder.query({
      query: id => `products/subcategory/${id}`,
    }),
    getProductDetails: builder.query({
      query: ({id}) => ({
        url: `products/detail/${id}`,
        method: 'GET',
      }),
      transformResponse: response => {
        return response;
      },
    }),
    searchProducts: builder.query({
      query: ({params, userId, lang}) => {
        // console.error('search params', params, userId, lang);
        return {
          url: `products/search?`,
          method: 'GET',
          params: {
            ...params,
            userId: userId,
            lang: lang,
          },
        };
      },
    }),
    getSearchHistory: builder.query({
      query: ({userId}) => ({
        url: `search-history/${userId}`,
        method: 'GET',
      }),
    }),
    deleteSearchTerm: builder.mutation({
      query: ({userId, id}) => ({
        url: `search-history/${userId}/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse: response => {
        return response;
      },
    }),
    deleteAllSearchHistory: builder.mutation({
      query: ({userId}) => ({
        url: `search-history/${userId}`,
        method: 'DELETE',
      }),
    }),
    getVendorsByLocation: builder.query({
      query: params => {
        console.error('params in api', params);
        return {
          url: `vendor/by-address`,
          method: 'GET',
          params: {
            ...params,
          },
        };
      },
    }),
    getVendorProducts: builder.query({
      query: (id, params, lang) => ({
        url: `products/vendor/${id}`,
        method: 'GET',
        params: {
          ...params,
          lang,
        },
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSpecificProductQuery,
  useGetProductsByCategoriesQuery,
  useGetProductsBySubCategoriesQuery,
  useGetProductDetailsQuery,
  useSearchProductsQuery,
  useGetAllAprovedProductsQuery,
  useGetSearchHistoryQuery,
  useDeleteAllSearchHistoryMutation,
  useDeleteSearchTermMutation,
  useLazyGetProductsByCategoriesQuery,
  useLazyGetProductsBySubCategoriesQuery,
  useLazyGetVendorsByLocationQuery,
  useLazyGetVendorProductsQuery,
  useLazyGetAllAprovedProductsQuery,
} = productApiCall;

export const {prefetch} = productApiCall.util;
