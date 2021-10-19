import {
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  SHRINK_ICON,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  SHOW_MY_MODAL,
  SUBMIT_TYPE,
  SEARCH_BY_MOBILE,
} from '../actions/types';

const INITIAL_STATE = {
  shrinkLogo: false,
  shrinkIcon: false,
  showCheckInOut: false,
  loading: false,
  sheetDate: '',
  newSheetId: '',
  mobileNumber: '',
  showMyModal: false,
  submitType: '',
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHRINK_LOGO:
      return { ...state, shrinkLogo: action.payload };
    case SHRINK_ICON:
      return { ...state, shrinkIcon: action.payload };
    case SHOW_CHECK_IN_OUT:
      return { ...state, showCheckInOut: action.payload };
    case LOADING:
      return { ...state, loading: action.payload };
    case SHEET_DATE:
      return { ...state, sheetDate: action.payload };
    case NEW_SHEET_ID:
      return { ...state, newSheetId: action.payload };
    case SEARCH_BY_MOBILE:
      return { ...state, mobileNumber: action.payload };
    case SHOW_MY_MODAL:
      return { ...state, showMyModal: action.payload };
    case SUBMIT_TYPE:
      return { ...state, submitType: action.payload };
    default:
      return state;
  }
};
