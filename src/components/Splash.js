import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Flip from 'react-reveal/Flip';

import history from '../history';
import { doShrinkLogo, doRevealLogo, doReveal } from '../actions';

const revealAll = ['HEADER-TEXT', 'USER-BTN', 'NEW-USER-BTN'];

function Splash(props) {
  useEffect(() => {
    props.doShrinkLogo(false);
    props.doRevealLogo(true);
  });

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
          onClick={async () => {
            await props.doRevealLogo(false);
            await props.doShrinkLogo(true);
            await props.doRevealLogo(true);
            if (history.location.pathname === '/preferences/main') {
              await props.doReveal([]);
              await props.doReveal(revealAll);
            }
          }}
        >
          <Flip right cascade when={props.revealLogo}>
            <img
              className={`mx-auto d-block logo-img ${shrinkLogo}`}
              src='/logo.png'
              alt='Logo'
            />
          </Flip>
        </button>
      </div>
    </Link>
  );
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    shrinkLogo: state.app.shrinkLogo,
    revealLogo: state.app.revealLogo,
  };
};

export default connect(mapStateToProps, {
  doShrinkLogo,
  doRevealLogo,
  doReveal,
})(Splash);
