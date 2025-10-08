import axios from 'axios';
import {
  requestHandler,
  successHandler,
  errorHandler,
} from './requestModifications';
import {baseUrl} from '@env';
console.log('baseUrl', baseUrl);
const HttpRequest = (
  config = {
    headers: {contentType: 'application/json'},
  },
) => {
  const instance = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
      'Content-Type': config.headers.contentType || 'application/json',
    },
  });

  instance.interceptors.request.use(requestHandler);
  instance.interceptors.response.use(successHandler, errorHandler);
  return instance;
};

export default HttpRequest();
