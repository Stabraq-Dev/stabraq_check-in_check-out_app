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
  SORT_LIST,
  ORDER_LIST,
  CLIENTS_LIST_SORTED,
  ON_CONFIRM_SIGN_IN_AGAIN_SUBMIT,
  ON_SIGN_IN_AGAIN_SUBMIT,
  USER_PREV_HRS,
  ON_INVITATIONS_EXPIRED,
  ON_NO_INVITATIONS,
  ALL_CHECKED_IN_USERS,
  LIST_ALL_FILES_FILTERED,
  LIST_ALL_SHEETS_FILTERED,
  ACTIVE_SHEET_TITLE,
  USER_HISTORY_DATA,
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
  executeValuesUpdateClientCheckIn,
  executeGetAllFilesList,
  getWorkBookWorkSheetValues,
  getSheetValuesWorkSheetBatchGet,
} from '../functions/executeFunc';

import {
  calcApproxDuration,
  calcCost,
  changeYearMonthFormat,
  checkDayDiff,
  checkMonthDiff,
  checkTimeDiffHrMinSec,
  getByValue,
  mapArrayDataObject,
} from '../functions/helperFunc';

import {
  // APPEND_CHECKOUT_USER_ID_RANGE,
  APPROX_DURATION_EXCEL_FORMULA,
  CLIENTS_SHEET_CLIENTS_RANGE,
  CURR_MONTH_WORKSHEET_RANGE,
  DATA_SHEET_DATE_RANGE,
  DURATION_EXCEL_FORMULA,
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
  VAR_SHEET_ACTIVE_RANGE,
} from '../ranges';
import { getToken, tokenInitd } from '../api/auth';
import { checkAuthorizedUser } from './authActions';

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

export const doSetActiveSheetTitle = (activeSheetTitle) => {
  return {
    type: ACTIVE_SHEET_TITLE,
    payload: activeSheetTitle,
  };
};

