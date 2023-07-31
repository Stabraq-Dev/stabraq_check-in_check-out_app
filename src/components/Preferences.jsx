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
    <div className='text-center'>
      <div className='alert alert-danger mt-5' role='alert'>
        You need to login first!
      </div>
      <button
        className='ui primary button stabraq-bg'
        onClick={() => {
          dispatch(doRedirectToSignIn);
          navigate('/dashboard');
        }}
        type='submit'
      >
        <i className='sign-in icon' />
        Go to sign in page
      </button>
    </div>
  );
}

export default Preferences;
