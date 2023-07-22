import React from 'react';
import { renderError } from './renderError';

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

export const renderRadio = ({ input, label, meta, options, checked }) => {
  const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  return (
    <div className={className}>
      <label>{label}</label>
      {renderRadioOptions(input, options, checked)}
      {renderError(meta)}
    </div>
  );
};
