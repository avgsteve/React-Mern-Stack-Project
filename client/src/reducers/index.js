import { combineReducers } from 'redux';
import alert from './alert';
import auth from './Reducer_auth';
import profile from './profile';
import post from './post';

// Combine all Reducers into one file

// For creating global state in store.js
export default combineReducers({
  alert,
  auth,
  profile,
  post
});