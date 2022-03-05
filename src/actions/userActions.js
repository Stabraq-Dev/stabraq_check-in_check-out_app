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
  INVITE_VALUES_MATCHED,
  INVITE_NUMBER_EXISTS,
  CLEAR_PREV_INVITE_USER_STATE,
  HOURS_DAILY_RATES,
  ACTIVE_USERS_LIST,
  ON_UPDATE_CHECK_IN_SUBMIT,
  ON_DELETE_CHECK_IN_SUBMIT,
  ON_CONFIRM_DELETE_CHECK_IN_SUBMIT,
  ON_UPDATE_CHECK_OUT_SUBMIT,
  ON_CONFIRM_DELETE_CHECK_OUT_SUBMIT,
  ON_DELETE_CHECK_OUT_SUBMIT,
  NON_ACTIVE_USERS_LIST,
  ACTIVE_USERS_LIST_FILTERED,
  NON_ACTIVE_USERS_LIST_FILTERED,
  ACTIVE_SHEET_FILTERED_BY,
  CLIENTS_LIST,
  CLIENT_STATE_TO_EDIT,
  ON_EDIT_CLIENT_SUBMIT,
  CLIENTS_LIST_FILTERED,
} from './types';

import { doLoading, doShowMyModal, submitType } from './appActions';

import {
  executeValuesUpdate,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCopyPaste,
  executeValuesBatchClear,
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
  getSheetValuesBatchGet,
  executeValuesAppendUserComment,
  executeBatchUpdateDeleteRange,
  executeValuesAppendUpdateCheckIn,
  executeValuesAppendUpdateCheckOut,
  executeValuesAppendDeleteCheckOut,
  executeValuesUpdateEditClient,
} from '../functions/executeFunc';

import history from '../history';
import {
  changeYearMonthFormat,
  checkDayDiff,
  checkMonthDiff,
  getByValue,
} from '../functions/helperFunc';

import {
  CLIENTS_SHEET_CLIENTS_RANGE,
  CURR_MONTH_WORKSHEET_RANGE,
  DATA_SHEET_ACTIVE_RANGE,
  DATA_SHEET_DATE_RANGE,
  DURATION_RANGE,
  HOURS_DAILY_RATES_RANGE,
  INVITATIONS_RANGE,
  LAST_BLANK_ROW_RANGE,
  NUMBER_EXISTS_RANGE,
  RATING_RANGE,
  REMAINING_HOURS_RANGE,
  REMAINING_OF_TEN_DAYS_RANGE,
  SINGLE_CLIENT_RANGE,
  VALUES_MATCHED_RANGES,
} from '../ranges';

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

