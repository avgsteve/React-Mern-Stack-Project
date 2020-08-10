import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { action_createProfile, action_getUserProfile } from '../../actions/action_profile';

const initialState_for_form_data = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: ''
};

const ProfileForm = ({

  profile_state_in_Redux: { user_profile, loading },
  action_createProfile,
  action_getUserProfile,
  history

}) => {

  const [
    local_formData, // objects for this Component to store value of different input fields
    update_local_formData
  ] = useState(initialState_for_form_data);

  const [
    displaySocialInputs, // Use this to show/hide the optional input field for social
    toggleSocialInputs
  ] = useState(false);


  // When mounting component, check Redux store for profile to decide whether to overwrite the form data with profile data if there's any
  useEffect(() => {

    // get (current) user's profile
    if (!user_profile) action_getUserProfile();

    // when loading is finished and user's profile has been fetched
    if (!loading && user_profile) {

      // destructure the properties and keys from "initialState_for_form_data" and save them to 
      const currentProfileData = { ...initialState_for_form_data };

      for (const key in user_profile) {
        if (key in currentProfileData)
          currentProfileData[key] = user_profile[key];
      }

      for (const key in user_profile.social) {
        if (key in currentProfileData)
          currentProfileData[key] = user_profile.social[key];
      }

      if (Array.isArray(currentProfileData.skills))
        currentProfileData.skills = currentProfileData.skills.join(', ');

      update_local_formData(currentProfileData);
    }

  }, [
    // trigger useEffect again if any of below props from Redux store has changed
    loading,
    user_profile,
    action_getUserProfile
  ]);


  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = local_formData; // from useState(initialState_for_form_data); 


  // Dynamically update all properties in obj "local_formData"
  const onChange = e =>
    update_local_formData(
      {
        // #1: Use all current properties from obj "local_formData"
        ...local_formData,
        // #2 and this dynamically updated property-value obj 
        [e.target.name]: e.target.value
        // to create a new obj to be used in function "update_local_formData()"
      }
    );

  const onSubmit = e => {
    e.preventDefault();

    // will send POST req to backend to update data and next step will be only using action_createProfile to update the data in current Redux store but not using any action to update Redux
    action_createProfile(local_formData, history, user_profile ? true : false);
  };

  return (

    <Fragment>

      <h1 className="large text-primary">Edit Your Profile</h1>

      <p className="lead">
        <i className="fas fa-user" /> Add some changes to your profile
      </p>

      <small>* = required field</small>


      <form className="form" onSubmit={onSubmit}>

        {/* ==== LIST of OPTIONS for Professional Status ==== */}

        <div className="form-group">

          <select name="status" value={status} onChange={onChange}>
            <option>* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>

          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>

        </div>

        {/* ==== INPUT FIELDS FOR PERSONAL INFO ==== */}

        <div className="form-group">

          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={onChange} />

          <small className="form-text">
            Could be your own company or one you work for
          </small>

        </div>


        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={onChange} />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>


        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange} />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>


        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={onChange} />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>


        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={onChange} />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>


        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={onChange} />
          <small className="form-text">Tell us a little about yourself</small>
        </div>


        {/* ==== Button & Input for SOCIAL NETWORK LINKS ==== */}

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {
          displaySocialInputs &&
          // === optional input fields for social network === */
          (
            <Fragment>

              <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x" />
                <input
                  type="text"
                  placeholder="Twitter URL"
                  name="twitter"
                  value={twitter}
                  onChange={onChange}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x" />
                <input
                  type="text"
                  placeholder="Facebook URL"
                  name="facebook"
                  value={facebook}
                  onChange={onChange}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x" />
                <input
                  type="text"
                  placeholder="YouTube URL"
                  name="youtube"
                  value={youtube}
                  onChange={onChange}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x" />
                <input
                  type="text"
                  placeholder="Linkedin URL"
                  name="linkedin"
                  value={linkedin}
                  onChange={onChange}
                />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x" />
                <input
                  type="text"
                  placeholder="Instagram URL"
                  name="instagram"
                  value={instagram}
                  onChange={onChange}
                />
              </div>

            </Fragment>

          )
        }


        {/* ==== Button & Input for SUBMIT & GO BACK ==== */}

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>

      </form>
    </Fragment >
  );
};



ProfileForm.propTypes = {
  action_createProfile: PropTypes.func.isRequired,
  action_getUserProfile: PropTypes.func.isRequired,
  profile_state_in_Redux: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile_state_in_Redux: state.profile
});


export default connect(mapStateToProps, { action_createProfile, action_getUserProfile })(
  ProfileForm
);
