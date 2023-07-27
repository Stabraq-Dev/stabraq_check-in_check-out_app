import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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

const Main = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.doReveal(revealAll);
    return () => {
      props.doReveal([]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.doCheckSignedIn();
  });

  const onFormSubmitUser = async () => {
    const { doClearPrevUserState, doReveal, doShowCheckInOut } = props;
    await doClearPrevUserState();
    await doReveal([
      'NEW-USER-BTN',
      'QR-CODE-GEN-BTN',
      'ACTIVE-USERS-BTN',
      'CLIENTS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
    await doShowCheckInOut(true);
  };

  const onFormSubmitNewUser = async () => {
    const { doReveal, doShowCheckInOut } = props;
    await doReveal([
      'USER-BTN',
      'QR-CODE-GEN-BTN',
      'ACTIVE-USERS-BTN',
      'CLIENTS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
    await doShowCheckInOut(false);
  };
  const onFormSubmitQRCodeGen = async () => {
    const { doReveal } = props;
    await doReveal([
      'USER-BTN',
      'NEW-USER-BTN',
      'ACTIVE-USERS-BTN',
      'CLIENTS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
  };
  const onFormSubmitActiveUsers = async () => {
    const { doReveal, doGetAllCheckedInUsers, doGetActiveUsersList } = props;
    await doReveal([
      'USER-BTN',
      'NEW-USER-BTN',
      'QR-CODE-GEN-BTN',
      'CLIENTS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
    await doGetAllCheckedInUsers(DATA_SHEET_ACTIVE_RANGE);
    await doGetActiveUsersList();
  };
  const onFormSubmitClients = async () => {
    const { doReveal, doGetClientsList } = props;
    await doReveal([
      'USER-BTN',
      'NEW-USER-BTN',
      'QR-CODE-GEN-BTN',
      'ACTIVE-USERS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
    await doGetClientsList();
  };

  const onFormSubmitActiveHistory = async () => {
    const { doReveal, doGetAllWorkSheetsList } = props;
    await doReveal([
      'USER-BTN',
      'NEW-USER-BTN',
      'QR-CODE-GEN-BTN',
      'ACTIVE-USERS-BTN',
      'CLIENTS-BTN',
    ]);
    await doReveal(revealAll);
    await doGetAllWorkSheetsList();
  };

  const { reveal, doLogOut } = props;
  return (
    <div className='row mt-3 mb-3'>
      <h4 className='text-center'>
        <Zoom damping={0.1} cascade when={reveal.includes('HEADER-TEXT')}>
          STABRAQ COMMUNITY SPACE
        </Zoom>
      </h4>
      <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
        <Roll left when={reveal.includes('USER-BTN')}>
          <Link to='/preferences/main/user'>
            <button
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
        <Roll right when={reveal.includes('NEW-USER-BTN')}>
          <Link to='/preferences/main/new-user'>
            <button
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
        <Roll left when={reveal.includes('QR-CODE-GEN-BTN')}>
          <Link to='/preferences/main/qr-code-gen'>
            <button
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
        <Roll right when={reveal.includes('ACTIVE-USERS-BTN')}>
          <Link to='/preferences/main/active-sheet'>
            <button
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
        <Roll left when={reveal.includes('CLIENTS-BTN')}>
          <Link to='/preferences/main/clients-list'>
            <button
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
        <Roll when={reveal.includes('ACTIVE-HISTORY-USERS-BTN')}>
          <Link to='/preferences/main/active-history'>
            <button
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
              doLogOut();
              navigate('/dashboard');
            }}
          >
            <i className='sign-out icon' />
            Sign Out
          </button>
        </div>
      </Bounce>
      <Outlet/>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { showCheckInOut, reveal } = state.app;
  return {
    showCheckInOut,
    reveal,
  };
};

export default connect(mapStateToProps, {
  doShowCheckInOut,
  doReveal,
  doLogOut,
  doClearPrevUserState,
  doGetAllCheckedInUsers,
  doGetAllWorkSheetsList,
  doGetActiveUsersList,
  doGetClientsList,
  doCheckSignedIn,
})(Main);
