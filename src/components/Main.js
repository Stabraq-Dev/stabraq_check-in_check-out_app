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
} from '../actions';
// import { Person, PersonAdd } from '@mui/icons-material';

const revealAll = ['HEADER-TEXT', 'USER-BTN', 'NEW-USER-BTN'];

class Main extends React.Component {
  componentDidMount() {
    this.props.doReveal(revealAll);
  }

  componentWillUnmount() {
    this.props.doReveal([]);
  }

  onFormSubmitUser = async () => {
    await this.props.doClearPrevUserState();
    await this.props.doReveal(['NEW-USER-BTN']);
    await this.props.doReveal(revealAll);
    await this.props.doShowCheckInOut(true);
  };

  onFormSubmitNewUser = async () => {
    await this.props.doReveal(['USER-BTN']);
    await this.props.doReveal(revealAll);
    await this.props.doShowCheckInOut(false);
  };

  render() {
    // const shrink =
    //   this.props.shrinkIcon || window.location.pathname !== '/preferences/main'
    //     ? 'shrink'
    //     : '';
    return (
      <div className='row mt-3 mb-3'>
        <h4 className='text-center'>
          <Zoom
            right
            cascade
            when={this.props.reveal.includes('HEADER-TEXT')}
          >
            STABRAQ COMMUNITY SPACE
          </Zoom>
        </h4>
        <div className='col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed left when={this.props.reveal.includes('USER-BTN')}>
            <Link to='/preferences/main/user'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitUser}
              >
                {/* <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-member.png'
                    alt='user-member'
                  /> */}
                {/* <Person
                sx={{ fontSize: 50 }}
                className={`user-img ${shrink}`}
              /> */}
                <i className='user icon' />
                User
              </button>
            </Link>
          </LightSpeed>
        </div>

        <div className='col-sm-4 col-xs-12 mt-3 text-center'>
          <LightSpeed
            right
            when={this.props.reveal.includes('NEW-USER-BTN')}
          >
            <Link to='/preferences/main/new-user'>
              <button
                className='ui text-stabraq button bg-dark'
                type='button'
                onClick={this.onFormSubmitNewUser}
              >
                {/* <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-new-user.png'
                    alt='user-new-user'
                  /> */}
                {/* <PersonAdd
                sx={{ fontSize: 50 }}
                className={`user-img ${shrink}`}
              /> */}
                <i className='user plus icon' />
                New User
              </button>
            </Link>
          </LightSpeed>
        </div>
        <Bounce bottom>
          <div className='col-sm-4 col-xs-12 mt-3 text-end align-self-center'>
            <button
              className='ui red button'
              onClick={() => this.props.doLogOut()}
            >
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
  return {
    showCheckInOut: state.app.showCheckInOut,
    reveal: state.app.reveal,
  };
};

export default connect(mapStateToProps, {
  doShowCheckInOut,
  doReveal,
  doLogOut,
  doClearPrevUserState,
})(Main);
