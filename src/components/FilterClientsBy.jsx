import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { doFilterClientsList, doFilterClientsListValue } from '../actions';

const FilterClientsBy = () => {
  const dispatch = useDispatch();
  const [filterBy, setFilterBy] = useState('Name');
  const [filterValue, setFilterValue] = useState('');

  const filterIndex = filterBy === 'Name' ? 1 : 0;
  const placeholder = filterBy === 'Name' ? 'arabic / english' : '01xxxxxxxx';
  const maxLength = filterBy === 'Mobile' ? 11 : '';

  const onChange = (e) => {
    const formValuesToFilter = e.target.value;
    setFilterValue(formValuesToFilter);
    dispatch(doFilterClientsListValue(formValuesToFilter))
    if (formValuesToFilter === undefined) {
      dispatch(doFilterClientsList(filterIndex, '', ''));
    } else if (formValuesToFilter === '') {
      dispatch(doFilterClientsList('', 'CLEAR_FILTER', ''));
    } else {
      dispatch(doFilterClientsList(filterIndex, formValuesToFilter, filterBy));
    }
  };
  const onClickResetFilter = () => {
    setFilterValue('');
    dispatch(doFilterClientsListValue(''))
    dispatch(doFilterClientsList('', 'CLEAR_FILTER', ''));
  };

  const renderFilterBar = () => {
    return (
      <div className='text-center'>
        <div className='text-center'>
          {renderFilterButtons()}
          <button
            className={`ui primary button me-3 mt-1`}
            type='button'
            onClick={onClickResetFilter}
          >
            Reset Filter
          </button>
        </div>
      </div>
    );
  };

  const renderFilterButtons = () => {
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
            onClickResetFilter()
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
    <>
      {renderFilterBar()}
      <div className='ui form segment error'>
        <input
          name={filterBy.toLowerCase()}
          label={`Filter by ${filterBy}`}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChange}
          value={filterValue}
        ></input>
      </div>
    </>
  );
};

export default FilterClientsBy;
