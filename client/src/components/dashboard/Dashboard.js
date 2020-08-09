import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { action_getUserProfile, action_deleteAccount } from '../../actions/action_profile';

import Spinner from '../layout/Spinner';

import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({

  action_getUserProfile,
  action_deleteAccount,
  auth_state_in_Redux: { user },
  profile_state_in_Redux: { profile },
  loading_profile

}) => {

  useEffect(() => {
    action_getUserProfile();
  }, [action_getUserProfile]);


  return (

    <Fragment>

      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>

      {
        // If user's profile is still loading, show spinner
        loading_profile === true ? <Spinner /> :

          // If user's profile exsits, show the profile Components, otherwise show text
          profile !== null ? (

            <Fragment>
              <DashboardActions />
              <Experience experience={profile.experience} />
              <Education education={profile.education} />

              <div className="my-2">
                <button className="btn btn-danger" onClick={() => action_deleteAccount()}>
                  <i className="fas fa-user-minus" /> Delete My Account
            </button>
              </div>
            </Fragment>

          ) : (

              <Fragment>
                <p>You have not yet setup a profile, please add some info</p>
                <Link to="/create-profile" className="btn btn-primary my-1">
                  Create Profile
          </Link>
              </Fragment>

            )}

    </Fragment>
  );
};

Dashboard.propTypes = {
  action_getUserProfile: PropTypes.func.isRequired,
  action_deleteAccount: PropTypes.func.isRequired,
  auth_state_in_Redux: PropTypes.object.isRequired,
  profile_state_in_Redux: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth_state_in_Redux: state.auth,
  profile_state_in_Redux: state.profile,
  loading_profile: state.profile.loading
});

export default connect(mapStateToProps, { action_getUserProfile, action_deleteAccount })(
  Dashboard
);
