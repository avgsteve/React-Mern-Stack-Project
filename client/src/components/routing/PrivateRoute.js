import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

// This PrivateRouter Component is used in Routes.js

// ex:  <PrivateRoute exact path="/dashboard" component={Dashboard} />

const PrivateRoute = (

  { //parameters from parent Component's prop or Redux connect

    component: ComponentToRender, // receives value of parent prop "component" from Route.js. Ex: {Dashboard}

    auth_state_in_Redux: { isAuthenticated, loading }, // get authentication state from Redux to dicide either redirect user or let user access other Components' page

    // the rest of the arguments passed-in ex: exact path="/add-education" to decide what Component to use
    ...props_from_parent
  }

) => /* function body:*/(

    <Route {...props_from_parent} // use parent's prop here to pass objects to the child props by "render"

      render={
        props_from_arguments =>
          // Use props_for_rendering (props from arguments) to check:
          // #1 Whether to show pinner depending on loading state
          loading === true ? (<Spinner />) : isAuthenticated ?

            // #2 If user is authenticated, render component with props including what components to render. 
            (<ComponentToRender {...props_from_arguments} />) :

            // OR, if not authenticaed,  redirect user
            (<Redirect to="/login" />)} />

  );

PrivateRoute.propTypes = {
  auth_state_in_Redux: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth_state_in_Redux: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
