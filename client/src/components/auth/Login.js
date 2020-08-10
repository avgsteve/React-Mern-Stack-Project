import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { action_login } from '../../actions/auth';
// import { action_setAlert } from '../../actions/action_alert';


const Login = ({
  action_login,
  isAuthenticated,
  // action_setAlert 
}) => {

  // Set & change the value of email & password
  const [data_in_form, set_data_in_Form] = useState({
    email: '',
    password: ''
  });

  const { email, password } = data_in_form;

  const onChange = e => // Get user's input for email & password
    set_data_in_Form({ ...data_in_form, [e.target.name]: e.target.value });

  const onSubmit = e => { // Login user
    e.preventDefault();
    action_login(email, password);
  };


  // Redirect user if login is successful
  // (get isAuthenticated from Redux store)
  if (isAuthenticated) {

    return <Redirect to="/dashboard" />;

  }


  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  action_login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { action_login })(Login);
