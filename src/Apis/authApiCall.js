import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';

export const authApiCall = createApi({
  reducerPath: 'authApiCall',
  baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
  endpoints: builder => ({
    signin: builder.mutation({
      query: ({data}) => ({
        url: `auth/login`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    oAuthLoginAndRegister: builder.mutation({
      query: ({data}) => ({
        url: `auth/login/firebase`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    signup: builder.mutation({
      query: ({data}) => {
        console.error('data in payload', data);
        return {
          url: `auth/register`,
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: ({data}) => {
        console.log('data in payload', data);
        return {
          url: `auth/verify-user-otp`,
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useOAuthLoginAndRegisterMutation,
} = authApiCall;
