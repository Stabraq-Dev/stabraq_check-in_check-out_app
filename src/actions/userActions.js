import {
  SHOW_CHECK_IN_OUT,
  SEARCH_BY_MOBILE,
  SHEET_DATE,
  NEW_SHEET_ID,
  NUMBER_EXISTS,
  VALUES_MATCHED,
  ON_SEARCH_SUBMIT,
  ON_NEW_USER_SUBMIT,
  ON_CHECK_IN_OUT_SUBMIT,
  CHECK_IN_OUT_STATUS,
  CHECKED_IN_STATUS,
  CHECKED_OUT_STATUS,
  CLEAR_PREV_USER_STATE,
  CALC_DURATION_COST,
  ERROR,
  CALC_REMAINING_HOURS,
  CALC_REMAINING_OF_TEN_DAYS,
} from './types';

import { doLoading, doShowMyModal, submitType } from './appActions';

import {
  executeValuesUpdate,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCutPaste,
  executeValuesAppendAddSheet,
  executeValuesAppendNewUserData,
  executeValuesAppendCheckIn,
  executeValuesAppendCheckOut,
  getSheetValues,
  executeValuesUpdateCheckOut,
  executeBatchUpdateCopyToWorksheet,
  getWorkSheetData,
  executeBatchUpdateDeleteSheet,
  executeAddNewWorkSheet,
  executeBatchUpdateSheetPropertiesRenameSheet,
  executeChangeWorkSheetPermission,
} from '../functions/executeFunc';

import history from '../history';
import {
  changeYearMonthFormat,
  checkDayDiff,
  checkMonthDiff,
  getByValue,
} from '../functions/helperFunc';

export const doCheckedIn = (checkedInStatus) => {
  return {
    type: CHECKED_IN_STATUS,
    payload: checkedInStatus,
  };
};

export const doCheckedOut = (checkedOutStatus) => {
  return {
    type: CHECKED_OUT_STATUS,
    payload: checkedOutStatus,
  };
};

export const doShowCheckInOut = (showCheckInOutStatus) => {
  return {
    type: SHOW_CHECK_IN_OUT,
    payload: showCheckInOutStatus,
  };
};

export const doCheckInOutStatus = (checkInOutStatus) => {
  return {
    type: CHECK_IN_OUT_STATUS,
    payload: checkInOutStatus,
  };
};

export const searchMobileNumber = (mobile) => {
  if (history.location.pathname === '/preferences/main/user/check-in-out') {
    history.push('/preferences/main/user');
  }
  return {
    type: SEARCH_BY_MOBILE,
    payload: mobile,
  };
};

export const doClearPrevUserState = () => {
  return {
    type: CLEAR_PREV_USER_STATE,
  };
};

export const doCalcDurationCost = (resData) => {
  return {
    type: CALC_DURATION_COST,
    payload: resData,
  };
};

export const doCalcRemainingHours = (remains) => {
  return {
    type: CALC_REMAINING_HOURS,
    payload: remains,
  };
};

export const doCalcRemainingOfTenDays = (remains) => {
  return {
    type: CALC_REMAINING_OF_TEN_DAYS,
    payload: remains,
  };
};

