import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';
export const userApiCall = createApi({
  reducerPath: 'userApiCall',
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
  tagTypes: ['getUser'],

  endpoints: builder => ({
    getUserDetails: builder.query({
      query: ({userId}) => {
        return `user/${userId}`;
      },
      providesTags: ['getUser'],
    }),
    updateUser: builder.mutation({
      query: ({userId, data}) => ({
        url: `user/update/${userId}`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
    updateUserPassword: builder.mutation({
      query: (params, data) => ({
        url: `/user/${params}/password`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useLazyGetUserDetailsQuery,
} = userApiCall;
