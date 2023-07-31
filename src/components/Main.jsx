import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Zoom, Bounce, Roll } from 'react-awesome-reveal';
import {
  doShowCheckInOut,
  doReveal,
  doLogOut,
  doClearPrevUserState,
  doGetAllCheckedInUsers,
  doGetAllWorkSheetsList,
  doGetActiveUsersList,
  doGetClientsList,
  doCheckSignedIn,
} from '../actions';
import { DATA_SHEET_ACTIVE_RANGE } from '../ranges';

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
  const navigate = useNavigate();
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
    <div className='row mt-3 mb-3'>
      <h4 className='text-center'>
        <Zoom damping={0.1} cascade when={reveal.includes('HEADER-TEXT')}>
          STABRAQ COMMUNITY SPACE
        </Zoom>
      </h4>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll left>
          <Link to='/preferences/main/user'>
            <button
              disabled={reveal.includes('USER-BTN') ? false : true}
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitUser}
            >
              <i className='user icon' />
              User
            </button>
          </Link>
        </Roll>
      </div>

      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll right>
          <Link to='/preferences/main/new-user'>
            <button
              disabled={reveal.includes('NEW-USER-BTN') ? false : true}
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitNewUser}
            >
              <i className='user plus icon' />
              New User
            </button>
          </Link>
        </Roll>
      </div>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll left>
          <Link to='/preferences/main/qr-code-gen'>
            <button
              disabled={reveal.includes('QR-CODE-GEN-BTN') ? false : true}
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitQRCodeGen}
            >
              <i className='qrcode icon' />
              QR Code
            </button>
          </Link>
        </Roll>
      </div>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll right>
          <Link to='/preferences/main/active-sheet'>
            <button
              disabled={reveal.includes('ACTIVE-USERS-BTN') ? false : true}
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitActiveUsers}
            >
              <i className='user circle icon' />
              Active
            </button>
          </Link>
        </Roll>
      </div>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll left>
          <Link to='/preferences/main/clients-list'>
            <button
              disabled={reveal.includes('CLIENTS-BTN') ? false : true}
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitClients}
            >
              <i className='list icon' />
              Clients
            </button>
          </Link>
        </Roll>
      </div>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll>
          <Link to='/preferences/main/active-history'>
            <button
              disabled={
                reveal.includes('ACTIVE-HISTORY-USERS-BTN') ? false : true
              }
              className='ui text-stabraq button bg-dark'
              type='button'
              onClick={onFormSubmitActiveHistory}
            >
              <i className='user circle icon' />
              History
            </button>
          </Link>
        </Roll>
      </div>
      <Bounce>
        <div className='col-md-12 col-sm-12 col-xs-12 mt-3 text-end align-self-center'>
          <button
            className='ui red button'
            onClick={() => {
              dispatch(doLogOut());
              navigate('/dashboard');
            }}
          >
            <i className='sign-out icon' />
            Sign Out
          </button>
        </div>
      </Bounce>
      <Outlet />
    </div>
  );
};

export default Main;
