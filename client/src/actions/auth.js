import AxiosApi from '../utils/api';
import { action_setAlert } from './action_alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,//
  AUTH_ERROR,//
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';



// Load User Info (after user login & register)
export const action_loadUser = () => async dispatch => {

  console.log('action_loadUser is executed!');


  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {

    const res = await AxiosApi.get('/auth'); //  API authentication endpoint

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });


  } catch (err) {

    dispatch({
      type: AUTH_ERROR
    });

  }

};



// Register User
export const action_register = formData => async dispatch => {

  try {
    const res = await AxiosApi.post('/users', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(action_loadUser()); // use action_loadUser to get User's info from API

  } catch (err) {

    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};



// Login User
export const action_login = (email, password) => async dispatch => {

  const body = { email, password };

  console.log("action_login started");

  // If login is successful, get user's info
  try {
    const res = await AxiosApi.post('/auth', body);

    console.log("action_login has got response from backend server");

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // User's info from API
    dispatch(action_loadUser());

    // If login is failed, get user's info, set alert & clear user's token
  } catch (err) {
    const errors = err.response.data.errors;

    console.log("\n\naction_login has got error from backend server: ", err);


    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};


// Logout
export const action_Auth_logout = () => ({ type: LOGOUT });
