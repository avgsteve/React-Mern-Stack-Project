import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { action_Auth_logout } from '../../actions/auth';

import PropTypes from 'prop-types';

const Navbar = ({
  //arguments:
  //#1 destructure property from Redux state
  auth_state_in_Redux: {
    isAuthenticated, loading
  },
  //#2 import action
  action_Auth_logout
}) => {

  // === Navbar for Logged-in user ===
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>

      {/* == Logout button ==*/}
      <li>
        <a onClick={action_Auth_logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
          {/* hide-sm is display: none; */}
        </a>
      </li>
    </ul>
  );


  // === Navbar for Logged-in user ===
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );


  return (

    <nav className='navbar bg-dark'>

      <h1>
        <Link to='/'>
          <i className='fas fa-code' />
        DevConnector
      </Link>
      </h1>

      {/* Render different type of Navbar depending on Login State "loading" & "isAuthenticated" */}

      {!loading &&
        (
          <Fragment>{
            isAuthenticated
              ? authLinks
              : guestLinks
          }</Fragment>
        )
      }

    </nav>);

};

Navbar.propTypes = {
  action_Auth_logout: PropTypes.func.isRequired,
  auth_state_in_Redux: PropTypes.object.isRequired
};

const mapStateToProps = state => (
  {
    auth_state_in_Redux: state.auth
  }
);

export default connect(mapStateToProps, { action_Auth_logout })(Navbar);
