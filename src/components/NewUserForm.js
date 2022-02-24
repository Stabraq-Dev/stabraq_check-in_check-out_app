import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';

import { doOnNewUserFormSubmit, doShowMyModal } from '../actions';
import LoadingSpinner from './LoadingSpinner';
import {
  genderOptions,
  hoursPackagesOptions,
  membershipOptions,
} from './react-final-form/options';
import { renderSelectOptions } from './react-final-form/renderSelectOptions';
import { renderInput } from './react-final-form/renderInput';
import { renderRadio } from './react-final-form/renderRadio';
import { validate } from './react-final-form/validate';

const initialValues = JSON.parse(sessionStorage.getItem('formValues'));

const NewUserForm = ({ doShowMyModal, loading, doOnNewUserFormSubmit }) => {
  useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
      doShowMyModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSubmitButton = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    return (
      <button className='ui primary button stabraq-bg' type='submit'>
        <i className='chevron circle right icon me-1' />
        Submit
      </button>
    );
  };

  const renderOffersCheckbox = ({ input, label }) => {
    return (
      <div className='form-check form-check-inline me-3'>
        <input className='form-check-input m-2 p-3' {...input} />
        <label className='form-check-label mt-1 p-2'>{label}</label>
      </div>
    );
  };

  const onSubmit = (formValues) => {
    if (
      formValues.membership !== 'HOURS_MEMBERSHIP' &&
      formValues.hoursPackages
    ) {
      delete formValues.hoursPackages;
    }

    formValues.username = formValues.username.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
    );

    formValues.email = formValues.email.toLowerCase();

    doOnNewUserFormSubmit(formValues);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(formValues) => validate(formValues)}
      render={({ values, handleSubmit }) => (
        <form onSubmit={handleSubmit} className='ui form segment error'>
          <Field
            name='username'
            component={renderInput}
            label='User Name'
            placeholder='يفضل باللغة العربية'
          />
          <Field
            name='mobile'
            component={renderInput}
            label='Mobile'
            type='tel'
            placeholder='01xxxxxxxxx'
            maxLength={11}
          />
          <Field
            name='gender'
            component={renderRadio}
            label='Gender'
            type='radio'
            checked={values.gender}
            options={genderOptions}
          />
          <Field
            name='email'
            component={renderInput}
            label='E-Mail Address'
            type='text'
            placeholder='stabraq@stabraq.com'
          />
          <Field
            name='membership'
            component={renderSelectOptions}
            label='Membership'
            options={membershipOptions}
          ></Field>
          {values.membership === 'HOURS_MEMBERSHIP' && (
            <Field
              name='hoursPackages'
              component={renderSelectOptions}
              label='Hours Packages'
              options={hoursPackagesOptions}
            ></Field>
          )}
          <Field
            name='offers'
            label='Yes, I wish to receive offers from Stabraq'
            type='checkbox'
            component={renderOffersCheckbox}
          />
          <div className='mt-3 text-center'>{renderSubmitButton()}</div>
        </form>
      )}
    ></Form>
  );
};

const mapStateToProps = (state) => {
  const { loading } = state.app;
  return {
    loading,
  };
};

export default connect(mapStateToProps, {
  doOnNewUserFormSubmit,
  doShowMyModal,
})(NewUserForm);
