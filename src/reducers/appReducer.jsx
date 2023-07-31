import {
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  REVEAL,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  SHOW_MY_MODAL,
  SUBMIT_TYPE,
  SEARCH_BY_MOBILE,
  ERROR,
  REVEAL_LOGO,
  PICKED_DATE,
} from '../actions/types';

const INITIAL_STATE = {
  shrinkLogo: false,
  revealLogo: false,
  reveal: [],
  showCheckInOut: false,
  loading: false,
  sheetDate: '',
  newSheetId: '',
  mobileNumber: '',
  showMyModal: false,
  submitType: '',
  error: '',
  pickedDate: new Date().toLocaleString(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHRINK_LOGO:
      return { ...state, shrinkLogo: action.payload };
    case REVEAL_LOGO:
      return { ...state, revealLogo: action.payload };
    case REVEAL:
      return { ...state, reveal: action.payload };
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
    case ERROR:
      return { ...state, error: action.payload };
    case PICKED_DATE:
      return { ...state, pickedDate: action.payload };
    default:
      return state;
  }
};
