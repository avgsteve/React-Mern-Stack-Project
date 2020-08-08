import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';

import setAuthToken from './utils/setAuthToken';

// Redux
import { Provider } from 'react-redux'; // providing global state in App.js to other sub components
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';

const App = () => {
  useEffect(() => {

    setAuthToken(localStorage.token);
    store.dispatch(loadUser()); // for "store" props in <Provider />

  }, []);

  return (<Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>);
};

export default App;
