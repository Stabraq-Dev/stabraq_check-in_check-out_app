import { Form, Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { checkForUserName } from '../functions/validation';
import { doLogIn, doLogOut } from '../actions';
import LoadingSpinner from './LoadingSpinner';

const AdminLogInForm = ({ initialValues }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);
  const { isSignedIn, wrongUserPass, fromURL } = useSelector(
    (state) => state.auth
  );

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className='ui error message'>
          <div className='header'>{error}</div>
        </div>
      );
    }
  };

  const renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete='off' />
        {renderError(meta)}
      </div>
    );
  };

  const renderSubmitButton = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    return (
      <button className='ui primary button stabraq-bg' type='submit'>
        <i className='sign-in icon' />
        Sign In
      </button>
    );
  };

  const renderWrongUserPass = () => {
    if (wrongUserPass && !loading) {
      return (
        <div className='alert alert-danger' role='alert'>
          Invalid username and/or password. Please try again
        </div>
      );
    }
  };

  const onSubmit = async (formValues) => {
    const signedIn = await dispatch(doLogIn(formValues));

    if (signedIn[0] === 'TRUE') {
      if (fromURL) {
        navigate(fromURL);
      } else {
        navigate('/preferences/main');
      }
    }
  };

  if (isSignedIn) {
    return (
      <div className='ui segment text-center'>
        <h1>You already signed in</h1>
        <button
          className='ui primary button stabraq-bg'
          onClick={() => navigate('/preferences/main')}
          type='submit'
        >
          Go to Main page
        </button>
        <button
          className='ui red button'
          onClick={() => {
            dispatch(doLogOut());
            navigate('/dashboard');
          }}
          type='submit'
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={async (formValues) => {
          const errors = {};
          const { username, password } = formValues;

          const validUserName = await checkForUserName(username);

          if (validUserName) {
            errors.username = validUserName;
          }

          if (!password) {
            errors.password = 'You must enter a password';
          }

          return errors;
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className='ui form error'>
            <Field name='username' component={renderInput} label='User Name' />
            <Field
              name='password'
              component={renderInput}
              label='Password'
              type='password'
            />
            <div className='mt-3 text-center'>{renderWrongUserPass()}</div>
            <div className='mt-3 text-center'>{renderSubmitButton()}</div>
          </form>
        )}
      ></Form>
    </div>
  );
};

export default AdminLogInForm;
