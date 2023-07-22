import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles.css';

import { axiosAuth } from '../api/googleSheetsAPI';
import Splash from './Splash';
import Preferences from './Preferences';
import AdminLogInForm from './AdminLogInForm';
import Main from './Main';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CheckInOut from './CheckInOut';
import QRCodeGenerator from './QRCodeGenerator';
import Active from './Active';
import ClientsList from './ClientsList';
import EditClient from './EditClient';
import Footer from './Footer';
import ActiveHistory from './ActiveHistory';

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
    await axiosAuth(import.meta.env.VITE_SHEET_ID);
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
    if (downlink > 0 && downlink < 0.1)
      return <MyAlert bodyContent='SLOW INTERNET CONNECTION' />;
  };

  // if (!navigator.onLine) {
  //   return <div className='ui container mt-3'>NO INTERNET CONNECTION</div>;
  // }

  return (
    <div className='container-fluid myOverflowHidden'>
      {renderNoInternet()}
      {renderSlowInternet()}
      <div className='ui container mt-3'>
        <div>
          <Splash />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='dashboard' element={<AdminLogInForm />} />
            <Route path='preferences' element={<Preferences />}>
              <Route path='main' element={<Main />}>
                <Route path='user' element={<SearchBar />}>
                  <Route path='check-in-out' element={<CheckInOut />} />
                </Route>
                <Route path='new-user' element={<NewUserForm />} />
                <Route path='qr-code-gen' element={<QRCodeGenerator />} />
                <Route path='active-sheet' element={<Active />} />
                <Route path='clients-list' element={<ClientsList />} />
                <Route path='active-history' element={<ActiveHistory />} />
                <Route path='edit-client' element={<EditClient />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default connect(null, { doCheckSignedIn })(App);
