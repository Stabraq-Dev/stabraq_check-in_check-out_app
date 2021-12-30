export const changeDateFormat = (inputDate) => {
  let date = new Date(inputDate);

  const shortMonthName = new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format;

  let year = date.getFullYear();
  let month = shortMonthName(date);
  let day = date.getDate();

  let dateString = year + '-' + month + '-' + day;

  return dateString;
};
