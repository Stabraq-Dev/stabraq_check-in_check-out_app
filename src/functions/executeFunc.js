import { authInstance, loadClient, loadClientForDrive } from '../api/auth';
import { axiosAuth } from '../api/googleSheetsAPI';
import {
  calculateUserData,
  changeDateFormat,
  getData,
} from '../functions/helperFunc';
import '../config';
import qs from 'qs';
import {
  APPEND_CHECKOUT_RANGE,
  APPEND_UPDATE_CHECK_IN_RANGE,
  APPEND_UPDATE_CHECK_OUT_RANGE,
  APPROX_DURATION_EXCEL_FORMULA,
  CLIENTS_SHEET_APPEND_RANGE,
  COMMENTS_SHEET_APPEND_RANGE,
  COST_EXCEL_FORMULA,
  DATA_SHEET_APPEND_RANGE,
  DATA_SHEET_BATCH_CLEAR_RANGES,
  DATA_SHEET_DATE_RANGE,
  DURATION_EXCEL_FORMULA,
  NUMBER_TO_CHECK_EXISTS_RANGE,
  TOTAL_COST_EXCEL_FORMULA,
  UPDATE_EDIT_CLIENT_RANGE,
} from '../ranges';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const AUTH_SHEET_ID = process.env.REACT_APP_AUTH_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;

export const executeValuesUpdate = async (val) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = NUMBER_TO_CHECK_EXISTS_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        values: [[`'${val}`]],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesUpdate', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesUpdate', err);
    return err;
  }
};

export const executeValuesUpdateCheckOut = async (props) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const { value, range } = props;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        // majorDimension: 'COLUMNS',
        values: [[value]],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesUpdateCheckOut', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesUpdateCheckOut', err);
    return err;
  }
};

export const executeValuesUpdateAdminAuth = async (
  inputUserName,
  inputPassword
) => {
  try {
    await axiosAuth(AUTH_SHEET_ID);
    const googleSheetsAPI = await axiosAuth(AUTH_SHEET_ID);

    const range = 'Auth!H2';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${AUTH_SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [inputUserName],
          [inputPassword],
          [new Date().toLocaleString('en-US').replace(',', '')],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesUpdate', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesUpdate', err);
  }
};

export const executeBatchUpdateAddSheet = async (sheetDate) => {
  try {
    let sheetTitle = await changeDateFormat(sheetDate);
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetTitle,
              rightToLeft: true,
            },
          },
        },
      ],
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log(
        'Response executeBatchUpdateAddSheet',
        response.data.replies[0].addSheet.properties.sheetId
      );
    }

    return response.data.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error(
      'Execute error executeBatchUpdateAddSheet',
      err.response.data.error
    );
    return err.response.data.error;
  }
};

export const executeBatchUpdateDeleteSheet = async (sheetId) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          deleteSheet: {
            sheetId: sheetId,
          },
        },
      ],
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log(
        'Response executeBatchUpdateDeleteSheet',
        response.data.replies[0]
      );
    }

    return response.data.replies[0];
  } catch (err) {
    console.error(
      'Execute error executeBatchUpdateDeleteSheet',
      err.response.data.error
    );
    return err.response.data.error;
  }
};

export const executeBatchUpdateCopyPaste = async (destSheetId) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          copyPaste: {
            source: {
              sheetId: global.config.source.sheetId,
            },
            destination: {
              sheetId: destSheetId,
            },
            pasteType: 'PASTE_NORMAL',
          },
        },
      ],
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeBatchUpdateCopyPaste', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeBatchUpdateCopyPaste', err);
  }
};

export const executeBatchUpdateSheetPropertiesRenameSheet = async (
  worksheetID,
  sheetId,
  newSheetTitle
) => {
  try {
    await axiosAuth(worksheetID);
    const googleSheetsAPI = await axiosAuth(worksheetID);
    const response = await googleSheetsAPI.post(`${worksheetID}:batchUpdate`, {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheetId,
              title: newSheetTitle,
            },
            fields: 'title',
          },
        },
      ],
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log(
        'Response executeBatchUpdateSheetPropertiesRenameSheet',
        response
      );
    }

    return response;
  } catch (err) {
    console.error(
      'Execute error executeBatchUpdateSheetPropertiesRenameSheet',
      err
    );
  }
};

