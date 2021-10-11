import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from '../history';
import Main from './Main';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CheckInOut from './CheckInOut';

function Preferences() {
  return (
    <Router history={history}>
      <div>
        <Route path='/preferences/main' component={Main}></Route>
        <Route path='/preferences/main/user' component={SearchBar}></Route>
        <Route
          path='/preferences/main/user/check-in-out'
          exact
          component={CheckInOut}
        ></Route>
        <Route
          path='/preferences/main/new-user'
          exact
          component={NewUserForm}
        ></Route>
      </div>
    </Router>
  );
}

export default Preferences;
