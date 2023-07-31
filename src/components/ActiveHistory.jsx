import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { renderSelectOptions } from './react-final-form/renderSelectOptions';

import {
  doGetAllWorkSheetsList,
  doGetAllSheetsList,
  doSetDayAsActiveHistory,
  doClearActiveHistoryLists,
  doGetUserHistory,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';

import ActiveSheet from './ActiveSheet';

export const ActiveHistory = () => {
  const dispatch = useDispatch();
  const {
    listAllFilesFiltered,
    listAllSheetsFiltered,
    allCheckedInUsers,
    userHistoryData,
  } = useSelector((state) => state.user);
  const { mobileNumber } = useSelector((state) => state.user.valuesMatched);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  useEffect(() => {
    onStart();

    return () => {
      onExit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStart = async () => {
    setTimeout(async () => {
      dispatch(doGetAllWorkSheetsList());
    }, 100);
  };

  const onExit = async () => {
    dispatch(doClearActiveHistoryLists());
  };

  const onSubmitMonth = async (formValues) => {
    console.log(formValues);
  };
  const onMonthChange = async (month) => {
    setSelectedMonth(month);
    dispatch(doGetAllSheetsList(month));
  };

  const onFilterByMobile = async () => {
    dispatch(doGetUserHistory(mobileNumber, selectedMonth));
  };

  const onSubmitDay = async (formValues) => {
    console.log(formValues);
  };
  const onDayChange = async (id) => {
    setSelectedDay(id);
    if (id) dispatch(doSetDayAsActiveHistory(id, selectedMonth));
  };

  const renderFilterByMonth = () => {
    if (listAllFilesFiltered.length <= 1) {
      return <LoadingSpinner />;
    }
    return (
      <Form
        onSubmit={onSubmitMonth /* NOT USED, but required */}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className='ui form segment error'>
            <Field
              name='month'
              component={renderSelectOptions}
              label='Filter By Month'
              options={listAllFilesFiltered}
              parse={(value) => {
                onMonthChange(value);
                return value;
              }}
            ></Field>
          </form>
        )}
      ></Form>
    );
  };

  const renderFilterByMobile = () => {
    return (
      <button
        className='ui primary button stabraq-bg'
        onClick={onFilterByMobile}
        type='submit'
      >
        <i className='chevron circle right icon me-1' />
        Get History of {mobileNumber}
      </button>
    );
  };
  const renderRecords = (record) => {
    return record.map((ele, idx) => {
      return ele.map((e, i) => {
        return <td key={i}>{e}</td>;
      });
    });
  };
  const renderUserHistoryData = () => {
    return userHistoryData.map((ele, idx) => {
      return (
        <div key={idx} className='table-responsive'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th scope='col'>{ele.day}</th>
              </tr>
            </thead>

            <tbody>
              <tr>{renderRecords(ele.record)}</tr>
            </tbody>
          </table>
        </div>
      );
    });
  };

  const renderFilterByDay = () => {
    return (
      <Form
        onSubmit={onSubmitDay /* NOT USED, but required */}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className='ui form segment error'>
            <Field
              name='day'
              component={renderSelectOptions}
              label='Filter By Day'
              options={listAllSheetsFiltered}
              parse={(value) => {
                onDayChange(value);
                return value;
              }}
            ></Field>
          </form>
        )}
      ></Form>
    );
  };

  return (
    <>
      {renderFilterByMonth()}
      {selectedMonth && mobileNumber && renderFilterByMobile()}
      {listAllSheetsFiltered.length > 1 && renderFilterByDay()}
      {userHistoryData.length > 0 && renderUserHistoryData()}
      {allCheckedInUsers.length > 0 && selectedMonth && selectedDay && (
        <ActiveSheet />
      )}
    </>
  );
};

export default ActiveHistory;
