import React, { useEffect, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { doFilterClientsList } from '../actions';
import { renderInput } from './react-final-form/renderInput';

const FilterClientsBy = ({ doFilterClientsList, filterIndex, resetFilter }) => {
  const ref = useRef(null);
  const filterBy = filterIndex === 1 ? 'name' : 'mobile';
  const placeholder = filterIndex === 1 ? 'arabic / english' : '01xxxxxxxx';

  useEffect(() => {
    if (resetFilter) {
      ref.current.click();
    }
  }, [resetFilter]);

  const onSubmit = async (formValues) => {
    const formValuesToFilter =
      filterIndex === 1 ? formValues.name : formValues.mobile;
    if (formValuesToFilter === undefined) {
      await doFilterClientsList(filterIndex, '', '');
    } else {
      await doFilterClientsList(filterIndex, formValuesToFilter, filterBy);
    }
  };

  return (
    <Form
      initialValues={{ name: '', mobile: '' }}
      onSubmit={onSubmit /* NOT USED, but required */}
      validate={(formValues) => {
        setTimeout(() => onSubmit(formValues), 100);
      }}
      render={({ handleSubmit, form, submitting, pristine }) => (
        <form onSubmit={handleSubmit} className='ui form segment error'>
          <div className='text-center'>
            <button
              ref={ref}
              className={`ui primary button me-3 mt-1`}
              type='button'
              onClick={form.reset}
              disabled={submitting || pristine}
            >
              Reset Filter
            </button>
          </div>
          <Field
            name={filterBy}
            component={renderInput}
            label={`Filter by ${filterBy}`}
            maxLength={filterIndex === 0 ? 11 : ''}
            placeholder={placeholder}
          ></Field>
        </form>
      )}
    ></Form>
  );
};

export default connect(null, {
  doFilterClientsList,
})(FilterClientsBy);