export const searchMobileNumber = (mobile) => {
  // if (history.location.pathname === '/preferences/main/user/check-in-out') {
  //   history.push('/preferences/main/user');
  // }
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

export const doUserPrevHrs = (userPrevHrs) => {
  return {
    type: USER_PREV_HRS,
    payload: userPrevHrs,
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

export const doSortList = (sortBy, index) => {
  return {
    type: SORT_LIST,
    payload: { sortBy, index },
  };
};

export const doOrderList = (ascending) => {
  return {
    type: ORDER_LIST,
    payload: ascending,
  };
};

export const doClearSorting = () => async (dispatch) => {
  await dispatch({
    type: SORT_LIST,
    payload: {
      sortBy: '',
      index: null,
    },
  });
  await dispatch({
    type: ORDER_LIST,
    payload: true,
  });
};

export const changeExpiredMemberToNotMember =
  () => async (dispatch, getState) => {
    await dispatch(doGetClientsList());
    const { clientsList } = getState().user;
    clientsList.forEach(async (element, index) => {
      const remainDays = element[5];
      const remainingOfTenDays = element[9];
      const checkRemainDays = remainDays.includes('-');
      const checkRemainingOfTenDays =
        remainingOfTenDays !== '' && remainingOfTenDays <= 0;

      if (checkRemainDays || checkRemainingOfTenDays) {
        element[3] = 'NOT_MEMBER';
        const indexToRemove = [4, 5, 6, 8, 9, 10];
        indexToRemove.forEach((i) => {
          element[i] = '';
        });

        const formValuesKeys = [
          'mobile', // 0
          'username', // 1
          'email', // 2
          'membership', // 3
          'expiryDate', // 4
          'remainDays', // 5
          'hoursPackages', // 6
          'registrationDateTime', // 7
          'remainingHours', // 8
          'remainingOfTenDays', // 9
          'invitations', // 10
          'rating', // 11
          'gender', // 12
          'offers', // 13
        ];

        const formValues = mapArrayDataObject(element, formValuesKeys);
        const rowNumber = index + 3;

        await executeValuesUpdateEditClient(formValues, rowNumber);
      }
    });
  };

export const doCreateNewSheet = () => async (dispatch, getState) => {
  const sheetDate = await getSheetValues(DATA_SHEET_DATE_RANGE);
  dispatch({ type: SHEET_DATE, payload: sheetDate[0][0] });

  const dateOne = sheetDate[0][0];
  const dateTwo = new Date().toLocaleDateString('en-US', {
    timeZone: 'Africa/Cairo',
  });
  const diffDays = await checkDayDiff(dateOne, dateTwo);

  let day = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });

  let hrsFromMidnight = new Date(day).getHours();

  if (diffDays >= 1 && hrsFromMidnight >= 1) {
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
    await dispatch(changeExpiredMemberToNotMember());
  }

  const diffMonths = await checkMonthDiff(dateOne, dateTwo);

  if (diffMonths >= 1 && hrsFromMidnight >= 1) {
    if (tokenInitd === false) {
      await getToken();
    }

    const checkFlag = async () => {
      if (tokenInitd === false) {
        window.setTimeout(
          checkFlag,
          100
        ); /* this checks the flag every 100 milliseconds*/
      } else {
        /* do something*/
        const workSheetTitle = await changeYearMonthFormat(dateTwo);
        const newWorkSheetId = await executeAddNewWorkSheet(workSheetTitle);
        await executeChangeWorkSheetPermission(newWorkSheetId);
        await executeChangeWorkSheetPermission(
          newWorkSheetId,
          'abdalrahman.yousrii@gmail.com'
        );
        await executeValuesUpdateCheckOut({
          value: newWorkSheetId,
          range: CURR_MONTH_WORKSHEET_RANGE,
        });
      }
    };

    checkFlag();
  }
};

export const checkAuthorization = () => async (dispatch, getState) => {
  await dispatch(checkAuthorizedUser(false));
  if (tokenInitd === false) {
    await getToken();
  }

  const checkFlag = async () => {
    if (tokenInitd === false) {
      window.setTimeout(
        checkFlag,
        100
      ); /* this checks the flag every 100 milliseconds*/
    } else {
      /* do something*/
      await dispatch(checkAuthorizedUser(true));
      dispatch(doLoading(false));
    }
  };

  checkFlag();
};

export const doGetAllWorkSheetsList = () => async (dispatch, getState) => {
  await dispatch(checkAuthorization());
  const interval = setInterval(() => tick(), 100);
  const tick = async () => {
    const { authorizedUser } = getState().auth;
    if (authorizedUser) {
      clearInterval(interval);
      dispatch(doLoading(true));
      const list = await executeGetAllFilesList();
      const listAllFiles = list.result.files;
      const listAllFilesFiltered = listAllFiles
        .filter((value) => value.name.includes('20'))
        .map((value, index) => {
          const { name, id } = value;
          return { key: index + 1, value: id, text: name };
        })
        .reverse();

      const firstOption = { key: 0, value: '', text: '...Select...' };
      const finalOptions = [firstOption, ...listAllFilesFiltered];

      await dispatch({
        type: LIST_ALL_FILES_FILTERED,
        payload: finalOptions,
      });
      dispatch(doLoading(false));
    }
  };
};

export const doGetAllSheetsList = (month) => async (dispatch, getState) => {
  const sheetData = month ? await getWorkSheetData(month) : '';
  const sheetDataFiltered = sheetData
    ? sheetData
        .filter((value) => value.properties.title.includes('20'))
        .map((value, index) => {
          const { title, sheetId } = value.properties;
          return { key: index + 1, value: sheetId, text: title };
        })
    : '';

  const firstOption = { key: 0, value: '', text: '...Select...' };
  const finalOptions = [firstOption, ...sheetDataFiltered];

  await dispatch({
    type: LIST_ALL_SHEETS_FILTERED,
    payload: finalOptions,
  });
};

export const doSetDayAsActiveHistory =
  (id, selectedMonth) => async (dispatch, getState) => {
    const { listAllSheetsFiltered } = getState().user;
    const title = listAllSheetsFiltered.filter(
      (value) => value.value === parseInt(id)
    )[0].text;

    await dispatch(doSetActiveSheetTitle({ title, selectedMonth }));
    const range = VAR_SHEET_ACTIVE_RANGE(title);
    const allCheckedInUsers = await getWorkBookWorkSheetValues(
      selectedMonth,
      range
    );
    await dispatch({ type: ALL_CHECKED_IN_USERS, payload: allCheckedInUsers });
    await dispatch(doGetActiveUsersList());
  };

export const doGetUserHistory =
  (mobile, selectedMonth) => async (dispatch, getState) => {
    const { listAllSheetsFiltered } = getState().user;
    const ranges = listAllSheetsFiltered
      .map((value) => VAR_SHEET_ACTIVE_RANGE(value.text))
      .filter((val, idx) => idx > 0);
    const data = await getSheetValuesWorkSheetBatchGet(selectedMonth, ranges);

    const filterData = data
      .map((value) => {
        const record = value.values
          ? value.values.filter((val) => val[1] === mobile)
          : [];
        const day = value.range.split('!')[0];
        return { record, day };
      })
      .filter((v) => v.record.length > 0);
    await dispatch({ type: USER_HISTORY_DATA, payload: filterData });
  };

export const doClearActiveHistoryLists = () => async (dispatch, getState) => {
  await dispatch(doClearActiveUsersList());
  await dispatch({ type: ALL_CHECKED_IN_USERS, payload: [] });
  await dispatch({ type: LIST_ALL_FILES_FILTERED, payload: [] });
  await dispatch({ type: LIST_ALL_SHEETS_FILTERED, payload: [] });
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

export const doGetAllCheckedInUsers = (range) => async (dispatch) => {
  dispatch(doLoading(true));
  const allCheckedInUsers = await getSheetValues(range);
  await dispatch({ type: ALL_CHECKED_IN_USERS, payload: allCheckedInUsers });
  dispatch(doLoading(false));
};

export const doGetActiveUsersList = () => async (dispatch, getState) => {
  if (!navigator.onLine) return;
  dispatch(doLoading(true));

  const { allCheckedInUsers } = getState().user;
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

      return index === 5 || index === 6
        ? one.localeCompare(two)
        : a[index].localeCompare(b[index]);
    });

  const activeSorted =
    index === 6 ? activeUsersList : activeUsersSorted(activeUsersList);
  const nonActiveSorted = activeUsersSorted(nonActiveUsersList);

  await dispatch({ type: ACTIVE_USERS_LIST, payload: activeSorted });
  await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: nonActiveSorted });
};

