import {
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  SHRINK_ICON,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  NUMBER_EXISTS,
  VALUES_MATCHED,
} from '../actions/types';

const INITIAL_STATE = {
  shrinkLogo: false,
  shrinkIcon: false,
  showCheckInOut: false,
  loading: false,
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHRINK_LOGO:
      return { ...state, shrinkLogo: true };
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
    case NUMBER_EXISTS:
      return { ...state, numberExists: action.payload };
    case VALUES_MATCHED:
      return { ...state, valuesMatched: checkDateToAddSheet(action.payload) };
    default:
      return state;
  }
};

const checkDateToAddSheet = (payload) => {
  let keys = [
    'mobileNumber',
    'userName',
    'eMailAddress',
    'membership',
    'expiryDate',
    'remainDays',
    'rowNumber',
    'checkedOut',
  ];
  var result = {};
  keys.forEach((key, i) => (result[key] = payload[i]));
  return result;
};
