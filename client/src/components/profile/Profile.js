import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { getProfileById } from '../../actions/action_profile';

const Profile = ({

  getProfileById,
  profile_state_in_Redux: { user_profile },
  auth,
  match }) => {

  useEffect(() => {

    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (

    <Fragment>

      {/* Before loading is completed */}
      {user_profile === null ? (
        <Spinner />
      ) : (

          <Fragment>

            <Link to="/profiles" className="btn btn-light">
              Back To Profiles
          </Link>

            {/* Allow logged-in user to modify his own profile */}
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === user_profile._id && (
                <Link to="/edit-profile" className="btn btn-dark">
                  Edit Profile
                </Link>
              )}


            {/* CSS style:
              .profile-grid {
                  display: grid;
                  grid-template-areas:
                    'top top' //
                    'about about'
                    'exp edu'
                    'github github';
                  grid-gap: 1rem;       }     */}

            <div className="profile-grid my-1">

              <ProfileTop profile={user_profile} />
              <ProfileAbout profile={user_profile} />

              {/* Experience (iterate current experience Array) */}

              <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Experience</h2>

                {user_profile.experience.length > 0 ? (

                  <Fragment>
                    {user_profile.experience.map((experience) => (
                      <ProfileExperience
                        key={experience._id}
                        experience={experience}
                      />
                    ))}
                  </Fragment>

                ) : (
                    <h4>No experience credentials</h4>
                  )}
              </div>

              {/* Education (iterate current education Array) */}

              <div className="profile-edu bg-white p-2">
                <h2 className="text-primary">Education</h2>
                {user_profile.education.length > 0 ? (
                  <Fragment>
                    {user_profile.education.map((education) => (
                      <ProfileEducation
                        key={education._id}
                        education={education}
                      />
                    ))}
                  </Fragment>
                ) : (
                    <h4>No education credentials</h4>
                  )}
              </div>

              {/* If user's github exists, use Component  <ProfileGithub /> 
              */}

              {user_profile.githubusername && (
                <ProfileGithub username={user_profile.githubusername} />
              )}

            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile_state_in_Redux: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile_state_in_Redux: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
