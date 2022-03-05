/* DATA */
export const DATA_SHEET_DATE_RANGE = 'Data!A2';
export const DATA_SHEET_APPEND_RANGE = 'Data!A4';
export const DATA_SHEET_BATCH_CLEAR_RANGES = ['Data!A2:O2', 'Data!A4:O'];
export const DURATION_RANGE = (rowNumber) => {
  return `Data!H${rowNumber}:K${rowNumber}`;
};
export const APPEND_CHECKOUT_RANGE = (rowNumber) => {
  return `Data!G${rowNumber}`;
};
export const APPEND_UPDATE_CHECK_IN_RANGE = (rowNumber) => {
  return `Data!F${rowNumber}`;
};
export const APPEND_UPDATE_CHECK_OUT_RANGE = (rowNumber) => {
  return `Data!G${rowNumber}`;
};
export const DATA_SHEET_ACTIVE_RANGE = 'Data!A4:O';
export const DATA_SHEET_TOTAL_COST_RANGE = 'Data!J2';

/* FUNC */
export const NUMBER_TO_CHECK_EXISTS_RANGE = 'Func!A2';
export const NUMBER_EXISTS_RANGE = 'Func!B2';
export const VALUES_MATCHED_RANGES = ['Func!C2:O2', 'Func!A4:I4'];
export const LAST_BLANK_ROW_RANGE = 'Func!A6';

export const HOURS_DAILY_RATES_RANGE = 'Func!A8:F8';

export const CURR_MONTH_WORKSHEET_RANGE = 'Func!A12';

/* CLIENTS */
export const CLIENTS_SHEET_APPEND_RANGE = 'Clients!A3';
export const CLIENTS_SHEET_CLIENTS_RANGE = 'Clients!A3:N';
export const SINGLE_CLIENT_RANGE = (clientRowNumber) => {
  return `Clients!A${clientRowNumber}:N${clientRowNumber}`;
};
export const UPDATE_EDIT_CLIENT_RANGE = (rowNumber) => {
  return `Clients!A${rowNumber}`;
};
export const REMAINING_HOURS_RANGE = (clientRowNumber) => {
  return `Clients!I${clientRowNumber}`;
};
export const REMAINING_OF_TEN_DAYS_RANGE = (clientRowNumber) => {
  return `Clients!J${clientRowNumber}`;
};
export const INVITATIONS_RANGE = (clientRowNumber) => {
  return `Clients!K${clientRowNumber}`;
};
export const RATING_RANGE = (clientRowNumber) => {
  return `Clients!L${clientRowNumber}`;
};

/* COMMENTS */
export const COMMENTS_SHEET_APPEND_RANGE = 'Comments!A2';

/* EXCEL FORMULAS */
export const DURATION_EXCEL_FORMULA = (rowNumber) => {
  return `=TEXT(G${rowNumber}-F${rowNumber},"h:mm")`;
};
export const APPROX_DURATION_EXCEL_FORMULA = (
  roomChecked,
  membership,
  rowNumber
) => {
  return roomChecked === 'PRIVATE_ROOM' || roomChecked === 'TRAINING_ROOM'
    ? `=IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24)`
    : membership === 'HOURS_MEMBERSHIP'
    ? `=(HOUR(H${rowNumber})+(MINUTE(H${rowNumber}))/100)`
    : `=IF(H${rowNumber}*24<1,1,IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.17),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.66)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24))`;
};
export const COST_EXCEL_FORMULA = (
  roomChecked,
  rowNumber,
  membership,
  privateRoomRate,
  trainingRoomRate,
  invite,
  fullDayRate,
  hrRate
) => {
  return roomChecked === 'PRIVATE_ROOM'
    ? `=I${rowNumber}*${privateRoomRate}`
    : roomChecked === 'TRAINING_ROOM'
    ? `=I${rowNumber}*${trainingRoomRate}`
    : membership === 'NOT_MEMBER' && invite === 'NO'
    ? `=IF(I${rowNumber}>=7,${fullDayRate},I${rowNumber}*${hrRate})`
    : '';
};
export const REMAIN_DAYS_EXCEL_FORMULA = (lastBlankRow) => {
  return `=IF(E${lastBlankRow}>TODAY(),DATEDIF(TODAY(),E${lastBlankRow},"d"),(-1*DATEDIF(E${lastBlankRow},TODAY(),"d")))`;
};
export const TOTAL_USERS_EXCEL_FORMULA = '=COUNTA(B4:B)';
export const TOTAL_COST_EXCEL_FORMULA = '=SUM(J4:J)';
