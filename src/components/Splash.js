import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Flip from 'react-reveal/Flip';

import history from '../history';
import { doShrinkLogo, doRevealLogo, doReveal } from '../actions';

const revealAll = [
  'HEADER-TEXT',
  'USER-BTN',
  'NEW-USER-BTN',
  'QR-CODE-GEN-BTN',
  'ACTIVE-USERS-BTN',
];

function Splash({
  isSignedIn,
  doShrinkLogo,
  shrinkLogo,
  doRevealLogo,
  revealLogo,
  doReveal,
}) {
  useEffect(() => {
    doShrinkLogo(false);
    doRevealLogo(true);
  });

  const shrinkLogoClass =
    shrinkLogo || history.location.pathname !== '/' ? 'shrink-logo' : '';
  const centerLogoClass =
    history.location.pathname === '/' ? 'center-logo' : '';

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
    <Link to={isSignedIn ? redirectTo : '/dashboard'}>
      <div className={`text-center ${centerLogoClass}`}>
        <button
          className='btn me-2 no-btn-focus'
          type='button'
          onClick={async () => {
            await doRevealLogo(false);
            await doShrinkLogo(true);
            await doRevealLogo(true);
            if (history.location.pathname === '/preferences/main') {
              await doReveal([]);
              await doReveal(revealAll);
            }
          }}
        >
          <Flip right cascade when={revealLogo}>
            <img
              className={`mx-auto d-block logo-img ${shrinkLogoClass}`}
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
  const { isSignedIn } = state.auth;
  const { shrinkLogo, revealLogo } = state.app;
  return {
    isSignedIn,
    shrinkLogo,
    revealLogo,
  };
};

export default connect(mapStateToProps, {
  doShrinkLogo,
  doRevealLogo,
  doReveal,
})(Splash);
