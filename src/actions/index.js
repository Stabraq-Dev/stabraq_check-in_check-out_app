import {
  SIGN_IN,
  SIGN_OUT,
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  REVEAL,
  SEARCH_BY_MOBILE,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  NUMBER_EXISTS,
  VALUES_MATCHED,
  WRONG_USER_PASS,
  FROM_URL,
  SHOW_MY_MODAL,
  SUBMIT_TYPE,
  ON_SEARCH_SUBMIT,
  ON_NEW_USER_SUBMIT,
  ON_CHECK_IN_OUT_SUBMIT,
  CHECKED_IN_STATUS,
  CHECKED_OUT_STATUS,
  CLEAR_PREV_USER_STATE,
  CALC_DURATION_COST,
  CHECK_IN_OUT_STATUS,
  ERROR,
  REVEAL_LOGO,
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

export const doShowMyModal = (showStatus) => {
  return {
    type: SHOW_MY_MODAL,
    payload: showStatus,
  };
};

export const submitType = (submitType) => {
  return {
    type: SUBMIT_TYPE,
    payload: submitType,
  };
};

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

export const doLogIn = (formValues) => async (dispatch, getState) => {
  if (!navigator.onLine) return;
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

export const doReveal = (revealStatus) => {
  return {
    type: REVEAL,
    payload: revealStatus,
  };
};

export const doRevealLogo = (revealLogoStatus) => {
  return {
    type: REVEAL_LOGO,
    payload: revealLogoStatus,
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

export const doLoading = (loadingStatus) => {
  return {
    type: LOADING,
    payload: loadingStatus,
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

export const doCheckResponse = (res) => async (dispatch, getState) => {
  const { showMyModal } = getState().app;

  if (res.status !== 200) {
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

  // Search for the user by mobile number
  const res = await executeValuesUpdate(mobile);
  dispatch(doCheckResponse(res));

  const getSheetValuesNumberExistsRange = 'Clients!I2';
  const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);
  dispatch({ type: NUMBER_EXISTS, payload: numberExists[0] });

  if (numberExists[0] === 'EXISTS') {
    const getSheetValuesMatchedRange = 'Clients!J2:Q2';
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

    dispatch(doLoading(true));

    const resUpdate = await executeValuesUpdate(formValues.mobile);
    dispatch(doCheckResponse(resUpdate));

    const getSheetValuesNumberExistsRange = 'Clients!I2';
    const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);

    if (numberExists[0] === 'NOT_EXISTS') {
      const resAppend = await executeValuesAppendNewUserData(formValues);
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
  (checkInOutStatus) => async (dispatch, getState) => {
    if (!navigator.onLine) return;
    dispatch(submitType(ON_CHECK_IN_OUT_SUBMIT));
    dispatch(doCheckInOutStatus(checkInOutStatus));
    console.log(checkInOutStatus);

    dispatch(doLoading(true));

    // Check to Add new Sheet for new day
    await dispatch(doCreateNewSheet());

    const { mobileNumber, userName, eMailAddress, membership, rowNumber } =
      getState().user.valuesMatched;

    if (checkInOutStatus === 'CHECK_IN') {
      /* CHECK_IN */
      console.log('Welcome CHECK_IN');
      if (rowNumber !== 'NOT_CHECKED_IN') {
        dispatch(doCheckedIn(true));
      } else {
        await executeValuesAppendCheckIn(
          checkInOutStatus,
          mobileNumber,
          userName,
          eMailAddress,
          membership
        );
      }
    } else {
      /* CHECK_OUT */
      console.log('Welcome CheckOut');
      const { checkedOut } = getState().user.valuesMatched;
      if (checkedOut === 'CHECK_OUT') {
        dispatch(doCheckedOut(true));
      } else if (checkedOut === 'NOT_CHECKED_IN') {
        dispatch(doCheckedOut(false));
      } else {
        await executeValuesAppendCheckOut(
          checkInOutStatus,
          rowNumber,
          membership
        );
        const getSheetValuesDurationRange = `Data!H${rowNumber}:K${rowNumber}`;
        const resData = await getSheetValues(getSheetValuesDurationRange);
        dispatch(doCalcDurationCost(resData));
      }
    }
    dispatch(doLoading(false));
    const { showMyModal } = getState().app;
    if (showMyModal) {
      await dispatch(doShowMyModal(false));
    }
    await dispatch(doShowMyModal(true));
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
