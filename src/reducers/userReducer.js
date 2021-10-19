import {
  NUMBER_EXISTS,
  VALUES_MATCHED,
  CHECKED_IN_STATUS,
  CHECKED_OUT_STATUS,
  CLEAR_PREV_USER_STATE,
  CALC_DURATION_COST,
  CHECK_IN_OUT_STATUS,
} from '../actions/types';

const INITIAL_STATE = {
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
    case NUMBER_EXISTS:
      return { ...state, numberExists: action.payload };
    case VALUES_MATCHED:
      return {
        ...state,
        valuesMatched: mapArrayDataObject(action.payload, valuesMatchedKeys),
      };
    case CLEAR_PREV_USER_STATE:
      return INITIAL_STATE;
    case CALC_DURATION_COST:
      return {
        ...state,
        durationCost: mapArrayDataObject(action.payload, durationCostKeys),
      };
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