export const executeBatchUpdateCopyToWorksheet = async (
  sourceSheetId,
  destWorkSheetId
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/sheets/${sourceSheetId}:copyTo`,
      {
        destinationSpreadsheetId: destWorkSheetId,
      }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeBatchUpdateCopyToWorksheet', response);
    }

    return response;
  } catch (err) {
    console.error(
      'Execute error executeBatchUpdateCopyToWorksheet',
      err.response.data.error
    );
    return err.response.data.error;
  }
};

export const executeBatchUpdateDeleteRange = async (rowNumber) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          deleteRange: {
            shiftDimension: 'ROWS',
            range: {
              sheetId: global.config.source.sheetId,
              startRowIndex: rowNumber - 1,
              endRowIndex: rowNumber,
            },
          },
        },
      ],
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeBatchUpdateDeleteRange', response);
    }

    return response;
  } catch (err) {
    console.error(
      'Execute error executeBatchUpdateDeleteRange',
      err.response.data.error
    );
    return err.response.data.error;
  }
};

export const executeValuesBatchClear = async () => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values:batchClear`,
      {
        ranges: DATA_SHEET_BATCH_CLEAR_RANGES,
      }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesBatchClear', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesBatchClear', err);
  }
};

export const executeValuesAppendAddSheet = async () => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = DATA_SHEET_DATE_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleDateString('en-US')],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          [TOTAL_COST_EXCEL_FORMULA],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendAddSheet', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendAddSheet', err);
  }
};

export const executeValuesAppendNewUserData = async (
  formValues,
  lastBlankRow
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const {
      mobile,
      username,
      email,
      membership,
      hoursPackages,
      gender,
      offers,
    } = formValues;

    const {
      expiryDate,
      remainDays,
      remainingHours,
      remainingOfTenDays,
      invitations,
    } = calculateUserData(formValues, lastBlankRow);

    const offersChecked = offers ? true : false;

    const range = CLIENTS_SHEET_APPEND_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [`'${mobile}`],
          [username],
          [email],
          [membership],
          [expiryDate],
          [remainDays],
          [hoursPackages],
          [new Date().toLocaleString('en-US')],
          [remainingHours],
          [remainingOfTenDays],
          [invitations],
          [0],
          [gender],
          [offersChecked],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendNewUserData', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendNewUserData', err);
    return err;
  }
};

export const executeValuesAppendUserComment = async (
  mobile,
  username,
  comment,
  ratingValue
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = COMMENTS_SHEET_APPEND_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [`'${mobile}`],
          [username],
          [new Date().toLocaleDateString('en-US')],
          [comment],
          [ratingValue],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendUserComment', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendUserComment', err);
    return err;
  }
};

export const executeValuesAppendCheckIn = async (
  checkInOutStatus,
  mobileNumber,
  userName,
  eMailAddress,
  membership,
  roomChecked,
  inviteNumberExists,
  invitationByMobileUser
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const { inviteByMobile, inviteByName } = invitationByMobileUser;

    const range = DATA_SHEET_APPEND_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [userName],
          [`'${mobileNumber}`],
          [eMailAddress],
          [membership],
          [checkInOutStatus],
          [new Date().toLocaleTimeString('en-US')],
          [''],
          [''],
          [''],
          [''],
          [''],
          [roomChecked],
          [inviteNumberExists],
          [`'${inviteByMobile}`],
          [inviteByName],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendCheckIn', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendCheckIn', err);
  }
};

export const executeValuesAppendCheckOut = async (
  rowNumber,
  membership,
  hrRate,
  fullDayRate,
  roomChecked,
  privateRoomRate,
  trainingRoomRate,
  invite
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const duration = DURATION_EXCEL_FORMULA(rowNumber);

    const approxDuration = APPROX_DURATION_EXCEL_FORMULA(
      roomChecked,
      rowNumber
    );

    const cost = COST_EXCEL_FORMULA(
      roomChecked,
      rowNumber,
      membership,
      privateRoomRate,
      trainingRoomRate,
      invite,
      fullDayRate,
      hrRate
    );

    const range = APPEND_CHECKOUT_RANGE(rowNumber);
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString('en-US')],
          [duration],
          [approxDuration],
          [cost],
          ['CHECKED_OUT'],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendCheckOut', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendCheckOut', err);
  }
};

export const executeValuesAppendDeleteCheckOut = async (rowNumber) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = APPEND_CHECKOUT_RANGE(rowNumber);
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [[''], [''], [''], [''], ['']],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendDeleteCheckOut', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendDeleteCheckOut', err);
  }
};

