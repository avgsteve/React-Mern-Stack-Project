import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { action_Auth_logout } from '../../actions/auth';

const Navbar = ({ //arguments:
  auth: { //destructure auth property from state
    isAuthenticated,
    loading
  },
  action_Auth_logout

}) => {

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
        </a>
      </li>
    </ul>);

  const guestLinks = (<ul>


    <li>
      <Link to='/profiles'>Developers</Link>
    </li>
    <li>
      <Link to='/register'>Register</Link>
    </li>
    <li>
      <Link to='/login'>Login</Link>
    </li>
  </ul>);


  return (

    <nav className='navbar bg-dark'>

      <h1>
        <Link to='/'>
          <i className='fas fa-code' />
        DevConnector
      </Link>
      </h1>

      {
        !loading && (
          <Fragment>{
            isAuthenticated
              ? authLinks
              : guestLinks
          }</Fragment>)
      }

    </nav>);

};

Navbar.propTypes = {
  action_Auth_logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps, { action_Auth_logout })(Navbar);
