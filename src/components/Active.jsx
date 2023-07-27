import { connect } from 'react-redux';

import {
  doGetActiveUsersList,
  doGetAllCheckedInUsers,
  doSetActiveSheetTitle,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';

import ActiveSheet from './ActiveSheet';
import { DATA_SHEET_ACTIVE_RANGE, DATA_SHEET_ACTIVE_TITLE } from '../ranges';
import { useEffect } from 'react';

const Active = (props) => {
  useEffect(() => {
    onStar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStar = async () => {
    await props.doSetActiveSheetTitle({
      title: DATA_SHEET_ACTIVE_TITLE,
      selectedMonth: '',
    });
    await props.doGetAllCheckedInUsers(DATA_SHEET_ACTIVE_RANGE);
    await props.doGetActiveUsersList();
  };

  if (props.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ActiveSheet />
    </>
  );
};

const mapStateToProps = (state) => {
  const { loading } = state.app;

  return {
    loading,
  };
};

export default connect(mapStateToProps, {
  doGetAllCheckedInUsers,
  doGetActiveUsersList,
  doSetActiveSheetTitle,
})(Active);
