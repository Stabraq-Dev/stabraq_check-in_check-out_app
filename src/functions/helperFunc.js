/* 
 @a Helper Functions 
 */

import { REMAIN_DAYS_EXCEL_FORMULA } from '../ranges';

export const changeDateFormat = async (inputDate) => {
  let date = new Date(inputDate);

  const shortMonthName = new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format;

  let year = date.getFullYear();
  let month = shortMonthName(date);
  let day = date.getDate();

  let dateString = year + '-' + month + '-' + day;

  return dateString;
};

export const changeYearMonthFormat = async (inputDate) => {
  let date = new Date(inputDate);

  const shortMonthName = new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format;

  let year = date.getFullYear();
  let month = shortMonthName(date);

  let dateString = year + '-' + month;

  return dateString;
};

export const checkDayDiff = async (dataDateOne, dataDateTwo) => {
  const dateOne = new Date(dataDateOne);
  const dateTwo = new Date(dataDateTwo);
  const diffTime = Math.abs(dateTwo - dateOne);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const checkMonthDiff = async (dataDateOne, dataDateTwo) => {
  let months;
  const dateOne = new Date(dataDateOne);
  const dateTwo = new Date(dataDateTwo);
  months = (dateTwo.getFullYear() - dateOne.getFullYear()) * 12;
  months -= dateOne.getMonth();
  months += dateTwo.getMonth();
  return months <= 0 ? 0 : months;
};

export const checkYearDiff = async (dataDateOne, dataDateTwo) => {
  const dateOne = new Date(dataDateOne);
  const dateTwo = new Date(dataDateTwo);
  const diffYears = dateTwo.getFullYear() - dateOne.getFullYear();

  return diffYears;
};

export const checkDayDiffWithMinus = (dataDateOne, dataDateTwo) => {
  const dateOne = new Date(dataDateOne);
  const dateTwo = new Date(dataDateTwo);
  const diffTime = dateTwo - dateOne;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getByValue = async (arr, value) => {
  let result = [];

  arr.forEach(function (o) {
    if (o.properties.title.includes(value)) {
      result.push({ id: o.properties.sheetId, title: o.properties.title });
    }
  });

  return result ? result : null; // or undefined
};

export const getData = async (arr, keyToGet) => {
  let result = [];

  arr.forEach((element) => {
    Object.entries(element).forEach(([key, value]) => {
      if (key === keyToGet) {
        result.push(value);
      }
    });
  });

  return result
    .flat()
    .map((item) => (item.length <= 0 ? '' : item))
    .flat();
};

export const getExpiryDate = (days) => {
  let expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + days);
  return expiry_date.toLocaleDateString('en-US');
};

export const calculateUserData = (formValues, lastBlankRow) => {
  const { membership, hoursPackages } = formValues;
  const expiryDate =
    membership === 'HOURS_MEMBERSHIP'
      ? getExpiryDate(90)
      : membership === 'NOT_MEMBER'
      ? ''
      : getExpiryDate(30);

  const remainDays =
    membership === 'NOT_MEMBER' ? '' : REMAIN_DAYS_EXCEL_FORMULA(lastBlankRow);

  const remainingHours = membership === 'HOURS_MEMBERSHIP' ? hoursPackages : '';

  const remainingOfTenDays = membership === '10_DAYS' ? 10 : '';

  const invitations =
    membership === 'GREEN'
      ? 3
      : membership === 'ORANGE'
      ? 5
      : membership === 'BUSINESS'
      ? 7
      : '';

  return {
    expiryDate,
    remainDays,
    remainingHours,
    remainingOfTenDays,
    invitations,
  };
};
