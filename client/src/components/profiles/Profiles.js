import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { action_getProfiles } from '../../actions/action_profile';


// <Profile /> is used by Routes.js for path="/profiles"
const Profiles = (
  {
    action_getProfiles,
    profile_state_in_Redux: {
      profiles,
      loading }
  }
) => {
  useEffect(() => {
    action_getProfiles();
  }, [action_getProfiles]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
          <Fragment>
            <h1 className='large text-primary'>Developers</h1>
            <p className='lead'>
              <i className='fab fa-connectdevelop' /> Browse and connect with
            developers
          </p>
            <div className='profiles'>
              {profiles.length > 0 ? (
                profiles.map(profile => (
                  <ProfileItem key={profile._id} profile={profile} />
                ))
              ) : (
                  <h4>No profiles found...</h4>
                )}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

Profiles.propTypes = {
  action_getProfiles: PropTypes.func.isRequired,
  profile_state_in_Redux: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile_state_in_Redux: state.profile
});

export default connect(
  mapStateToProps,
  { action_getProfiles }
)(Profiles);
