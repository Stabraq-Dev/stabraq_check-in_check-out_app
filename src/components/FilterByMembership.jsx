import React from 'react';
import { Form, Field } from 'react-final-form';
import { renderSelectOptions } from './react-final-form/renderSelectOptions';
import { membershipOptions } from './react-final-form/options';
import { useDispatch } from 'react-redux';
import { doFilterActiveUsersList } from '../actions';

const FilterByMembership = () => {
  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    if (formValues.membership === undefined) {
      dispatch(doFilterActiveUsersList(3, '', ''));
    } else {
      dispatch(doFilterActiveUsersList(3, formValues.membership, 'membership'));
    }
  };

  return (
    <Form
      onSubmit={onSubmit /* NOT USED, but required */}
      validate={(formValues) => {
        setTimeout(() => onSubmit(formValues), 100);
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className='ui form segment error'>
          <Field
            name='membership'
            component={renderSelectOptions}
            label='Filter By Membership'
            options={membershipOptions}
          ></Field>
        </form>
      )}
    ></Form>
  );
};

export default FilterByMembership;
