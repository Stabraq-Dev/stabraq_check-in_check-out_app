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

const NewUserForm = ({
  doShowMyModal,
  loading,
  doOnNewUserFormSubmit,
  initialValues,
}) => {
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
        <input {...input} placeholder={placeholder} maxLength={maxLength} />
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

  const onSubmit = (formValues) => {
    doOnNewUserFormSubmit(formValues);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={async (formValues) => {
        const errors = {};
        const { username, mobile, email, membership } = formValues;

        const validUserName = await checkForUserName(username);
        const validMobile = await checkForMobNum(mobile);
        const validEmail = await checkForEmail(email);
        const validMembership = await checkForMembership(membership);

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

        return errors;
      }}
      render={({ handleSubmit }) => (
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