export const doCreateNewSheet = () => async (dispatch, getState) => {
  const getSheetValuesSheetDateRange = 'Data!L1';
  const sheetDate = await getSheetValues(getSheetValuesSheetDateRange);
  dispatch({ type: SHEET_DATE, payload: sheetDate[0] });

  const dateOne = sheetDate[0];
  const dateTwo = new Date().toLocaleDateString();
  const diffDays = await checkDayDiff(dateOne, dateTwo);

  if (diffDays >= 1) {
    const newSheetId = await executeBatchUpdateAddSheet(sheetDate[0]);
    await dispatch(doCheckResponse(newSheetId));
    const errorNewSheetId = getState().app.error;
    if (errorNewSheetId.code === 400) return;
    await dispatch({ type: NEW_SHEET_ID, payload: newSheetId });
    await executeBatchUpdateCutPaste(newSheetId);
    await executeValuesAppendAddSheet();
    const getSheetValuesCurrMonthWorkSheet = 'Func!A12';
    const destWorkSheetId = await getSheetValues(
      getSheetValuesCurrMonthWorkSheet
    );

    const resCopyToWorksheet = await executeBatchUpdateCopyToWorksheet(
      newSheetId,
      destWorkSheetId[0]
    );
    await dispatch(doCheckResponse(resCopyToWorksheet));
    const errorResCopyToWorksheet = getState().app.error;
    if (errorResCopyToWorksheet.code === 500) return;

    await executeBatchUpdateDeleteSheet(newSheetId);

    let worksheetSheetsData = await getWorkSheetData(destWorkSheetId[0]);
    let sheetsIdsToRename = await getByValue(worksheetSheetsData, 'Copy of ');
    if (sheetsIdsToRename !== null) {
      sheetsIdsToRename.forEach(async (o) => {
        let title = o.title.replaceAll('Copy of ', '');
        await executeBatchUpdateSheetPropertiesRenameSheet(
          destWorkSheetId[0],
          o.id,
          title
        );
      });
    }
  }

  const diffMonths = await checkMonthDiff(dateOne, dateTwo);

  if (diffMonths >= 1) {
    const workSheetTitle = await changeYearMonthFormat(dateTwo);
    const newWorkSheetId = await executeAddNewWorkSheet(workSheetTitle);
    await executeChangeWorkSheetPermission(newWorkSheetId);
    await executeValuesUpdateCheckOut({
      value: newWorkSheetId,
      range: 'Func!A12',
    });
  }
};

export const doCheckResponse = (res) => async (dispatch, getState) => {
  const { showMyModal } = getState().app;

  if (res.status !== 200 && res.status !== undefined) {
    dispatch({ type: ERROR, payload: res });
    dispatch(doLoading(false));
    if (showMyModal) {
      dispatch(doShowMyModal(false));
    }
    dispatch(doShowMyModal(true));
    return;
  } else {
    dispatch({ type: ERROR, payload: '' });
  }
};

/**
 *
 * @o doSearchByMobile
 *
 */

export const doSearchByMobile = (mobile) => async (dispatch, getState) => {
  if (!navigator.onLine) return;
  const { showMyModal } = getState().app;

  dispatch(submitType(ON_SEARCH_SUBMIT));
  dispatch(doClearPrevUserState());

  if (history.location.pathname === '/preferences/main/user/check-in-out') {
    history.push('/preferences/main/user');
  }

  dispatch(doLoading(true));
  // Check to Add new Sheet for new day
  await dispatch(doCreateNewSheet());
  const { error } = getState().app;
  if (error.code === 400 || error.code === 500) return;
  // Search for the user by mobile number
  const res = await executeValuesUpdate(mobile);
  dispatch(doCheckResponse(res));

  const getSheetValuesNumberExistsRange = 'Func!B2';
  const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);
  dispatch({ type: NUMBER_EXISTS, payload: numberExists[0] });

  if (numberExists[0] === 'EXISTS') {
    const getSheetValuesMatchedRange = 'Func!C2:R2';
    const valuesMatched = await getSheetValues(getSheetValuesMatchedRange);
    dispatch({ type: VALUES_MATCHED, payload: valuesMatched });
  }

  await executeValuesUpdate('');

  dispatch(doLoading(false));
  dispatch(doShowCheckInOut(true));
  if (showMyModal) {
    dispatch(doShowMyModal(false));
  }
  dispatch(doShowMyModal(true));
};

/**
 *
 * @o doOnNewUserFormSubmit
 *
 */

