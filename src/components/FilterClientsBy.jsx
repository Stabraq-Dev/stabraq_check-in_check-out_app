import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { doFilterClientsList } from '../actions';
import { renderInput } from './react-final-form/renderInput';

const FilterClientsBy = ({ doFilterClientsList }) => {
  const [filterBy, setFilterBy] = useState('Name');

  const filterIndex = filterBy === 'Name' ? 1 : 0;
  const placeholder = filterBy === 'Name' ? 'arabic / english' : '01xxxxxxxx';
  const maxLength = filterBy === 'Mobile' ? 11 : '';

  const onSubmit = async (formValues) => {
    const formValuesToFilter =
      filterBy === 'Name' ? formValues.name : formValues.mobile;
    if (formValuesToFilter === undefined) {
      await doFilterClientsList(filterIndex, '', '');
    } else {
      await doFilterClientsList(filterIndex, formValuesToFilter, filterBy);
    }
  };

  const renderFilterBar = (form, submitting, pristine) => {
    return (
      <div className='text-center'>
        <div className='text-center'>
          {renderFilterButtons(form)}
          <button
            className={`ui primary button me-3 mt-1`}
            type='button'
            onClick={form.reset}
            disabled={submitting || pristine}
          >
            Reset Filter
          </button>
        </div>
      </div>
    );
  };

  const renderFilterButtons = (form) => {
    const buttons = [
      { name: 'filterByName', filterMapIndex: 1, value: 'Name' },
      { name: 'filterByMobile', filterMapIndex: 0, value: 'Mobile' },
    ];

    return buttons.map((active) => {
      const { name, filterMapIndex, value } = active;
      const activeClass = filterBy === value ? 'bg-dark' : 'stabraq-bg';
      return (
        <button
          key={filterMapIndex}
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name={name}
          onClick={(e) => {
            setFilterBy(e.target.value);
            form.reset();
          }}
          type='submit'
          value={value}
        >
          {value}
        </button>
      );
    });
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
          {renderFilterBar(form, submitting, pristine)}
          <Field
            name={filterBy.toLowerCase()}
            component={renderInput}
            label={`Filter by ${filterBy}`}
            maxLength={maxLength}
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
