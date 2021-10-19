import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  doShowCheckInOut,
  doShrinkIcon,
  doLogOut,
  doClearPrevUserState,
} from '../actions';
// import { Person, PersonAdd } from '@mui/icons-material';

class Main extends React.Component {
  onFormSubmitUser = async () => {
    this.props.doClearPrevUserState();
    this.props.doShrinkIcon(true);
    this.props.doShowCheckInOut(true);
  };

  onFormSubmitNewUser = async () => {
    this.props.doShrinkIcon(true);
    this.props.doShowCheckInOut(false);
  };

  render() {
    // const shrink =
    //   this.props.shrinkIcon || window.location.pathname !== '/preferences/main'
    //     ? 'shrink'
    //     : '';
    return (
      <div className='row mt-3 mb-3'>
        <div className='col-sm-4 col-xs-12 mt-3 text-center'>
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
        </div>

        <div className='col-sm-4 col-xs-12 mt-3 text-center'>
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
        </div>
        <div className='col-sm-4 col-xs-12 mt-3 text-end align-self-center'>
          <button
            className='ui red button'
            onClick={() => this.props.doLogOut()}
          >
            <i className='sign-out icon' />
            Sign Out
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showCheckInOut: state.app.showCheckInOut,
    shrinkIcon: state.app.shrinkIcon,
  };
};

export default connect(mapStateToProps, {
  doShowCheckInOut,
  doShrinkIcon,
  doLogOut,
  doClearPrevUserState,
})(Main);
