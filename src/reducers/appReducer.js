import {
  SHRINK_LOGO,
  SHOW_CHECK_IN_OUT,
  SHRINK_ICON,
  LOADING,
  SHEET_DATE,
  NEW_SHEET_ID,
  NUMBER_EXISTS,
  VALUES_MATCHED,
  SHOW_MY_MODAL,
  SUBMIT_TYPE,
  CHECKED_IN_STATUS,
  CHECKED_OUT_STATUS,
  CLEAR_PREV_USER_STATE,
  SEARCH_BY_MOBILE,
  CALC_DURATION_COST,
  CHECK_IN_OUT_STATUS,
} from '../actions/types';

const INITIAL_STATE = {
  shrinkLogo: false,
  shrinkIcon: false,
  showCheckInOut: false,
  loading: false,
  sheetDate: '',
  newSheetId: '',
  mobileNumber: '',
  numberExists: '',
  valuesMatched: {
    mobileNumber: '',
    userName: '',
    eMailAddress: '',
    membership: '',
    expiryDate: '',
    remainDays: '',
    rowNumber: '',
    checkedOut: '',
  },
  showMyModal: false,
  submitType: '',
  checkInOutStatus: '',
  checkInOut: {
    checked_In: false,
    checked_Out: false,
  },
  durationCost: {
    duration: '',
    approxDuration: '',
    cost: '',
  },
};

let valuesMatchedKeys = [
  'mobileNumber',
  'userName',
  'eMailAddress',
  'membership',
  'expiryDate',
  'remainDays',
  'rowNumber',
  'checkedOut',
];

let durationCostKeys = ['duration', 'approxDuration', 'cost'];

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
    case NUMBER_EXISTS:
      return { ...state, numberExists: action.payload };
    case VALUES_MATCHED:
      return {
        ...state,
        valuesMatched: mapArrayDataObject(action.payload, valuesMatchedKeys),
      };
    case CLEAR_PREV_USER_STATE:
      return {
        ...state,
        mobileNumber: INITIAL_STATE.mobileNumber,
        numberExists: INITIAL_STATE.numberExists,
        valuesMatched: INITIAL_STATE.valuesMatched,
        checkInOut: INITIAL_STATE.checkInOut,
        durationCost: INITIAL_STATE.durationCost,
      };
    case CALC_DURATION_COST:
      return {
        ...state,
        durationCost: mapArrayDataObject(action.payload, durationCostKeys),
      };
    case SHOW_MY_MODAL:
      return { ...state, showMyModal: action.payload };
    case SUBMIT_TYPE:
      return { ...state, submitType: action.payload };
    case CHECK_IN_OUT_STATUS:
      return { ...state, checkInOutStatus: action.payload };
    case CHECKED_IN_STATUS:
      return {
        ...state,
        checkInOut: changeData(state, action.payload, 'checked_In'),
      };
    case CHECKED_OUT_STATUS:
      return {
        ...state,
        checkInOut: changeData(state, action.payload, 'checked_Out'),
      };
    default:
      return state;
  }
};

const mapArrayDataObject = (payload, keys) => {
  let result = {};
  keys.forEach((key, i) => (result[key] = payload[i]));
  return result;
};

const changeData = (state, payload, checkInOrOut) => {
  let result = {};
  Object.entries(state.checkInOut).forEach(([key, value]) => {
    if (key === checkInOrOut) {
      result[key] = payload;
    } else {
      result[key] = value;
    }
  });
  return result;
};
