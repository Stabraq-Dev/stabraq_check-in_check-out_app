import React from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { doFilterClientsUsersList } from '../actions';
import { renderInput } from './react-final-form/renderInput';

const FilterByname = ({ doFilterClientsUsersList }) => {
  const onSubmit = async (formValues) => {
    if (formValues.name === undefined) {
      await doFilterClientsUsersList(1, '', '');
    } else {
      await doFilterClientsUsersList(1, formValues.name, 'name');
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
            name='name'
            component={renderInput}
            label='Filter By Name'
          ></Field>
        </form>
      )}
    ></Form>
  );
};

export default connect(null, {
  doFilterClientsUsersList,
})(FilterByname);