export const doOnNewUserFormSubmit =
  (formValues) => async (dispatch, getState) => {
    if (!navigator.onLine) return;
    const { showMyModal } = getState().app;
    dispatch(submitType(ON_NEW_USER_SUBMIT));
    dispatch(doClearPrevUserState());

    dispatch(doLoading(true));
    // Check to Add new Sheet for new day
    await dispatch(doCreateNewSheet());
    const resUpdate = await executeValuesUpdate(formValues.mobile);
    dispatch(doCheckResponse(resUpdate));

    const getSheetValuesNumberExistsRange = 'Func!B2';
    const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);

    if (numberExists[0] === 'NOT_EXISTS') {
      const getSheetValuesLastBlankRowRange = 'Func!A4';
      const lastBlankRow = await getSheetValues(
        getSheetValuesLastBlankRowRange
      );
      const resAppend = await executeValuesAppendNewUserData(
        formValues,
        lastBlankRow
      );
      dispatch(doCheckResponse(resAppend));
    } else {
      dispatch({ type: NUMBER_EXISTS, payload: numberExists[0] });
    }

    dispatch(doLoading(false));
    dispatch(doShowCheckInOut(true));
    dispatch(searchMobileNumber(formValues.mobile));

    if (showMyModal) {
      dispatch(doShowMyModal(false));
    }
    dispatch(doShowMyModal(true));
  };

/**
 *
 * @o doCheckInOut
 *
 */

export const doCheckInOut =
  (checkInOutStatus, girlsRoomChecked, privateRoomChecked) =>
  async (dispatch, getState) => {
    if (!navigator.onLine) return;
    dispatch(submitType(ON_CHECK_IN_OUT_SUBMIT));
    dispatch(doCheckInOutStatus(checkInOutStatus));

    dispatch(doLoading(true));

    const { mobileNumber, userName, eMailAddress, membership, rowNumber } =
      getState().user.valuesMatched;

    if (checkInOutStatus === 'CHECK_IN') {
      /* CHECK_IN */
      if (rowNumber !== 'NOT_CHECKED_IN') {
        dispatch(doCheckedIn(true));
      } else {
        await executeValuesAppendCheckIn(
          checkInOutStatus,
          mobileNumber,
          userName,
          eMailAddress,
          membership,
          girlsRoomChecked,
          privateRoomChecked
        );
      }
    } else {
      /* CHECK_OUT */
      const {
        checkedOut,
        membership,
        remainingHours,
        clientRowNumber,
        girlsRoom,
        privateRoom,
      } = getState().user.valuesMatched;
      if (checkedOut === 'CHECKED_OUT') {
        dispatch(doCheckedOut(true));
      } else if (checkedOut === 'NOT_CHECKED_IN') {
        dispatch(doCheckedOut(false));
      } else {
        const hrRate = girlsRoom === 'GIRLS_ROOM' ? 12 : 10;
        const fullDayRate = girlsRoom === 'GIRLS_ROOM' ? 72 : 12;

        const getSheetValuesPrivateRoomRate = 'Func!A6';
        const privateRoomRate =
          privateRoom === 'PRIVATE_ROOM'
            ? await getSheetValues(getSheetValuesPrivateRoomRate)
            : '';

        await executeValuesAppendCheckOut(
          rowNumber,
          membership,
          hrRate,
          fullDayRate,
          privateRoom,
          privateRoomRate
        );
        const getSheetValuesDurationRange = `Data!H${rowNumber}:K${rowNumber}`;
        const resData = await getSheetValues(getSheetValuesDurationRange);
        dispatch(doCalcDurationCost(resData));
        if (membership === 'HOURS_MEMBERSHIP') {
          const { approxDuration } = getState().user.durationCost;
          const remains = remainingHours - approxDuration;
          await executeValuesUpdateCheckOut({
            value: remains,
            range: `Clients!I${clientRowNumber}`,
          });
          dispatch(doCalcRemainingHours(remains));
        } else if (membership === '10_DAYS') {
          const { remainingOfTenDays } = getState().user.valuesMatched;
          const remains = remainingOfTenDays - 1;
          await executeValuesUpdateCheckOut({
            value: remains,
            range: `Clients!J${clientRowNumber}`,
          });
          dispatch(doCalcRemainingOfTenDays(remains));
        }
      }
    }
    dispatch(doLoading(false));
    const { showMyModal } = getState().app;
    if (showMyModal) {
      await dispatch(doShowMyModal(false));
    }
    await dispatch(doShowMyModal(true));
  };
