import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles.css';

import Splash from './Splash';
import Preferences from './Preferences';
import AdminLogInForm from './AdminLogInForm';

const App = () => {
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

export default App;
