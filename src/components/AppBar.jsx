import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doShrinkLogo, doRevealLogo, doReveal, doLogOut } from '../actions';

const revealAll = [
  'HEADER-TEXT',
  'USER-BTN',
  'NEW-USER-BTN',
  'QR-CODE-GEN-BTN',
  'ACTIVE-USERS-BTN',
  'CLIENTS-BTN',
  'ACTIVE-HISTORY-USERS-BTN',
];

const AppBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useSelector((state) => state.auth);

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const userLocal = localStorage.getItem('user');
      const { user } =
        userLocal !== null
          ? JSON.parse(userLocal)
          : { user: Date.now(), userId: '' };
      setTime(user - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hide on splash page
  if (location.pathname === '/') return null;

  const isSubPage =
    location.pathname !== '/dashboard' &&
    location.pathname !== '/preferences/main';

  const parentPath = location.pathname.replace(/\/([^/]+)\/?$/, '');

  const handleLogoClick = async () => {
    await dispatch(doRevealLogo(false));
    await dispatch(doShrinkLogo(true));
    await dispatch(doRevealLogo(true));
    if (location.pathname === '/preferences/main') {
      await dispatch(doReveal([]));
      await dispatch(doReveal(revealAll));
    }
  };

  const handleSignOut = () => {
    dispatch(doLogOut());
    navigate('/dashboard');
  };

  const remainTimeToLogout =
    time > 0 ? new Date(time).toISOString().substring(11, 19) : '';

  return (
    <nav className='stabraq-navbar d-flex align-items-center'>
      <Link
        to={isSignedIn ? '/preferences/main' : '/dashboard'}
        className='navbar-brand d-flex align-items-center'
        onClick={handleLogoClick}
      >
        <img src='/logo.png' alt='Logo' className='navbar-logo-img' />
        <span>STABRAQ</span>
      </Link>

      <div className='ms-auto d-flex align-items-center gap-2'>
        {isSubPage && (
          <Link to={parentPath || '/preferences/main'} className='nav-back-btn'>
            <i className='arrow left icon me-1' />
            Back
          </Link>
        )}

        {isSignedIn && remainTimeToLogout && (
          <span className='navbar-session-timer d-none d-sm-inline'>
            {remainTimeToLogout}
          </span>
        )}

        {isSignedIn && (
          <button className='navbar-signout-btn' onClick={handleSignOut} aria-label='Sign out'>
            <i className='sign-out icon' />
          </button>
        )}
      </div>
    </nav>
  );
};

export default AppBar;
