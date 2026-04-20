import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Roll } from 'react-awesome-reveal';
import {
  doShowCheckInOut,
  doReveal,
  doClearPrevUserState,
  doGetAllWorkSheetsList,
  doCheckSignedIn,
} from '../actions';

const revealAll = [
  'HEADER-TEXT',
  'USER-BTN',
  'NEW-USER-BTN',
  'QR-CODE-GEN-BTN',
  'ACTIVE-USERS-BTN',
  'CLIENTS-BTN',
  'ACTIVE-HISTORY-USERS-BTN',
];

const Main = () => {
  const dispatch = useDispatch();
  const { reveal } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(doReveal(revealAll));
    return () => {
      dispatch(doReveal([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(doCheckSignedIn());
  });

  const onFormSubmitUser = async () => {
    await dispatch(doClearPrevUserState());
    await dispatch(
      doReveal([
        'NEW-USER-BTN',
        'QR-CODE-GEN-BTN',
        'ACTIVE-USERS-BTN',
        'CLIENTS-BTN',
        'ACTIVE-HISTORY-USERS-BTN',
      ])
    );
    await dispatch(doShowCheckInOut(true));
  };

  const onFormSubmitNewUser = async () => {
    await dispatch(
      doReveal([
        'USER-BTN',
        'QR-CODE-GEN-BTN',
        'ACTIVE-USERS-BTN',
        'CLIENTS-BTN',
        'ACTIVE-HISTORY-USERS-BTN',
      ])
    );
    await dispatch(doShowCheckInOut(false));
  };
  const onFormSubmitQRCodeGen = async () => {
    await dispatch(
      doReveal([
        'USER-BTN',
        'NEW-USER-BTN',
        'ACTIVE-USERS-BTN',
        'CLIENTS-BTN',
        'ACTIVE-HISTORY-USERS-BTN',
      ])
    );
  };
  const onFormSubmitActiveUsers = async () => {
    await dispatch(
      doReveal([
        'USER-BTN',
        'NEW-USER-BTN',
        'QR-CODE-GEN-BTN',
        'CLIENTS-BTN',
        'ACTIVE-HISTORY-USERS-BTN',
      ])
    );
    // dispatch(doGetAllCheckedInUsers(DATA_SHEET_ACTIVE_RANGE));
    // dispatch(doGetActiveUsersList());
  };
  const onFormSubmitClients = async () => {
    await dispatch(
      doReveal([
        'USER-BTN',
        'NEW-USER-BTN',
        'QR-CODE-GEN-BTN',
        'ACTIVE-USERS-BTN',
        'ACTIVE-HISTORY-USERS-BTN',
      ])
    );
    // dispatch(doGetClientsList());
  };

  const onFormSubmitActiveHistory = async () => {
    await dispatch(
      doReveal([
        'USER-BTN',
        'NEW-USER-BTN',
        'QR-CODE-GEN-BTN',
        'ACTIVE-USERS-BTN',
        'CLIENTS-BTN',
      ])
    );
    await dispatch(doGetAllWorkSheetsList());
  };

  return (
    <div className='row g-3 mt-2 mb-3'>
      <div className='col-md-4 col-sm-6 col-6'>
        <Roll left>
          <Link
            to='/preferences/main/user'
            className={`dashboard-card ${!reveal.includes('USER-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('USER-BTN') ? -1 : 0}
            onClick={reveal.includes('USER-BTN') ? onFormSubmitUser : (e) => e.preventDefault()}
          >
            <i className='user icon card-icon' />
            <span className='card-label'>User</span>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-6 col-6'>
        <Roll right>
          <Link
            to='/preferences/main/new-user'
            className={`dashboard-card ${!reveal.includes('NEW-USER-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('NEW-USER-BTN') ? -1 : 0}
            onClick={reveal.includes('NEW-USER-BTN') ? onFormSubmitNewUser : (e) => e.preventDefault()}
          >
            <i className='user plus icon card-icon' />
            <span className='card-label'>New User</span>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-6 col-6'>
        <Roll left>
          <Link
            to='/preferences/main/qr-code-gen'
            className={`dashboard-card ${!reveal.includes('QR-CODE-GEN-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('QR-CODE-GEN-BTN') ? -1 : 0}
            onClick={reveal.includes('QR-CODE-GEN-BTN') ? onFormSubmitQRCodeGen : (e) => e.preventDefault()}
          >
            <i className='qrcode icon card-icon' />
            <span className='card-label'>QR Code</span>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-6 col-6'>
        <Roll right>
          <Link
            to='/preferences/main/active-sheet'
            className={`dashboard-card ${!reveal.includes('ACTIVE-USERS-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('ACTIVE-USERS-BTN') ? -1 : 0}
            onClick={reveal.includes('ACTIVE-USERS-BTN') ? onFormSubmitActiveUsers : (e) => e.preventDefault()}
          >
            <i className='user circle icon card-icon' />
            <span className='card-label'>Active</span>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-6 col-6'>
        <Roll left>
          <Link
            to='/preferences/main/clients-list'
            className={`dashboard-card ${!reveal.includes('CLIENTS-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('CLIENTS-BTN') ? -1 : 0}
            onClick={reveal.includes('CLIENTS-BTN') ? onFormSubmitClients : (e) => e.preventDefault()}
          >
            <i className='list icon card-icon' />
            <span className='card-label'>Clients</span>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-6 col-6'>
        <Roll>
          <Link
            to='/preferences/main/active-history'
            className={`dashboard-card ${!reveal.includes('ACTIVE-HISTORY-USERS-BTN') ? 'disabled' : ''}`}
            tabIndex={!reveal.includes('ACTIVE-HISTORY-USERS-BTN') ? -1 : 0}
            onClick={reveal.includes('ACTIVE-HISTORY-USERS-BTN') ? onFormSubmitActiveHistory : (e) => e.preventDefault()}
          >
            <i className='user circle icon card-icon' />
            <span className='card-label'>History</span>
          </Link>
        </Roll>
      </div>

      <Outlet />
    </div>
  );
};

export default Main;
