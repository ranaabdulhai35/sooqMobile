import {TOKEN} from '@env';

export const requestHandler = request => {
  const token = TOKEN;
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
};

export const successHandler = response => {
  return {
    ...response,
    data: response.data,
  };
};
export const errorHandler = error => {
  const {status} = error.response;
  if (status === 401) {
  }
  return Promise.reject(error);
};
