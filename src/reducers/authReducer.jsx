import {
  AUTHORIZED_USER,
  FROM_URL,
  SIGN_IN,
  SIGN_OUT,
  WRONG_USER_PASS,
} from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  userId: null,
  wrongUserPass: null,
  fromURL: null,
  authorizedUser: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userId: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userId: null };
    case FROM_URL:
      return { ...state, fromURL: action.payload };
    case WRONG_USER_PASS:
      return { ...state, wrongUserPass: action.payload };
    case AUTHORIZED_USER:
      return { ...state, authorizedUser: action.payload };
    default:
      return state;
  }
};
