import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Flip } from 'react-awesome-reveal';
import { useLocation } from 'react-router-dom';

import { doShrinkLogo, doRevealLogo, doReveal } from '../actions';

const revealAll = [
  'HEADER-TEXT',
  'USER-BTN',
  'NEW-USER-BTN',
  'QR-CODE-GEN-BTN',
  'ACTIVE-USERS-BTN',
  'CLIENTS-BTN',
  'ACTIVE-HISTORY-USERS-BTN',
];

function Splash() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSignedIn } = useSelector((state) => state.auth);
  const { shrinkLogo } = useSelector((state) => state.app);

  useEffect(() => {
    if (shrinkLogo) {
      dispatch(doShrinkLogo(false));
      dispatch(doRevealLogo(true));
    }
  });

  const shrinkLogoClass =
    shrinkLogo || location.pathname !== '/' ? 'shrink-logo' : '';
  const centerLogoClass = location.pathname === '/' ? 'center-logo' : '';

  const redirectTo = () => {
    if (location.pathname === '/') {
      return '/preferences/main';
    } else if (location.pathname === '/preferences/main') {
      return '/';
    } else {
      return location.pathname.replace(/\/([^/]+)\/?$/, '');
    }
  };

  return (
    <Link to={isSignedIn ? redirectTo() : '/dashboard'}>
      <div className={`text-center ${centerLogoClass}`}>
        <button
          className='btn me-2 no-btn-focus'
          type='button'
          onClick={async () => {
            await dispatch(doRevealLogo(false));
            await dispatch(doShrinkLogo(true));
            await dispatch(doRevealLogo(true));
            if (location.pathname === '/preferences/main') {
              await dispatch(doReveal([]));
              await dispatch(doReveal(revealAll));
            }
          }}
        >
          <Flip right cascade>
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

export default Splash;
