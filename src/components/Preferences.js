import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { doRedirectToSignIn } from '../actions';

import history from '../history';
import Main from './Main';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CheckInOut from './CheckInOut';
import MyModalUser from './MyModalUser';
import QRCodeGenerator from './QRCodeGenerator';

function Preferences({ isSignedIn, doRedirectToSignIn }) {
  if (isSignedIn) {
    return (
      <React.Fragment>
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
            <Route
              path='/preferences/main/qr-code-gen'
              component={QRCodeGenerator}
            ></Route>
          </div>
        </Router>
        <MyModalUser />
      </React.Fragment>
    );
  }
  return (
    <div className='text-center'>
      <div className='alert alert-danger mt-5' role='alert'>
        You need to login first!
      </div>
      <button
        className='ui primary button stabraq-bg'
        onClick={doRedirectToSignIn}
        type='submit'
      >
        <i className='sign-in icon' />
        Go to sign in page
      </button>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { isSignedIn } = state.auth;
  return {
    isSignedIn,
  };
};

export default connect(mapStateToProps, { doRedirectToSignIn })(Preferences);
