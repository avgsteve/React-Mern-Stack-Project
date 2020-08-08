import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';

const AxiosApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
/**
 intercept any error responses from the AxiosApi
 and check if the token is no longer valid.
 ie. Token has expired
 logout the user if the token has expired
**/

AxiosApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response.data.msg === 'Token is not valid') {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export default AxiosApi;
