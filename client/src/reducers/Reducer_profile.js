import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  NO_REPOS
} from '../actions/types';

// ---- Inititial states ----
const initialState = {
  user_profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};


// ---- Function for create Redux store data and Swith for received action type & payload ----
export default function (state = initialState, action) {

  const { type, payload } = action;

  switch (type) {

    // get one user's profile by action_getUserProfile
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        user_profile: payload,
        loading: false
      };

    // get All users's profile by action_getProfiles
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null // reset profile
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: []
      };

    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      };

    case NO_REPOS:
      return {
        ...state,
        repos: []
      };
    default:
      return state;
  }

}
