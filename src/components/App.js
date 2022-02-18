import React, { useEffect, useState } from 'react';
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
import MyAlert from './MyAlert';
import { loadAuth } from '../api/auth';

const App = ({ doCheckSignedIn }) => {
  const [online, setOnline] = useState(true);
  const [downlink, setDownlink] = useState(0);
  useEffect(() => {
    if (!navigator.onLine) {
      return;
    }
    load();
  });

  const load = async () => {
    await axiosAuth();
    await doCheckSignedIn();
    await loadAuth();
  };

  // We are "offline".
  window.addEventListener('offline', () => {
    // Show "No Internet Connection." message.
    console.log('offline');
    setOnline(false);
  });
  // We are "online".
  window.addEventListener('online', () => {
    // Hide "No Internet Connection." message.
    console.log('online');
    setOnline(true);
  });

  // Register for event changes:
  navigator.connection.addEventListener('change', (e) => {
    // Handle change of connection type here.
    console.log(e.currentTarget.downlink);
    setDownlink(e.currentTarget.downlink);
  });

  const renderNoInternet = () => {
    if (!online) return <MyAlert bodyContent='NO INTERNET CONNECTION' />;
  };

  const renderSlowInternet = () => {
    if (downlink > 0 && downlink < 1)
      return <MyAlert bodyContent='SLOW INTERNET CONNECTION' />;
  };

  // if (!navigator.onLine) {
  //   return <div className='ui container mt-3'>NO INTERNET CONNECTION</div>;
  // }

  return (
    <div className='container-fluid myOverflowHidden'>
      {renderNoInternet()}
      {renderSlowInternet()}
      <Router history={history}>
        <div>
          <Splash />
          <div className='ui container mt-3'>
            <Switch>
              <Route path='/dashboard'>
                <AdminLogInForm />
              </Route>
              <Route path='/preferences'>
                <Preferences />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default connect(null, { doCheckSignedIn })(App);
