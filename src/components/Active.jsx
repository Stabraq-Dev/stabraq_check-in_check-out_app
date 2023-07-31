import { useDispatch, useSelector } from 'react-redux';

import {
  doGetActiveUsersList,
  doGetAllCheckedInUsers,
  doSetActiveSheetTitle,
} from '../actions';
import LoadingSpinner from './LoadingSpinner';

import ActiveSheet from './ActiveSheet';
import { DATA_SHEET_ACTIVE_RANGE, DATA_SHEET_ACTIVE_TITLE } from '../ranges';
import { useEffect } from 'react';

const Active = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);
  useEffect(() => {
    onStar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStar = async () => {
    await dispatch(
      doSetActiveSheetTitle({
        title: DATA_SHEET_ACTIVE_TITLE,
        selectedMonth: '',
      })
    );
    await dispatch(doGetAllCheckedInUsers(DATA_SHEET_ACTIVE_RANGE));
    await dispatch(doGetActiveUsersList());
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ActiveSheet />
    </>
  );
};

export default Active;
