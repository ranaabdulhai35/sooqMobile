import logger from 'redux-logger';
import {
  configureStore,
  createSlice,
  combineReducers,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {persistedReducer} from './reducer';
import {authApiCall} from '../Apis/authApiCall';
import {productApiCall} from '../Apis/productApiCall';
import {setupListeners} from '@reduxjs/toolkit/query';
import {categoriesApiCall} from '../Apis/categoriesApiCall';
import {userApiCall} from '../Apis/userApiCall';
import {userUpdateApiCall} from '../Apis/userUpdateApiCall';
import {cartApiCall} from '../Apis/cartApiCall';
import {orderApiCall} from '../Apis/orderApiCall';
import {reviewsApiCall} from '../Apis/reviewsApiCall';
import {favouriteApiCall} from '../Apis/favouritesApiCall';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false})
      // .concat(logger)
      .concat(authApiCall.middleware)
      .concat(productApiCall.middleware)
      .concat(categoriesApiCall.middleware)
      .concat(userApiCall.middleware)
      .concat(cartApiCall.middleware)
      .concat(orderApiCall.middleware)
      .concat(reviewsApiCall.middleware)
      .concat(favouriteApiCall.middleware),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
