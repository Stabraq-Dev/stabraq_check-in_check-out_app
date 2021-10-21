import React from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';

import { checkForUserName } from '../functions/validation';
import { doLogIn, doLogOut } from '../actions';
import LoadingSpinner from './LoadingSpinner';
import history from '../history';

const AdminLogInForm = ({
  initialValues,
  loading,
  wrongUserPass,
  isSignedIn,
  doLogIn,
  doLogOut,
}) => {
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

  const onSubmit = (formValues) => {
    doLogIn(formValues);
  };

  if (isSignedIn) {
    return (
      <div className='ui segment text-center'>
        <h1>You already signed in</h1>
        <button
          className='ui primary button stabraq-bg'
          onClick={() => history.push('/preferences/main')}
          type='submit'
        >
          Go to Main page
        </button>
        <button
          className='ui red button'
          onClick={() => doLogOut()}
          type='submit'
        >
          Log out
        </button>
      </div>
    );
  }

  return (
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
          errors.password = 'You Must Enter a Password';
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
  );
};

const mapStateToProps = (state) => {
  const { isSignedIn, wrongUserPass } = state.auth;
  const { loading } = state.app;
  return {
    loading,
    wrongUserPass,
    isSignedIn,
  };
};

export default connect(mapStateToProps, { doLogIn, doLogOut })(AdminLogInForm);
