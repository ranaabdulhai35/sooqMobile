import {combineReducers} from '@reduxjs/toolkit';
import storage from '@react-native-community/async-storage';
import persistReducer from 'redux-persist/es/persistReducer';
import {AuthSlice} from './slice';
import {authApiCall} from '../Apis/authApiCall';
import {productApiCall} from '../Apis/productApiCall';
import {categoriesApiCall} from '../Apis/categoriesApiCall';
import {userApiCall} from '../Apis/userApiCall';
import {cartApiCall} from '../Apis/cartApiCall';
import {orderApiCall} from '../Apis/orderApiCall';
import {reviewsApiCall} from '../Apis/reviewsApiCall';
import {favouriteApiCall} from '../Apis/favouritesApiCall';

const reducer = combineReducers({
  auth: AuthSlice.reducer,
  [authApiCall.reducerPath]: authApiCall.reducer,
  [productApiCall.reducerPath]: productApiCall.reducer,
  [categoriesApiCall.reducerPath]: categoriesApiCall.reducer,
  [userApiCall.reducerPath]: userApiCall.reducer,
  [cartApiCall.reducerPath]: cartApiCall.reducer,
  [orderApiCall.reducerPath]: orderApiCall.reducer,
  [reviewsApiCall.reducerPath]: reviewsApiCall.reducer,
  [favouriteApiCall.reducerPath]: favouriteApiCall.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['nonSerializableSlice'],
};
export const persistedReducer = persistReducer(persistConfig, reducer);
