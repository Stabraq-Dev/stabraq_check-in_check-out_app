import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';

import {
  checkForUserName,
  checkForMobNum,
  checkForEmail,
  checkForMembership,
} from '../functions/validation';
import { doOnNewUserFormSubmit, doShowMyModal } from '../actions';
import LoadingSpinner from './LoadingSpinner';

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

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className='ui error message'>
          <h4 className='ui header'>{error}</h4>
        </div>
      );
    }
  };

  const renderInput = ({ input, label, meta, placeholder, maxLength }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          {...input}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete='off'
        />
        {renderError(meta)}
      </div>
    );
  };

  const renderOptions = (input, options) => {
    return (
      <select {...input}>
        {options.map((o) => {
          return (
            <option key={o.key} value={o.value}>
              {o.text}
            </option>
          );
        })}
      </select>
    );
  };

  const renderSelect = ({ input, label, meta, options }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        {renderOptions(input, options)}
        {renderError(meta)}
      </div>
    );
  };

  const renderRadioOptions = (input, options, checked) => {
    return (
      <React.Fragment>
        {options.map((o) => {
          return (
            <div className='form-check form-check-inline' key={o.key}>
              <input
                {...input}
                checked={checked === o.value ? true : false}
                value={o.value}
                className='btn-check ms-1'
                id={o.value}
                autoComplete='off'
              />
              <label className='btn btn-outline-stabraq' htmlFor={o.value}>
                {o.label}
              </label>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  const renderRadio = ({ input, label, meta, options, checked }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        {renderRadioOptions(input, options, checked)}
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
      validate={async (formValues) => {
        const errors = {};
        const { username, mobile, email, membership, hoursPackages, gender } =
          formValues;

        const validUserName = await checkForUserName(username);
        const validMobile = await checkForMobNum(mobile);
        const validEmail = await checkForEmail(email);
        const validMembership = await checkForMembership(membership);
        const validHoursPackages = await checkForMembership(hoursPackages);
        const validGender = await checkForMembership(gender);

        if (validUserName) {
          errors.username = validUserName;
        }

        if (validMobile) {
          errors.mobile = validMobile;
        }

        if (validEmail) {
          errors.email = validEmail;
        }

        if (validMembership) {
          errors.membership = validMembership;
        }

        if (validHoursPackages && membership === 'HOURS_MEMBERSHIP') {
          errors.hoursPackages = 'Please select a package';
        }

        if (validGender) {
          errors.gender = 'Please select a gender';
        }

        return errors;
      }}
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
            options={[
              { key: 0, value: 'Male', label: 'Male' },
              { key: 1, value: 'Female', label: 'Female' },
            ]}
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
            component={renderSelect}
            label='Membership'
            options={[
              { key: 0, value: '', text: '...Select...' },
              { key: 1, value: 'NOT_MEMBER', text: 'Not Member' },
              { key: 2, value: 'GREEN', text: 'Green' },
              { key: 3, value: 'ORANGE', text: 'Orange' },
              { key: 4, value: 'BUSINESS', text: 'Business' },
              { key: 5, value: '10_DAYS', text: 'Ten Days' },
              { key: 6, value: 'HOURS_MEMBERSHIP', text: 'Hours' },
            ]}
          ></Field>
          {values.membership === 'HOURS_MEMBERSHIP' && (
            <Field
              name='hoursPackages'
              component={renderSelect}
              label='Hours Packages'
              options={[
                { key: 0, value: '', text: '...Select...' },
                { key: 1, value: 50, text: '50 Hours' },
                { key: 2, value: 100, text: '100 Hours' },
                { key: 3, value: 150, text: '150 Hours' },
                { key: 4, value: 250, text: '250 Hours' },
                { key: 5, value: 500, text: '500 Hours' },
              ]}
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
