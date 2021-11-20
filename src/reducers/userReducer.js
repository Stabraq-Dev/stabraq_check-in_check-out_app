import {
  NUMBER_EXISTS,
  VALUES_MATCHED,
  CHECKED_IN_STATUS,
  CHECKED_OUT_STATUS,
  CLEAR_PREV_USER_STATE,
  CALC_DURATION_COST,
  CHECK_IN_OUT_STATUS,
  CALC_REMAINING_HOURS,
  CALC_REMAINING_OF_TEN_DAYS,
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
    hoursPackage: '',
    registrationDateTime: '',
    remainingHours: '',
    remainingOfTenDays: '',
    clientRowNumber: '',
    gender: '',
    girlsRoom: '',
    privateRoom: '',
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
  'hoursPackage',
  'registrationDateTime',
  'remainingHours',
  'remainingOfTenDays',
  'clientRowNumber',
  'gender',
  'girlsRoom',
  'privateRoom',
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
        checkInOut: changeData(state.checkInOut, action.payload, 'checked_In'),
      };
    case CHECKED_OUT_STATUS:
      return {
        ...state,
        checkInOut: changeData(state.checkInOut, action.payload, 'checked_Out'),
      };
    case CALC_REMAINING_HOURS:
      return {
        ...state,
        valuesMatched: changeData(
          state.valuesMatched,
          action.payload,
          'remainingHours'
        ),
      };
    case CALC_REMAINING_OF_TEN_DAYS:
      return {
        ...state,
        valuesMatched: changeData(
          state.valuesMatched,
          action.payload,
          'remainingOfTenDays'
        ),
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

const changeData = (state, payload, keyToChange) => {
  let result = {};
  Object.entries(state).forEach(([key, value]) => {
    if (key === keyToChange) {
      result[key] = payload;
    } else {
      result[key] = value;
    }
  });
  return result;
};
