import AxiosApi from '../utils/api';
import {
  action_setAlert
} from './action_alert';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
  NO_REPOS
} from './types';

// Get current users profile in <Dashboard />  <ProfileForm /> 
export const action_getUserProfile = () => async dispatch => {

  try {

    const res = await AxiosApi.get('/profile/my_profile');

    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile

    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Get all profiles
export const action_getProfiles = () => async dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });

  try {
    const res = await AxiosApi.get('/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data.profiles
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Get profile by ID
export const getProfileById = userId => async dispatch => {

  try {
    const res = await AxiosApi.get(`/profile/user/${userId}`);

    console.log("In getProfileById:", res.data.user_profile_by_id);

    dispatch({

      type: GET_PROFILE,
      payload: res.data.user_profile_by_id

    });

  } catch (err) {

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Get Github repos
export const action_getGithubRepos = username => async dispatch => {

  //#### DEBUG
  console.log('\n\nLog of action_getGithubRepos:');

  try {
    const res = await AxiosApi.get(`/profile/github/${username}`);

    //#### DEBUG
    console.log('\nLog of getGithubRepos for res:', res.data.user_repos);

    dispatch({
      type: GET_REPOS,
      payload: res.data.user_repos
    });


  } catch (err) {
    dispatch({
      type: NO_REPOS
    });
  }
};

// Create or update profile
export const action_createProfile = (

  data_from_CreateProfileForm,
  history,
  edit = false

) => async dispatch => {

  console.log("\naction_createProfile is called!\n");

  try {
    const res = await AxiosApi.post('/profile', data_from_CreateProfileForm);

    // console.log("\nThe result of action_createProfile:\n", res);

    dispatch({
      type: GET_PROFILE,
      payload: res.data.updated_profile
    });

    // DISPLAY ALERT MESSAGE
    dispatch(
      action_setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
    );

    if (!edit) { // after creating new profile, redirect  to dashboard
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.message, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};


// Create or update profile
export const action_udpateProfile = (
  updated_formData,
  history,
  edit = true
) => async dispatch => {

  console.log("\naction_createProfile is called!\n");

  try {
    const res = await AxiosApi.post('/profile', updated_formData);

    console.log("\nThe result of action_createProfile:\n", res);


    dispatch({
      type: GET_PROFILE,
      payload: res.data.updated_profile
    });

    dispatch(
      action_setAlert('Profile Updated', 'success')
    );

    if (edit) {
      history.push('/dashboard');
    }

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.message, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};


// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const res = await AxiosApi.put('/profile/experience', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.updated_profile
    });

    dispatch(action_setAlert('Experience Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.message, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await AxiosApi.delete(`/profile/experience/${id}`);

    // After sending DELETE REQ to Backend, API will send obj with property "updated_profile" which has updated user profile document
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.updated_profile
    });

    dispatch(action_setAlert('Experience Removed', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};


// Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const res = await AxiosApi.put('/profile/education', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.updated_profile
    });

    dispatch(action_setAlert('Education Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(action_setAlert(error.message, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};




// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await AxiosApi.delete(`/profile/education/${id}`);


    dispatch({
      type: UPDATE_PROFILE,

      // send data here!
      payload: res.data.updated_profile

    });

    dispatch(action_setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.statusText,
        status: err.response.status
      }
    });
  }
};



// Delete account & profile
export const action_deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await AxiosApi.delete('/profile');

      dispatch({
        type: CLEAR_PROFILE
      });
      dispatch({
        type: ACCOUNT_DELETED
      });

      dispatch(action_setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.statusText,
          status: err.response.status
        }
      });
    }
  }
};