export const executeValuesAppendUpdateCheckIn = async (
  rowNumber,
  roomChecked,
  inviteNumberExists,
  invitationByMobileUser,
  newCheckInTime
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const { inviteByMobile, inviteByName } = invitationByMobileUser;

    const inviteNumberExistsFinal =
      inviteNumberExists || roomChecked ? [inviteNumberExists] : [];
    const inviteByMobileFinal =
      inviteByMobile || roomChecked ? [`'${inviteByMobile}`] : [];
    const inviteByNameFinal =
      inviteByName || roomChecked || inviteByName === '' ? [inviteByName] : [];

    const range = APPEND_UPDATE_CHECK_IN_RANGE(rowNumber);
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [
          newCheckInTime ? [newCheckInTime] : [],
          [],
          [],
          [],
          [],
          [],
          [roomChecked],
          inviteNumberExistsFinal,
          inviteByMobileFinal,
          inviteByNameFinal,
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendUpdateCheckIn', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendUpdateCheckIn', err);
  }
};

export const executeValuesUpdateEditClient = async (formValues, rowNumber) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const {
      mobile,
      username,
      email,
      membership,
      expiryDate,
      hoursPackages,
      registrationDateTime,
      remainingHours,
      remainingOfTenDays,
      invitations,
      rating,
      gender,
      offers,
    } = formValues;

    const { remainDays } = calculateUserData(formValues, rowNumber);

    const range = UPDATE_EDIT_CLIENT_RANGE(rowNumber);
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [`'${mobile}`],
          [username],
          [email],
          [membership],
          [expiryDate],
          [remainDays],
          [hoursPackages],
          [registrationDateTime],
          [remainingHours],
          [remainingOfTenDays],
          [invitations],
          [rating],
          [gender],
          [offers],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesUpdateEditClient', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesUpdateEditClient', err);
  }
};

export const executeValuesAppendUpdateCheckOut = async (
  rowNumber,
  newCheckOutTime
) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = APPEND_UPDATE_CHECK_OUT_RANGE(rowNumber);
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        majorDimension: 'COLUMNS',
        values: [[newCheckOutTime]],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeValuesAppendUpdateCheckOut', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error executeValuesAppendUpdateCheckOut', err);
  }
};

export const getSheetValues = async (range) => {
  try {
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const response = await googleSheetsAPI.get(`${SHEET_ID}/values/${range}`);

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response getSheetValues', range, response.data.values);
    }

    return response.data.values;
  } catch (err) {
    console.error('Execute error getSheetValues', err);
  }
};

export const getSheetValuesBatchGet = async (ranges) => {
  try {
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const response = await googleSheetsAPI.get(`${SHEET_ID}/values:batchGet`, {
      params: {
        majorDimension: 'COLUMNS',
        ranges: ranges,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    const finalRes = await getData(response.data.valueRanges, 'values');

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response getSheetValuesBatchGet', ranges, finalRes);
    }

    return finalRes;
  } catch (err) {
    console.error('Execute error getSheetValuesBatchGet', err);
  }
};

export const getSheetValuesAdminAuth = async (range) => {
  try {
    const googleSheetsAPI = await axiosAuth(AUTH_SHEET_ID);

    const response = await googleSheetsAPI.get(
      `${AUTH_SHEET_ID}/values/${range}`
    );

    if (global.config.debuggingMode === 'TRUE') {
      console.log(
        'Response getSheetValuesAdminAuth',
        range,
        response.data.values[0]
      );
    }

    return response.data.values[0];
  } catch (err) {
    console.error('Execute error getSheetValuesAdminAuth', err);
  }
};

export const getWorkSheetData = async (sheetID) => {
  try {
    const googleSheetsAPI = await axiosAuth(sheetID);

    const response = await googleSheetsAPI.get(sheetID);

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response getWorkSheetData', response.data.sheets);
    }

    return response.data.sheets;
  } catch (err) {
    console.error('Execute error getWorkSheetData', err);
  }
};

export const executeAddNewWorkSheet = async (title) => {
  try {
    await authInstance();
    await loadClient();
    const response = await window.gapi.client.sheets.spreadsheets.create({
      resource: {
        properties: {
          title: title,
        },
      },
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log(
        'Response executeAddNewWorkSheet',
        response.result.spreadsheetId
      );
    }

    return response.result.spreadsheetId;
  } catch (err) {
    console.error('Execute error executeAddNewWorkSheet', err);
    return false;
  }
};

export const executeChangeWorkSheetPermission = async (fileId) => {
  try {
    await authInstance();
    await loadClientForDrive();
    const response = await window.gapi.client.drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'writer',
        type: 'user',
        emailAddress: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
    });

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response executeChangeWorkSheetPermission', response);
    }

    return response;
  } catch (err) {
    console.error(
      'Execute error executeChangeWorkSheetPermission',
      err.response.data.error
    );
    return err.response.data.error;
  }
};
