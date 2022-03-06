import { SIGN_IN, SIGN_OUT, WRONG_USER_PASS, FROM_URL } from './types';
import history from '../history';

import { doLoading } from './appActions';

import {
  executeValuesUpdateAdminAuth,
  getSheetValuesAdminAuth,
} from '../functions/executeFunc';

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
  if (!navigator.onLine) return;
  dispatch(doLoading(true));
  const { username, password } = formValues;
  await executeValuesUpdateAdminAuth(username, password);
  const getSheetValuesMatchedRange = 'Auth!G2';
  const isSignedIn = await getSheetValuesAdminAuth(getSheetValuesMatchedRange);
  await executeValuesUpdateAdminAuth('', '');

  switch (isSignedIn[0]) {
    case 'TRUE':
      dispatch(signIn());
      dispatch(wrongUserPass(false));
      localStorage.setItem('user', Date.now() + 7200000);
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
  console.log('doCheckSignedIn');
  console.log(user);
  if (user > Date.now()) {
    dispatch(signIn());
  } else {
    dispatch(signOut());
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
