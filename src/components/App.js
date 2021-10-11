import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles.css';

import history from '../history';
import { axiosAuth } from '../api/googleSheetsAPI';
import Splash from './Splash';
import Preferences from './Preferences';
import AdminLogInForm from './AdminLogInForm';
import { doCheckSignedIn } from '../actions/index';
import { connect } from 'react-redux';

const App = (props) => {
  useEffect(() => {
    load();
    props.doCheckSignedIn();
  });

  const load = async () => {
    await axiosAuth();
  };
  return (
    <div className='ui container mt-3'>
      <Router history={history}>
        <div>
          <Splash />
          <Switch>
            <Route path='/dashboard'>
              <AdminLogInForm />
            </Route>
            <Route path='/preferences'>
              <Preferences />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default connect(null, { doCheckSignedIn })(App);
