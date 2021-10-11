import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../history';
import { doShrinkLogo } from '../actions';

function Splash(props) {
  const shrinkLogo =
    props.shrinkLogo || history.location.pathname !== '/' ? 'shrink-logo' : '';
  return (
    <Link to={props.isSignedIn ? '/preferences/main/user' : '/dashboard'}>
      <div className='text-center'>
        <button
          className='btn me-2 no-btn-focus'
          type='button'
          onClick={props.doShrinkLogo}
        >
          <img
            className={`mx-auto d-block logo-img ${shrinkLogo}`}
            src='/logo.png'
            alt='Logo'
          />
        </button>
      </div>
    </Link>
  );
}

const mapStateToProps = (state) => {
  return {
    shrinkLogo: state.app.shrinkLogo,
  };
};
export default connect(mapStateToProps, { doShrinkLogo })(Splash);
