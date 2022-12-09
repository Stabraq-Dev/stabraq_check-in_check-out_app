import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Zoom from 'react-reveal/Zoom';
import LightSpeed from 'react-reveal/LightSpeed';
import Bounce from 'react-reveal/Bounce';

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

class Main extends React.Component {
  componentDidMount() {
    this.props.doReveal(revealAll);
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.doCheckSignedIn();
  }

  componentWillUnmount() {
    this.props.doReveal([]);
  }

  onFormSubmitUser = async () => {
    const { doClearPrevUserState, doReveal, doShowCheckInOut } = this.props;
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

  onFormSubmitNewUser = async () => {
    const { doReveal, doShowCheckInOut } = this.props;
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
  onFormSubmitQRCodeGen = async () => {
    const { doReveal } = this.props;
    await doReveal([
      'USER-BTN',
      'NEW-USER-BTN',
      'ACTIVE-USERS-BTN',
      'CLIENTS-BTN',
      'ACTIVE-HISTORY-USERS-BTN',
    ]);
    await doReveal(revealAll);
  };
  onFormSubmitActiveUsers = async () => {
    const { doReveal, doGetAllCheckedInUsers, doGetActiveUsersList } =
      this.props;
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
  onFormSubmitClients = async () => {
    const { doReveal, doGetClientsList } = this.props;
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

  onFormSubmitActiveHistory = async () => {
    const {
      doReveal,
      doGetAllWorkSheetsList,
    } = this.props;
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
  render() {
    const { reveal, doLogOut } = this.props;
    return (
      <div className='row mt-3 mb-3'>
        <h4 className='text-center'>
          <Zoom right cascade when={reveal.includes('HEADER-TEXT')}>
            STABRAQ COMMUNITY SPACE
          </Zoom>
        </h4>
        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed left when={reveal.includes('USER-BTN')}>
            <Link to='/preferences/main/user'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitUser}
              >
                <i className='user icon' />
                User
              </button>
            </Link>
          </LightSpeed>
        </div>

        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed right when={reveal.includes('NEW-USER-BTN')}>
            <Link to='/preferences/main/new-user'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitNewUser}
              >
                <i className='user plus icon' />
                New User
              </button>
            </Link>
          </LightSpeed>
        </div>
        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed left when={reveal.includes('QR-CODE-GEN-BTN')}>
            <Link to='/preferences/main/qr-code-gen'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitQRCodeGen}
              >
                <i className='qrcode icon' />
                QR Code
              </button>
            </Link>
          </LightSpeed>
        </div>
        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed right when={reveal.includes('ACTIVE-USERS-BTN')}>
            <Link to='/preferences/main/active-sheet'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitActiveUsers}
              >
                <i className='user circle icon' />
                Active
              </button>
            </Link>
          </LightSpeed>
        </div>
        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed left when={reveal.includes('CLIENTS-BTN')}>
            <Link to='/preferences/main/clients-list'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitClients}
              >
                <i className='list icon' />
                Clients
              </button>
            </Link>
          </LightSpeed>
        </div>
        <div className='col-md-4 col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed right when={reveal.includes('ACTIVE-HISTORY-USERS-BTN')}>
            <Link to='/preferences/main/active-history'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitActiveHistory}
              >
                <i className='user circle icon' />
                History
              </button>
            </Link>
          </LightSpeed>
        </div>
        <Bounce bottom>
          <div className='col-md-12 col-sm-12 col-xs-12 mt-3 text-end align-self-center'>
            <button className='ui red button' onClick={() => doLogOut()}>
              <i className='sign-out icon' />
              Sign Out
            </button>
          </div>
        </Bounce>
      </div>
    );
  }
}

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
