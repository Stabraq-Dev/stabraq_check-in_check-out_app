import { SIGN_IN, SIGN_OUT, WRONG_USER_PASS, FROM_URL, AUTHORIZED_USER } from './types';
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

export const checkAuthorizedUser = (authStatus) => {
  return {
    type: AUTHORIZED_USER,
    payload: authStatus,
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
      dispatch(signIn(username));
      dispatch(wrongUserPass(false));
      localStorage.setItem(
        'user',
        JSON.stringify({
          user: Date.now() + 21600000,
          userId: username,
        })
      );
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
  const userLocal = localStorage.getItem('user');
  const { user, userId } =
    userLocal !== null ? JSON.parse(userLocal) : { user: '', userId: '' };

  if (user > Date.now()) {
    dispatch(signIn(userId));
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
