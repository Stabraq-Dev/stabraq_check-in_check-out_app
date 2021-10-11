import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { doShowCheckInOut, doShrinkIcon } from '../actions';

class Main extends React.Component {
  onFormSubmitUser = async () => {
    this.props.doShrinkIcon(true);
    this.props.doShowCheckInOut(true);
  };

  onFormSubmitNewUser = async () => {
    this.props.doShrinkIcon(true);
    this.props.doShowCheckInOut(false);
  };

  render() {
    const shrink =
      this.props.shrinkIcon || window.location.pathname !== '/preferences/main'
        ? 'shrink'
        : '';
    return (
      <div>
        <div className='row ui container mt-3'>
          <nav className='navbar navbar-light'>
            <form className='container-fluid justify-content-center'>
              <Link to='/preferences/main/user'>
                <button
                  className='btn btn-outline-success me-2 bg-dark'
                  type='button'
                  onClick={this.onFormSubmitUser}
                >
                  <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-member.png'
                    alt='user-member'
                  />
                  User
                </button>
              </Link>
              <Link to='/preferences/main/new-user'>
                <button
                  className='btn btn-outline-success me-2 bg-dark'
                  type='button'
                  onClick={this.onFormSubmitNewUser}
                >
                  <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-new-user.png'
                    alt='user-new-user'
                  />
                  New User
                </button>
              </Link>
            </form>
          </nav>
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

export default connect(mapStateToProps, { doShowCheckInOut, doShrinkIcon })(
  Main
);
