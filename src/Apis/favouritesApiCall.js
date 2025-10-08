import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '@env';
export const favouriteApiCall = createApi({
  reducerPath: 'favouriteApiCall',
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
    getFavourites: builder.query({
      query: ({userId, lang}) => ({
        url: `wishlist/${userId}`,
        method: 'GET',
        params: {
          lang: lang,
        },
      }),
    }),
    addProductToFavourites: builder.mutation({
      query: ({userId, id}) => ({
        url: `wishlist/${userId}/add`,
        method: 'POST',
        body: {productId: id},
      }),
    }),
    deleteProductFromFavourites: builder.mutation({
      query: ({userId, id}) => ({
        url: `wishlist/${userId}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFavouritesQuery,
  useAddProductToFavouritesMutation,
  useDeleteProductFromFavouritesMutation,
} = favouriteApiCall;
