import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';

export const reviewsApiCall = createApi({
  reducerPath: 'reviewsApiCall',
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
    addReview: builder.mutation({
      query: ({id, data}) => ({
        url: `reviews/add/${id}`,
        method: 'POST',
        body: data,
      }),
    }),
    getReviews: builder.query({
      query: ({id, page, limit}) => ({
        url: `reviews/product/${id}/reviews`,
        method: 'GET',
        params: {page: page, limit: limit},
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {useAddReviewMutation, useGetReviewsQuery} = reviewsApiCall;