export const doSortClientsList = (index) => async (dispatch, getState) => {
  const { clientsList } = getState().user;
  const getClientsSorted = (list) =>
    list.sort((a, b) => {
      const aVal = a[index];
      const bVal = b[index];
      const aValR = index === 5 && a[3] === 'NOT_MEMBER' ? 999 : parseInt(aVal);
      const bValR = index === 5 && b[3] === 'NOT_MEMBER' ? 999 : parseInt(bVal);
      const one =
        index === 4 && a[3] === 'NOT_MEMBER'
          ? '9999999999999'
          : Date.parse(`${aVal.split('/').reverse().join('/')}`).toString();
      const two =
        index === 5 && b[3] === 'NOT_MEMBER'
          ? '9999999999999'
          : Date.parse(`${bVal.split('/').reverse().join('/')}`).toString();

      return index === 4
        ? one.localeCompare(two)
        : index === 5
        ? aValR - bValR
        : aVal.localeCompare(bVal);
    });

  const clientsSorted =
    index === 999 ? [...clientsList] : getClientsSorted([...clientsList]);

  await dispatch({ type: CLIENTS_LIST_SORTED, payload: clientsSorted });
};

export const doOrderSortActiveUsersList = () => async (dispatch, getState) => {
  const { activeUsersList, nonActiveUsersList, sortList } = getState().user;
  const activeUsersSorted = (list) => list.reverse();

  const activeSorted =
    sortList.index === 6 ? activeUsersList : activeUsersSorted(activeUsersList);
  const nonActiveSorted = activeUsersSorted(nonActiveUsersList);

  await dispatch({ type: ACTIVE_USERS_LIST, payload: activeSorted });
  await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: nonActiveSorted });
};

