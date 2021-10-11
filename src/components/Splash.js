import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../history';
import { doShrinkLogo } from '../actions';

function Splash(props) {
  useEffect(() => props.doShrinkLogo(false));
  const shrinkLogo =
    props.shrinkLogo || history.location.pathname !== '/' ? 'shrink-logo' : '';

  const redirectTo = () => {
    if (history.location.pathname === '/') {
      return '/preferences/main';
    } else if (history.location.pathname === '/preferences/main') {
      return '/';
    } else {
      return history.location.pathname.replace(/\/([^/]+)\/?$/, '');
    }
  };

  return (
    <Link to={props.isSignedIn ? redirectTo : '/dashboard'}>
      <div className='text-center'>
        <button
          className='btn me-2 no-btn-focus'
          type='button'
          onClick={() => props.doShrinkLogo(true)}
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
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { doShrinkLogo })(Splash);