export const doClearPrevInviteUserState = () => {
  return {
    type: CLEAR_PREV_INVITE_USER_STATE,
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
export const doGetHoursDailyRates = () => async (dispatch) => {
  const hoursDailyRates = await getSheetValues(HOURS_DAILY_RATES_RANGE);
  dispatch({ type: HOURS_DAILY_RATES, payload: hoursDailyRates[0] });
};

export const doCreateNewSheet = () => async (dispatch, getState) => {
  const sheetDate = await getSheetValues(DATA_SHEET_DATE_RANGE);
  dispatch({ type: SHEET_DATE, payload: sheetDate[0][0] });

  const dateOne = sheetDate[0][0];
  const dateTwo = new Date().toLocaleDateString();
  const diffDays = await checkDayDiff(dateOne, dateTwo);

  if (diffDays >= 1) {
    const newSheetId = await executeBatchUpdateAddSheet(sheetDate[0][0]);
    await dispatch(doCheckResponse(newSheetId));
    const errorNewSheetId = getState().app.error;
    if (errorNewSheetId.code === 400) return;
    await dispatch({ type: NEW_SHEET_ID, payload: newSheetId });
    await executeBatchUpdateCopyPaste(newSheetId);
    await executeValuesBatchClear();
    await executeValuesAppendAddSheet();

    const destWorkSheetId = await getSheetValues(CURR_MONTH_WORKSHEET_RANGE);

    const resCopyToWorksheet = await executeBatchUpdateCopyToWorksheet(
      newSheetId,
      destWorkSheetId[0][0]
    );
    await dispatch(doCheckResponse(resCopyToWorksheet));
    const errorResCopyToWorksheet = getState().app.error;
    if (errorResCopyToWorksheet.code === 500) return;

    await executeBatchUpdateDeleteSheet(newSheetId);

    let worksheetSheetsData = await getWorkSheetData(destWorkSheetId[0][0]);
    let sheetsIdsToRename = await getByValue(worksheetSheetsData, 'Copy of ');
    if (sheetsIdsToRename !== null) {
      sheetsIdsToRename.forEach(async (o) => {
        let title = o.title.replaceAll('Copy of ', '');
        await executeBatchUpdateSheetPropertiesRenameSheet(
          destWorkSheetId[0][0],
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
      range: CURR_MONTH_WORKSHEET_RANGE,
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

export const doGetActiveUsersList = () => async (dispatch) => {
  dispatch(doLoading(true));
  const allCheckedInUsers = await getSheetValues(DATA_SHEET_ACTIVE_RANGE);
  if (allCheckedInUsers) {
    const activeUsers = allCheckedInUsers.filter(
      (value) => value[10] !== 'CHECKED_OUT'
    );
    const nonActiveUsers = allCheckedInUsers.filter(
      (value) => value[10] === 'CHECKED_OUT'
    );
    await dispatch({ type: ACTIVE_USERS_LIST, payload: activeUsers });
    await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: nonActiveUsers });
  } else {
    await dispatch({ type: ACTIVE_USERS_LIST, payload: [] });
    await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: [] });
  }
  dispatch(doLoading(false));
};

export const doSortActiveUsersList = (index) => async (dispatch, getState) => {
  const { activeUsersList, nonActiveUsersList } = getState().user;
  const activeUsersSorted = (list) =>
    list.sort((a, b) => {
      const one = Date.parse(
        `${new Date().toLocaleDateString('en-US')} ${a[index]}`
      ).toString();
      const two = Date.parse(
        `${new Date().toLocaleDateString('en-US')} ${b[index]}`
      ).toString();

      return index === 5
        ? one.localeCompare(two)
        : a[index].localeCompare(b[index]);
    });

  const activeSorted =
    index === 6 ? activeUsersList : activeUsersSorted(activeUsersList);
  const nonActiveSorted = activeUsersSorted(nonActiveUsersList);

  await dispatch({ type: ACTIVE_USERS_LIST, payload: activeSorted });
  await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: nonActiveSorted });
};

export const doOrderSortActiveUsersList = () => async (dispatch, getState) => {
  const { activeUsersList, nonActiveUsersList } = getState().user;
  const activeUsersSorted = (list) => list.reverse();

  const activeSorted = activeUsersSorted(activeUsersList);
  const nonActiveSorted = activeUsersSorted(nonActiveUsersList);

  await dispatch({ type: ACTIVE_USERS_LIST, payload: activeSorted });
  await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: nonActiveSorted });
};

export const doFilterActiveUsersList =
  (index, filterValue, filterBy) => async (dispatch, getState) => {
    const { activeUsersList, nonActiveUsersList } = getState().user;
    const activeUsersSorted = (list) =>
      list.filter((value) => value[index] === filterValue);

    const activeFiltered = activeUsersSorted(activeUsersList);
    const nonActiveFiltered = activeUsersSorted(nonActiveUsersList);

    await dispatch({
      type: ACTIVE_SHEET_FILTERED_BY,
      payload: { filterBy: filterBy, filterValue: filterValue },
    });
    await dispatch({
      type: ACTIVE_USERS_LIST_FILTERED,
      payload: activeFiltered,
    });
    await dispatch({
      type: NON_ACTIVE_USERS_LIST_FILTERED,
      payload: nonActiveFiltered,
    });
  };

export const doGetClientsList = () => async (dispatch) => {
  dispatch(doLoading(true));
  const clientsList = await getSheetValues(CLIENTS_SHEET_CLIENTS_RANGE);

  await dispatch({ type: CLIENTS_LIST, payload: clientsList });

  dispatch(doLoading(false));
};

export const doGetSingleClient = (rowNumber) => async (dispatch) => {
  dispatch(doLoading(true));
  const range = SINGLE_CLIENT_RANGE(rowNumber);
  const clientData = await getSheetValues(range);

  await dispatch({ type: CLIENT_STATE_TO_EDIT, payload: clientData[0] });

  dispatch(doLoading(false));
};

export const setClientStateToEdit = (active) => async (dispatch) => {
  dispatch(doLoading(true));

  await dispatch({ type: CLIENT_STATE_TO_EDIT, payload: active });

  dispatch(doLoading(false));
};

export const doFilterClientsList =
  (index, filterValue, filterBy) => async (dispatch, getState) => {
    const { clientsList } = getState().user;
    const clientsListFiltered = clientsList.filter((value) =>
      value[index].toLowerCase().includes(filterValue.toLowerCase())
    );

    await dispatch({
      type: CLIENTS_LIST_FILTERED,
      payload: clientsListFiltered,
    });
  };

export const doConfirmDeleteUserCheckIn = () => async (dispatch, getState) => {
  dispatch(submitType(ON_CONFIRM_DELETE_CHECK_IN_SUBMIT));
  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
};