export const doOrderSortClientsList = () => async (dispatch, getState) => {
  const { clientsListSorted } = getState().user;
  const activeUsersSorted = (list) => list.reverse();

  const clientsListReversed = activeUsersSorted(clientsListSorted);

  await dispatch({ type: CLIENTS_LIST_SORTED, payload: clientsListReversed });
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

export const doClearActiveUsersList = () => async (dispatch) => {
  await dispatch({ type: ACTIVE_USERS_LIST, payload: [] });
  await dispatch({ type: NON_ACTIVE_USERS_LIST, payload: [] });
  await dispatch({ type: ACTIVE_SHEET_FILTERED_BY, payload: '' });
  await dispatch({ type: ACTIVE_USERS_LIST_FILTERED, payload: [] });
  await dispatch({ type: NON_ACTIVE_USERS_LIST_FILTERED, payload: [] });
};

export const doClearClientsList = () => async (dispatch) => {
  await dispatch({ type: CLIENTS_LIST, payload: [] });
  await dispatch({ type: CLIENTS_LIST_SORTED, payload: [] });
  await dispatch({ type: CLIENTS_LIST_FILTERED, payload: [] });
};

export const doGetClientsList = () => async (dispatch) => {
  if (!navigator.onLine) return;
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

export const doConfirmSignInAgain = () => async (dispatch, getState) => {
  dispatch(submitType(ON_CONFIRM_SIGN_IN_AGAIN_SUBMIT));
  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
};

export const doSignInAgain = () => async (dispatch, getState) => {
  dispatch(doLoading(true));
  dispatch(submitType(ON_SIGN_IN_AGAIN_SUBMIT));
  dispatch(doLoading(false));

  const keysToExtract = [
    'mobileNumber',
    'userName',
    'eMailAddress',
    'membership',
    'expiryDate',
    'remainDays',
    'hoursPackage',
    'registrationDateTime',
    'remainingHours',
    'remainingOfTenDays',
    'invitations',
    'rating',
    'gender',
    'clientRowNumber',
  ];
  const valuesMatchedExtracted = keysToExtract.map(
    (k) => getState().user.valuesMatched[k]
  );
  const notCheckedIn = Array(8).fill('NOT_CHECKED_IN');
  const valuesMatched = [...valuesMatchedExtracted, ...notCheckedIn];

  dispatch({ type: VALUES_MATCHED, payload: valuesMatched });
};

export const doInvitationsExpired = () => async (dispatch, getState) => {
  dispatch(submitType(ON_INVITATIONS_EXPIRED));
  const { showMyModal } = getState().app;
  if (showMyModal) {
    await dispatch(doShowMyModal(false));
  }
  await dispatch(doShowMyModal(true));
};

export const doNoInvitations = () => async (dispatch, getState) => {
  dispatch(submitType(ON_NO_INVITATIONS));
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
  sessionStorage.setItem('mobile', JSON.stringify(mobile));
  if (!navigator.onLine) return;
  const { showMyModal } = getState().app;

  dispatch(submitType(ON_SEARCH_SUBMIT));
  dispatch(doClearPrevUserState());

  // if (history.location.pathname === '/preferences/main/user/check-in-out') {
  //   history.push('/preferences/main/user');
  // }

  dispatch(doLoading(true));
  // Check to Add new Sheet for new day
  await dispatch(doCreateNewSheet());
  const { error } = getState().app;
  if (error.code === 400 || error.code === 500) return;
  if (error === '') {
    sessionStorage.removeItem('mobile');
  }
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
    await executeValuesUpdate(formValues.mobile);
    const valuesMatched = await getSheetValuesBatchGet(VALUES_MATCHED_RANGES);
    await executeValuesUpdate('');
    if (valuesMatched[14] !== 'NOT_CHECKED_IN') {
      const { username, mobile, email, membership } = formValues;
      await executeValuesUpdateClientCheckIn(
        valuesMatched[14],
        username,
        mobile,
        email,
        membership
      );
    }
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
      // const { userId } = getState().auth;
      const {
        checkedOut,
        membership,
        remainingHours,
        clientRowNumber,
        roomChecked,
        invite,
        inviteByMobile,
        checkInTime,
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

        // Check if the user checked in multiple times
        if (membership === 'NOT_MEMBER') {
          await dispatch(doGetActiveUsersList());
          const { nonActiveUsersList } = getState().user;
          const userPrevSignedIn = nonActiveUsersList.filter(
            (value) => value[1] === mobileNumber
          );

          if (userPrevSignedIn.length > 0) {
            const userPrevHrs = userPrevSignedIn.reduce(
              (a, c) => parseFloat(a) + parseFloat(c[8]),
              0
            );
            await dispatch(doUserPrevHrs(userPrevHrs));
          }
        }

        const checkOutTime = new Date().toLocaleTimeString('en-US');

        const durationCalc = checkTimeDiffHrMinSec(checkInTime, checkOutTime);
        const { hours, minutes } = durationCalc;

        const duration = DURATION_EXCEL_FORMULA(rowNumber);
        const approxDuration =
          membership === 'HOURS_MEMBERSHIP'
            ? APPROX_DURATION_EXCEL_FORMULA(rowNumber)
            : calcApproxDuration(hours, minutes);

        const { userPrevHrs } = getState().user;
        const cost = calcCost(
          approxDuration,
          roomChecked,
          membership,
          privateRoomRateFinal,
          trainingRoomRateFinal,
          invite,
          fullDayRate,
          hrRate,
          userPrevHrs
        );

        await executeValuesAppendCheckOut(
          rowNumber,
          checkOutTime,
          duration,
          approxDuration,
          cost
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

        // await executeValuesUpdateCheckOut({
        //   value: userId,
        //   range: APPEND_CHECKOUT_USER_ID_RANGE(rowNumber),
        // });

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
