import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doRedirectToSignIn } from '../actions';
import MyModalUser from './MyModalUser';

function Preferences() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useSelector((state) => state.auth);
  if (isSignedIn) {
    return (
      <>
        <Outlet />
        <MyModalUser />
      </>
    );
  }
  return (
    <div className='login-container text-center'>
      <img src='/logo.png' alt='Logo' className='login-logo' />
      <div className='login-title'>Session Expired</div>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Your session has expired. Please sign in again.
      </p>
      <button
        className='ui primary button stabraq-bg'
        onClick={() => {
          dispatch(doRedirectToSignIn());
          navigate('/dashboard');
        }}
        type='button'
      >
        <i className='sign-in icon' />
        Sign In
      </button>
    </div>
  );
}

export default Preferences;
