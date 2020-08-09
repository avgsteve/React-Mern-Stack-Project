import {
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  // REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,

} from '../actions/types';

// =====================================

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true, // will be false once the user data is fetched
  user: null
};
// =====================================

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };


    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token); // get token from payload
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };


    // case REGISTER_FAIL:
    //   //localStorage.removeItem('token') // remove token from localStorage
    //   return {
    //     ...state,
    //     token: null,
    //     isAuthenticated: false,
    //     loading: false
    //   };


    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };


    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };

    // REGISTER_FAIL,
    // case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT: {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    }
    default:
      return state;
  }
}
