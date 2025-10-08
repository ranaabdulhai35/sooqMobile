import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';

export const cartApiCall = createApi({
  reducerPath: 'cartApiCall',
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
    addToCart: builder.mutation({
      query: ({data}) => ({
        url: `cart/add-to-cart`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
    subtractFromCart: builder.mutation({
      query: ({data}) => ({
        url: `cart/subtract-from-cart`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
    removeFromCart: builder.mutation({
      query: ({userId, itemId}) => {
        console.log('params in api', userId, itemId);
        return {
          url: `cart/${userId}/remove/${itemId}`,
          method: 'DELETE',
        };
      },
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
    getCart: builder.query({
      query: ({id}) => ({
        url: `cart/${id}`,
        method: 'GET',
      }),
      transformErrorResponse: (response, meta, arg) => response.error,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useSubtractFromCartMutation,
} = cartApiCall;
