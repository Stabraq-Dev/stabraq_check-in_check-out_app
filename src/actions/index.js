import {
  SIGN_IN,
  SIGN_OUT,
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  SHRINK_ICON,
  SEARCH_BY_MOBILE,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  NUMBER_EXISTS,
  VALUES_MATCHED,
  WRONG_USER_PASS,
  FROM_URL,
} from './types';

import {
  executeValuesUpdateAdminAuth,
  executeValuesUpdate,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCutPaste,
  executeValuesAppendAddSheet,
  executeValuesAppendNewUserData,
  executeValuesAppendCheckIn,
  executeValuesAppendCheckOut,
  getSheetValues,
} from '../functions/executeFunc';

import history from '../history';

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const fromURL = () => {
  return {
    type: FROM_URL,
    payload: history.location.pathname + history.location.search,
  };
};

export const wrongUserPass = (userPassStatus) => {
  return {
    type: WRONG_USER_PASS,
    payload: userPassStatus,
  };
};

export const doLogIn = (formValues) => async (dispatch, getState) => {
  dispatch(doLoading(true));
  const { username, password } = formValues;
  await executeValuesUpdateAdminAuth(username, password);
  const getSheetValuesMatchedRange = 'Auth!G2';
  const isSignedIn = await getSheetValues(getSheetValuesMatchedRange);
  await executeValuesUpdateAdminAuth('', '');

  switch (isSignedIn[0]) {
    case 'TRUE':
      dispatch(signIn());
      dispatch(wrongUserPass(false));
      localStorage.setItem('user', Date.now() + 60 * 60 * 1000);
      const { fromURL } = getState().auth;
      if (fromURL) {
        history.push(fromURL);
      } else {
        history.push('/preferences/main');
      }
      break;
    case 'FALSE':
      dispatch(wrongUserPass(true));
      break;
    default:
      dispatch(signOut());
      break;
  }

  dispatch(doLoading(false));
};

export const doCheckSignedIn = () => async (dispatch) => {
  const user = localStorage.getItem('user');
  if (user > Date.now()) {
    dispatch(signIn());
  }
};

export const doLogOut = () => async (dispatch) => {
  localStorage.removeItem('user');
  dispatch(signOut());
  history.push('/dashboard');
};

export const doRedirectToSignIn = () => async (dispatch) => {
  dispatch(fromURL());
  history.push('/dashboard');
};

export const doShrinkLogo = (shrinkStatus) => {
  return {
    type: SHRINK_LOGO,
    payload: shrinkStatus,
  };
};

export const doShrinkIcon = (shrinkStatus) => {
  return {
    type: SHRINK_ICON,
    payload: shrinkStatus,
  };
};

export const doShowCheckInOut = (showCheckInOutStatus) => {
  return {
    type: SHOW_CHECK_IN_OUT,
    payload: showCheckInOutStatus,
  };
};

export const doLoading = (loadingStatus) => {
  return {
    type: LOADING,
    payload: loadingStatus,
  };
};

export const doCreateNewSheet = () => async (dispatch) => {
  const getSheetValuesSheetDateRange = 'Data!L1';
  const sheetDate = await getSheetValues(getSheetValuesSheetDateRange);
  dispatch({ type: SHEET_DATE, payload: sheetDate[0] });

  const dateOne = sheetDate[0];
  const dateTwo = new Date().toLocaleDateString();
  const diff = await checkDateToAddSheet(dateOne, dateTwo);

  if (diff >= 1) {
    const newSheetId = await executeBatchUpdateAddSheet(sheetDate[0]);
    if (newSheetId === false) return;
    dispatch({ type: NEW_SHEET_ID, payload: newSheetId });
    await executeBatchUpdateCutPaste(newSheetId);
    await executeValuesAppendAddSheet();
  }
};

export const doSearchByMobile = (mobile) => async (dispatch) => {
  console.log(mobile);
  dispatch({ type: SEARCH_BY_MOBILE, payload: mobile });

  dispatch(doLoading(true));
  // Check to Add new Sheet for new day
  dispatch(doCreateNewSheet());
  // Search for the user by mobile number
  await executeValuesUpdate(mobile);
  const getSheetValuesNumberExistsRange = 'Clients!I2';
  const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);
  dispatch({ type: NUMBER_EXISTS, payload: numberExists[0] });

  if (numberExists[0] === 'EXISTS') {
    const getSheetValuesMatchedRange = 'Clients!J2:Q2';
    const valuesMatched = await getSheetValues(getSheetValuesMatchedRange);
    dispatch({ type: VALUES_MATCHED, payload: valuesMatched });
  }

  dispatch(doLoading(false));

  // history.push('/');
};

/* 
 @a Helper Functions 
 */
const checkDateToAddSheet = async (dataDateOne, dataDateTwo) => {
  const dateOne = new Date(dataDateOne);
  const dateTwo = new Date(dataDateTwo);
  const diffTime = Math.abs(dateTwo - dateOne);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
