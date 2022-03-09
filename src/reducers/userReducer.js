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
  INVITE_VALUES_MATCHED,
  INVITE_NUMBER_EXISTS,
  CLEAR_PREV_INVITE_USER_STATE,
  HOURS_DAILY_RATES,
  ACTIVE_USERS_LIST,
  NON_ACTIVE_USERS_LIST,
  ACTIVE_USERS_LIST_FILTERED,
  NON_ACTIVE_USERS_LIST_FILTERED,
  ACTIVE_SHEET_FILTERED_BY,
  CLIENTS_LIST,
  CLIENT_STATE_TO_EDIT,
  CLIENTS_LIST_FILTERED,
  SORT_LIST,
  ORDER_LIST,
  CLIENTS_LIST_SORTED,
} from '../actions/types';

const valuesMatchedObj = {
  mobileNumber: '',
  userName: '',
  eMailAddress: '',
  membership: '',
  expiryDate: '',
  remainDays: '',
  hoursPackage: '',
  registrationDateTime: '',
  remainingHours: '',
  remainingOfTenDays: '',
  invitations: '',
  rating: '',
  gender: '',
  clientRowNumber: '',
  rowNumber: '',
  checkedOut: '',
  roomChecked: '',
  invite: '',
  inviteByMobile: '',
  inviteByName: '',
  checkInTime: '',
  checkOutTime: '',
};

const INITIAL_STATE = {
  numberExists: '',
  valuesMatched: valuesMatchedObj,
  inviteNumberExists: '',
  inviteValuesMatched: valuesMatchedObj,
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
  hoursDailyRates: {
    trainingRoomRate: '',
    privateRoomRate: '',
    sharedHourRate: '',
    sharedFullDayRate: '',
    girlsHourRate: '',
    girlsFullDayRate: '',
  },
  activeUsersList: [],
  nonActiveUsersList: [],
  activeSheetFilteredBy: '',
  activeUsersListFiltered: [],
  nonActiveUsersListFiltered: [],
  clientsList: [],
  clientStateToEdit: {
    mobileNumber: '',
    userName: '',
    eMailAddress: '',
    membership: '',
    expiryDate: '',
    remainDays: '',
    hoursPackage: '',
    registrationDateTime: '',
    remainingHours: '',
    remainingOfTenDays: '',
    invitations: '',
    rating: '',
    gender: '',
    offers: '',
  },
  clientsListFiltered: [],
  clientsListSorted: [],
  sortList: {
    sortBy: '',
    index: null,
  },
  orderListAscending: true,
};

let valuesMatchedKeys = [
  'mobileNumber',
  'userName',
  'eMailAddress',
  'membership',
  'expiryDate',
  'remainDays',
  'hoursPackage',
  'registrationDateTime',
  'remainingHours',
  'remainingOfTenDays',
  'invitations',
  'rating',
  'gender',
  'clientRowNumber',
  'rowNumber',
  'checkedOut',
  'roomChecked',
  'invite',
  'inviteByMobile',
  'inviteByName',
  'checkInTime',
  'checkOutTime',
];

let clientStateToEditKeys = [
  'mobileNumber',
  'userName',
  'eMailAddress',
  'membership',
  'expiryDate',
  'remainDays',
  'hoursPackage',
  'registrationDateTime',
  'remainingHours',
  'remainingOfTenDays',
  'invitations',
  'rating',
  'gender',
  'offers',
];

let durationCostKeys = ['duration', 'approxDuration', 'cost'];
let hoursDailyRatesKeys = [
  'trainingRoomRate',
  'privateRoomRate',
  'sharedHourRate',
  'sharedFullDayRate',
  'girlsHourRate',
  'girlsFullDayRate',
];

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
    case INVITE_NUMBER_EXISTS:
      return { ...state, inviteNumberExists: action.payload };
    case INVITE_VALUES_MATCHED:
      return {
        ...state,
        inviteValuesMatched: mapArrayDataObject(
          action.payload,
          valuesMatchedKeys
        ),
      };
    case CLEAR_PREV_USER_STATE:
      return INITIAL_STATE;
    case CLEAR_PREV_INVITE_USER_STATE:
      return {
        ...state,
        inviteValuesMatched: INITIAL_STATE.inviteValuesMatched,
      };
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
    case HOURS_DAILY_RATES:
      return {
        ...state,
        hoursDailyRates: mapArrayDataObject(
          action.payload,
          hoursDailyRatesKeys
        ),
      };
    case ACTIVE_USERS_LIST:
      return {
        ...state,
        activeUsersList: action.payload,
      };
    case NON_ACTIVE_USERS_LIST:
      return {
        ...state,
        nonActiveUsersList: action.payload,
      };
    case ACTIVE_SHEET_FILTERED_BY:
      return {
        ...state,
        activeSheetFilteredBy: action.payload,
      };
    case ACTIVE_USERS_LIST_FILTERED:
      return {
        ...state,
        activeUsersListFiltered: action.payload,
      };
    case NON_ACTIVE_USERS_LIST_FILTERED:
      return {
        ...state,
        nonActiveUsersListFiltered: action.payload,
      };
    case CLIENTS_LIST:
      return {
        ...state,
        clientsList: action.payload,
      };
    case CLIENT_STATE_TO_EDIT:
      return {
        ...state,
        clientStateToEdit: mapArrayDataObject(
          action.payload,
          clientStateToEditKeys
        ),
      };
    case CLIENTS_LIST_FILTERED:
      return {
        ...state,
        clientsListFiltered: action.payload,
      };
    case CLIENTS_LIST_SORTED:
      return {
        ...state,
        clientsListSorted: action.payload,
      };
    case SORT_LIST:
      return {
        ...state,
        sortList: action.payload,
      };
    case ORDER_LIST:
      return {
        ...state,
        orderListAscending: action.payload,
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