export const doDeleteUserCheckIn = () => async (dispatch, getState) => {
  const { rowNumber } = getState().user.valuesMatched;
  dispatch(doLoading(true));
  dispatch(submitType(ON_DELETE_CHECK_IN_SUBMIT));
  await executeBatchUpdateDeleteRange(rowNumber);
  dispatch(doLoading(false));

  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
};

export const doConfirmDeleteUserCheckOut = () => async (dispatch, getState) => {
  dispatch(submitType(ON_CONFIRM_DELETE_CHECK_OUT_SUBMIT));
  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
};

export const doDeleteUserCheckOut = () => async (dispatch, getState) => {
  const { rowNumber } = getState().user.valuesMatched;
  dispatch(doLoading(true));
  dispatch(submitType(ON_DELETE_CHECK_OUT_SUBMIT));
  await executeValuesAppendDeleteCheckOut(rowNumber);
  dispatch(doLoading(false));

  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
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

  const numberExists = await getSheetValues(NUMBER_EXISTS_RANGE);
  dispatch({ type: NUMBER_EXISTS, payload: numberExists[0][0] });

  if (numberExists[0][0] === 'EXISTS') {
    const valuesMatched = await getSheetValuesBatchGet(VALUES_MATCHED_RANGES);
    dispatch({ type: VALUES_MATCHED, payload: valuesMatched });
  }

  await executeValuesUpdate('');

  await dispatch(doGetHoursDailyRates());

  dispatch(doLoading(false));
  dispatch(doShowCheckInOut(true));
  if (showMyModal) {
    dispatch(doShowMyModal(false));
  }
  dispatch(doShowMyModal(true));
};

export const doCheckByMobile = (mobile) => async (dispatch, getState) => {
  if (!navigator.onLine) return;

  dispatch(doClearPrevInviteUserState());
  dispatch(doLoading(true));
  // Search for the user by mobile number
  const res = await executeValuesUpdate(mobile);
  dispatch(doCheckResponse(res));

  dispatch({ type: INVITE_NUMBER_EXISTS, payload: '' });
  const numberExists = await getSheetValues(NUMBER_EXISTS_RANGE);
  dispatch({ type: INVITE_NUMBER_EXISTS, payload: numberExists[0][0] });

  if (numberExists[0][0] === 'EXISTS') {
    const valuesMatched = await getSheetValuesBatchGet(VALUES_MATCHED_RANGES);
    dispatch({ type: INVITE_VALUES_MATCHED, payload: valuesMatched });
  }

  await executeValuesUpdate('');

  dispatch(doLoading(false));
};

/**
 *
 * @o doOnNewUserFormSubmit
 *
 */

