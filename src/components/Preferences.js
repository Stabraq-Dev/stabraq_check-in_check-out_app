import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { doRedirectToSignIn } from '../actions';

import Main from './Main';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CheckInOut from './CheckInOut';
import MyModalUser from './MyModalUser';
import QRCodeGenerator from './QRCodeGenerator';
import Active from './Active';
import ClientsList from './ClientsList';
import EditClient from './EditClient';
import Footer from './Footer';
import ActiveHistory from './ActiveHistory';

function Preferences({ isSignedIn, doRedirectToSignIn }) {
  if (isSignedIn) {
    return (
      <React.Fragment>
        <Routes>
          <Route path='/preferences/main' component={Main} />
          <Route path='/preferences/main/user' component={SearchBar} />
          <Route
            path='/preferences/main/user/check-in-out'
            exact
            component={CheckInOut}
          />
          <Route
            path='/preferences/main/new-user'
            exact
            component={NewUserForm}
          />
          <Route
            path='/preferences/main/qr-code-gen'
            component={QRCodeGenerator}
          />
          <Route path='/preferences/main/active-sheet' component={Active} />
          <Route
            path='/preferences/main/clients-list'
            component={ClientsList}
          />
          <Route
            path='/preferences/main/active-history'
            component={ActiveHistory}
          />
          <Route path='/preferences/main/edit-client' component={EditClient} />
          <Route path='/preferences' component={Footer} />
        </Routes>
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
