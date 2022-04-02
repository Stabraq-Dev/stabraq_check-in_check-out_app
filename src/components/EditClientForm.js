import React, { useEffect, useMemo } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';

import {
  doOnEditClientFormSubmit,
  doSetDatePicker,
  doShowMyModal,
} from '../actions';
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
import ResponsiveDatePickers from './ResponsiveDatePickers';
import createDecorator from 'final-form-calculate';
import {
  calculateUserData,
  checkDayDiffWithMinus,
} from '../functions/helperFunc';
import RatingBar from './RatingBar';

const EditClientForm = ({
  doShowMyModal,
  loading,
  doSetDatePicker,
  doOnEditClientFormSubmit,
  initialValues,
  row,
}) => {
  useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
      doShowMyModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculator = useMemo(
    () =>
      createDecorator(
        {
          field: 'expiryDate', // when expiryDate changes...
          updates: {
            // ...update remainDays to the result of this function
            remainDays: (expiryDateValue, allValues) => {
              const dateOne = new Date().toLocaleDateString('en-US');
              const dateTwo = expiryDateValue;
              const diffDays = checkDayDiffWithMinus(dateOne, dateTwo);
              const final = expiryDateValue === '' ? '' : diffDays.toString();
              return final;
            },
          },
        },
        {
          field: 'hoursPackages', // when hoursPackages changes...
          updates: {
            // ...update remainingHours to the result of this function
            remainingHours: (membershipValue, allValues) => {
              const { remainingHours } = calculateUserData(allValues);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.remainingHours
                  : remainingHours;
              return final;
            },
          },
        },
        {
          field: 'membership', // when membership changes...
          updates: {
            // ...update expiryDate to the result of this function
            expiryDate: (membershipValue, allValues) => {
              const { expiryDate } = calculateUserData(allValues);
              doSetDatePicker(expiryDate);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.expiryDate
                  : expiryDate;
              return final;
            },
            remainDays: (membershipValue, allValues) => {
              const remainDays =
                membershipValue === 'NOT_MEMBER' ? '' : allValues.remainDays;
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.remainDays
                  : remainDays;
              return final;
            },
            hoursPackages: (membershipValue, allValues) => {
              const { remainingHours } = calculateUserData(allValues);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.hoursPackages
                  : remainingHours;
              return final;
            },
            remainingHours: (membershipValue, allValues) => {
              const { remainingHours } = calculateUserData(allValues);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.remainingHours
                  : remainingHours;
              return final;
            },
            remainingOfTenDays: (membershipValue, allValues) => {
              const { remainingOfTenDays } = calculateUserData(allValues);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.remainingOfTenDays
                  : remainingOfTenDays;
              return final;
            },
            invitations: (membershipValue, allValues) => {
              const { invitations } = calculateUserData(allValues);
              const final =
                JSON.stringify(initialValues) === JSON.stringify(allValues)
                  ? initialValues.invitations
                  : invitations;
              return final;
            },
          },
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  const renderResponsiveDatePickers = ({ input: { onChange }, label }) => {
    return (
      <ResponsiveDatePickers
        label={label}
        initValue={initialValues.expiryDate}
        onDateChange={(newTime) => {
          onChange(newTime);
        }}
      />
    );
  };

  const renderRatingBar = ({ input: { onChange, value }, label }) => {
    return (
      <div className='field'>
        <label>{label}</label>
        <RatingBar
          onClick={(rate) => {
            onChange(rate / 20);
          }}
          ratingValue={value * 20}
          initialValue={initialValues.rating}
        />
      </div>
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
    formValues.username = formValues.username.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
    );

    formValues.email = formValues.email.toLowerCase();

    doOnEditClientFormSubmit(formValues, row);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      decorators={[calculator]}
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
          {values.membership !== 'NOT_MEMBER' && (
            <Field
              name='expiryDate'
              component={renderResponsiveDatePickers}
              label='Expiry Date'
            />
          )}
          {values.membership !== 'NOT_MEMBER' && (
            <Field
              name='remainDays'
              component={renderInput}
              label='Remain Days'
              type='text'
              disabled={true}
            />
          )}
          <Field
            name='registrationDateTime'
            component={renderInput}
            label='Registration Date / Time'
            type='text'
            disabled={true}
          />
          {values.membership === 'HOURS_MEMBERSHIP' && (
            <Field
              name='remainingHours'
              component={renderInput}
              label='Remaining Hours'
              type='text'
            />
          )}
          {values.membership === '10_DAYS' && (
            <Field
              name='remainingOfTenDays'
              component={renderInput}
              label='Remaining Of Ten Days'
              type='text'
            />
          )}
          {(values.membership === 'GREEN' ||
            values.membership === 'ORANGE' ||
            values.membership === 'BUSINESS') && (
            <Field
              name='invitations'
              component={renderInput}
              label='Invitations'
              type='text'
            />
          )}
          <Field
            name='rating'
            component={renderRatingBar}
            label='Rating'
            type='text'
          />
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
  const {
    mobileNumber,
    userName,
    eMailAddress,
    membership,
    expiryDate,
    remainDays,
    hoursPackage,
    registrationDateTime,
    remainingHours,
    remainingOfTenDays,
    invitations,
    rating,
    gender,
    offers,
  } = state.user.clientStateToEdit;
  return {
    loading,
    mobileNumber,
    userName,
    eMailAddress,
    membership,
    expiryDate,
    remainDays,
    hoursPackage,
    registrationDateTime,
    remainingHours,
    remainingOfTenDays,
    invitations,
    rating,
    gender,
    offers,
  };
};

export default connect(mapStateToProps, {
  doSetDatePicker,
  doOnEditClientFormSubmit,
  doShowMyModal,
})(EditClientForm);
