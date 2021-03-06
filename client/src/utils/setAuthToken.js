import AxiosApi from './api';



const setAuthToken = token => {
  if (token) {
    AxiosApi.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete AxiosApi.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
