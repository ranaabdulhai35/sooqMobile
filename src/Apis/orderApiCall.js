import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';

export const orderApiCall = createApi({
  reducerPath: 'orderApiCall',
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
    createOrder: builder.mutation({
      query: ({data}) => {
        console.log('data payload in api', data);
        return {
          url: `orders/create`,
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getOrders: builder.query({
      query: ({id, statusParam, page, limit}) => ({
        url: `orders/user/${id}`,
        method: 'GET',
        params: {status: statusParam, page: page, limit: limit},
      }),
    }),
    preparInvoice: builder.mutation({
      query: ({data}) => {
        return {
          url: 'prepare-invoice',
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    getShipmentDetails: builder.query({
      query: () => 'shipment-details',
    }),
    validateCoupon: builder.mutation({
      query: ({data}) => {
        return {
          url: 'cart/validate',
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
  useCreateOrderMutation,
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetShipmentDetailsQuery,
  usePreparInvoiceMutation,
  useValidateCouponMutation,
} = orderApiCall;
