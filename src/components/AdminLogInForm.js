import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkForUserName } from '../functions/validation';
import { connect } from 'react-redux';
import { doLogIn, doLogOut } from '../actions';
import LoadingSpinner from './LoadingSpinner';
import history from '../history';

const AdminLogInForm = (props) => {
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
    if (props.loading) {
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
    if (props.wrongUserPass && !props.loading) {
      return (
        <div className='alert alert-danger' role='alert'>
          Invalid username and/or password. Please try again
        </div>
      );
    }
  };
  const onSubmit = (formValues) => {
    props.doLogIn(formValues);
  };
  if (props.isSignedIn) {
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
          onClick={() => props.doLogOut()}
          type='submit'
        >
          Log out
        </button>
      </div>
    );
  }
  return (
    <Form
      initialValues={props.initialValues}
      onSubmit={onSubmit}
      validate={async (formValues) => {
        const errors = {};

        if (!formValues.username) {
          errors.username = 'You must enter a user name';
        }

        const validUserName = await checkForUserName(formValues.username);

        if (!validUserName) {
          errors.username = 'You must enter valid user name';
        }

        if (!formValues.password) {
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
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.app.loading,
    wrongUserPass: state.auth.wrongUserPass,
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { doLogIn, doLogOut })(AdminLogInForm);
