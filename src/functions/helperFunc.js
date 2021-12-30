/* 
 @a Helper Functions 
 */

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

export const getByValue = async (arr, value) => {
  let result = [];

  arr.forEach(function (o) {
    if (o.properties.title.includes(value)) {
      result.push({ id: o.properties.sheetId, title: o.properties.title });
    }
  });

  return result ? result : null; // or undefined
};