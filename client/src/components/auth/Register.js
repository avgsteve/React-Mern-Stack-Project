import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/action_alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import Axios from 'axios';

const Register = ({ setAlert, register, isAuthenticated }) => {

  const [data_in_form, set_data_in_Form] = useState(
    // initial state of forData
    { name: '', email: '', password: '', password_confirm: '' }
  );

  //  
  const { name, email, password, password_confirm } = data_in_form;


  // change the value (state) of variables for form data
  const onChange = (e) => set_data_in_Form({
    ...data_in_form,
    // In the Array, use the name , which is the name attribute from DOM element , dynamically changed as item to store data
    [e.target.name]: e.target.value,

  });

  // // for testing
  // if (password_confirm)
  //   setTimeout(
  //     () => { 
  //       if (password !== password_confirm) {
  //         console.log('Passwords do not match');
  //       }
  //     }, 1000);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password_confirm) {
      setAlert('Passwords do not match', 'danger');
    } else {

      register({ name, email, password });

      // //  ===== for testing ====
      // const newUserData = { name, email, password };

      // // fetch token here
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   };
      //   const body = JSON.stringify(newUserData);
      //   const res = await Axios.post('/api/users', body, config);
      //   console.log(res.data);
      // } catch (err) {
      //   console.log(`There's an error while registering new user`, err);
      // }
      // //  ===== for testing ====

    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (<Fragment>

    <h1 className="large text-primary">Sign Up</h1>
    <p className="lead">
      <i className="fas fa-user" />
      Create Your Account
    </p>


    <form className="form" onSubmit={onSubmit}>

      {/* CSS stlye:  .form .form-group {  margin: 1.2rem 0;} 0; */}

      <div className="form-group">
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
      </div>

      <div className="form-group">
        <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} />
        <small className="form-text">
          This site uses Gravatar so if you want a profile image, use a Gravatar email
        </small>
      </div>

      <div className="form-group">
        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
      </div>

      <div className="form-group">
        <input type="password" placeholder="Confirm Password" name="password_confirm" value={password_confirm} onChange={onChange} />
      </div>

      <input type="submit" className="btn btn-primary" value="Register" />

    </form>


    <p className="my-1">
      Already have an account?
      <Link to="/login">Sign In</Link>
    </p>

  </Fragment>);
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps, { setAlert, register })(Register);
