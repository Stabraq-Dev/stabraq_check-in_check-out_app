import { useNavigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { doRedirectToSignIn } from '../actions';
import MyModalUser from './MyModalUser';

function Preferences({ isSignedIn, doRedirectToSignIn }) {
  const navigate = useNavigate();
  if (isSignedIn) {
    return (
      <>
        <Outlet/>
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
          doRedirectToSignIn;
          navigate('/dashboard')
        }}
        type='submit'
      >
        <i className='sign-in icon' />
        Go to sign in page
      </button>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { isSignedIn } = state.auth;
  return {
    isSignedIn,
  };
};

export default connect(mapStateToProps, { doRedirectToSignIn })(Preferences);