export const doOnNewUserFormSubmit =
  (formValues) => async (dispatch, getState) => {
    sessionStorage.setItem('formValues', JSON.stringify(formValues));

    if (!navigator.onLine) return;
    const { showMyModal } = getState().app;
    dispatch(submitType(ON_NEW_USER_SUBMIT));
    dispatch(doClearPrevUserState());

    dispatch(doLoading(true));
    // Check to Add new Sheet for new day
    await dispatch(doCreateNewSheet());
    const resUpdate = await executeValuesUpdate(formValues.mobile);
    dispatch(doCheckResponse(resUpdate));

    const numberExists = await getSheetValues(NUMBER_EXISTS_RANGE);

    if (numberExists[0][0] === 'NOT_EXISTS') {
      const lastBlankRow = await getSheetValues(LAST_BLANK_ROW_RANGE);
      const resAppend = await executeValuesAppendNewUserData(
        formValues,
        lastBlankRow[0]
      );
      dispatch(doCheckResponse(resAppend));
    } else {
      dispatch({ type: NUMBER_EXISTS, payload: numberExists[0][0] });
    }

    await executeValuesUpdate('');
    const { error } = getState().app;
    if (error === '') {
      sessionStorage.removeItem('formValues');
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
 * @o doOnEditClientFormSubmit
 *
 */

export const doOnEditClientFormSubmit =
  (formValues, rowNumber) => async (dispatch, getState) => {
    if (!navigator.onLine) return;
    const { showMyModal } = getState().app;
    dispatch(submitType(ON_EDIT_CLIENT_SUBMIT));

    dispatch(doLoading(true));
    await executeValuesUpdateEditClient(formValues, rowNumber);
    dispatch(doLoading(false));

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
  (
    checkInOutStatus,
    roomChecked,
    inviteNumberExists,
    invitationByMobileUser,
    ratingValue,
    commentText
  ) =>
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
          roomChecked,
          inviteNumberExists,
          invitationByMobileUser
        );
      }
    } else {
      /* CHECK_OUT */
      const {
        checkedOut,
        membership,
        remainingHours,
        clientRowNumber,
        roomChecked,
        invite,
        inviteByMobile,
      } = getState().user.valuesMatched;
      const {
        trainingRoomRate,
        privateRoomRate,
        sharedHourRate,
        sharedFullDayRate,
        girlsHourRate,
        girlsFullDayRate,
      } = getState().user.hoursDailyRates;
      if (checkedOut === 'CHECKED_OUT') {
        dispatch(doCheckedOut(true));
      } else if (checkedOut === 'NOT_CHECKED_IN') {
        dispatch(doCheckedOut(false));
      } else {
        const hrRate =
          roomChecked === 'GIRLS_ROOM' ? girlsHourRate : sharedHourRate;
        const fullDayRate =
          roomChecked === 'GIRLS_ROOM' ? girlsFullDayRate : sharedFullDayRate;

        const privateRoomRateFinal =
          roomChecked === 'PRIVATE_ROOM' ? privateRoomRate : '';

        const trainingRoomRateFinal =
          roomChecked === 'TRAINING_ROOM' ? trainingRoomRate : '';

        await executeValuesAppendCheckOut(
          rowNumber,
          membership,
          hrRate,
          fullDayRate,
          roomChecked,
          privateRoomRateFinal,
          trainingRoomRateFinal,
          invite
        );

        const range = DURATION_RANGE(rowNumber);
        const resData = await getSheetValues(range);
        dispatch(doCalcDurationCost(resData[0]));
        if (membership === 'HOURS_MEMBERSHIP' && roomChecked === 'NO') {
          const { approxDuration } = getState().user.durationCost;
          const finalRemains =
            remainingHours % 1 === 0 ? remainingHours - 0.4 : remainingHours;
          const remains = parseFloat(
            (finalRemains - approxDuration).toFixed(2)
          );
          await executeValuesUpdateCheckOut({
            value: remains,
            range: REMAINING_HOURS_RANGE(clientRowNumber),
          });
          dispatch(doCalcRemainingHours(remains));
        } else if (membership === '10_DAYS' && roomChecked === 'NO') {
          const { remainingOfTenDays } = getState().user.valuesMatched;
          const remains = remainingOfTenDays - 1;
          await executeValuesUpdateCheckOut({
            value: remains,
            range: REMAINING_OF_TEN_DAYS_RANGE(clientRowNumber),
          });
          dispatch(doCalcRemainingOfTenDays(remains));
        } else if (invite === 'EXISTS' && roomChecked === 'NO') {
          await executeValuesUpdate(inviteByMobile);
          const valuesMatched = await getSheetValuesBatchGet(
            VALUES_MATCHED_RANGES
          );
          dispatch({ type: INVITE_VALUES_MATCHED, payload: valuesMatched });
          await executeValuesUpdate('');

          const { invitations, clientRowNumber } =
            getState().user.inviteValuesMatched;

          const remains = invitations - 1;
          await executeValuesUpdateCheckOut({
            value: remains,
            range: INVITATIONS_RANGE(clientRowNumber),
          });

          dispatch(doClearPrevInviteUserState());
        }

        await executeValuesUpdateCheckOut({
          value: ratingValue,
          range: RATING_RANGE(clientRowNumber),
        });

        if (commentText) {
          const { mobileNumber } = getState().user.valuesMatched;
          await executeValuesAppendUserComment(
            mobileNumber,
            userName,
            commentText,
            ratingValue
          );
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

export const doUpdateCheckIn =
  (roomChecked, inviteNumberExists, invitationByMobileUser, newCheckInTime) =>
  async (dispatch, getState) => {
    if (!navigator.onLine) return;
    dispatch(submitType(ON_UPDATE_CHECK_IN_SUBMIT));
    dispatch(doLoading(true));

    const { rowNumber } = getState().user.valuesMatched;
    await executeValuesAppendUpdateCheckIn(
      rowNumber,
      roomChecked,
      inviteNumberExists,
      invitationByMobileUser,
      newCheckInTime
    );

    dispatch(doLoading(false));

    const { showMyModal } = getState().app;
    if (showMyModal) {
      await dispatch(doShowMyModal(false));
    }
    await dispatch(doShowMyModal(true));
  };

export const doUpdateCheckOut =
  (newCheckOutTime) => async (dispatch, getState) => {
    if (!navigator.onLine) return;
    dispatch(submitType(ON_UPDATE_CHECK_OUT_SUBMIT));
    dispatch(doLoading(true));

    const { rowNumber } = getState().user.valuesMatched;
    await executeValuesAppendUpdateCheckOut(rowNumber, newCheckOutTime);

    dispatch(doLoading(false));

    const { showMyModal } = getState().app;
    if (showMyModal) {
      await dispatch(doShowMyModal(false));
    }
    await dispatch(doShowMyModal(true));
  };
