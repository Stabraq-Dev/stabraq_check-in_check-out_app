import { SIGN_IN, SIGN_OUT, WRONG_USER_PASS } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  userId: null,
  wrongUserPass: null,
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userId: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userId: null };
    case WRONG_USER_PASS:
      return { ...state, wrongUserPass: action.payload };
    default:
      return state;
  }
};
