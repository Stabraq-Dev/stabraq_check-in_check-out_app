import { authInstance, loadClient, loadClientForDrive } from '../api/auth';
import { axiosAuth } from '../api/googleSheetsAPI';
import { changeDateFormat, getData } from '../functions/helperFunc';
import '../config';
import qs from 'qs';
import {
  CLIENTS_SHEET_APPEND_RANGE,
  COMMENTS_SHEET_APPEND_RANGE,
  DATA_SHEET_APPEND_RANGE,
  DATA_SHEET_BATCH_CLEAR_RANGES,
  DATA_SHEET_DATE_RANGE,
} from '../ranges';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const AUTH_SHEET_ID = process.env.REACT_APP_AUTH_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;

export const executeValuesUpdate = async (val) => {
  try {
    await axiosAuth(SHEET_ID);
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const range = 'Func!A2';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        // majorDimension: 'COLUMNS',
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
          [new Date().toLocaleString().replace(',', '')],
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
          [new Date().toLocaleDateString()],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          [''],
          ['=SUM(J4:J)'],
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

    const getExpiryDate = (days) => {
      let expiry_date = new Date();
      expiry_date.setDate(expiry_date.getDate() + days);
      return expiry_date.toLocaleDateString();
    };
    const { mobile, username, email, membership, hoursPackages, gender } =
      formValues;
    const range = CLIENTS_SHEET_APPEND_RANGE;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          // [new Date().toLocaleString()],
          [`'${mobile}`],
          [username],
          [email],
          [membership],
          [
            membership === 'HOURS_MEMBERSHIP'
              ? getExpiryDate(90)
              : membership === 'NOT_MEMBER'
              ? ''
              : getExpiryDate(30),
          ],
          [
            membership === 'NOT_MEMBER'
              ? ''
              : `=IF(E${lastBlankRow}>TODAY(),DATEDIF(TODAY(),E${lastBlankRow},"d"),(-1*DATEDIF(E${lastBlankRow},TODAY(),"d")))`,
          ],
          [hoursPackages],
          [new Date().toLocaleString()],
          [membership === 'HOURS_MEMBERSHIP' ? hoursPackages : ''],
          [membership === '10_DAYS' ? 10 : ''],
          [
            membership === 'GREEN'
              ? 3
              : membership === 'ORANGE'
              ? 5
              : membership === 'BUSINESS'
              ? 7
              : '',
          ],
          [],
          [gender],
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
  comment
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
          [`'${invitationByMobileUser.inviteByMobile}`],
          [invitationByMobileUser.inviteByName],
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

    const range = `Data!G${rowNumber}`;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString('en-US')],
          [`=TEXT(G${rowNumber}-F${rowNumber},"h:mm")`],
          [
            roomChecked === 'PRIVATE_ROOM' || roomChecked === 'TRAINING_ROOM'
              ? `=IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24)`
              : `=IF(H${rowNumber}*24<1,1,IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24))`,
          ],
          [
            roomChecked === 'PRIVATE_ROOM'
              ? `=I${rowNumber}*${privateRoomRate}`
              : roomChecked === 'TRAINING_ROOM'
              ? `=I${rowNumber}*${trainingRoomRate}`
              : membership === 'NOT_MEMBER' && invite === 'NO'
              ? `=IF(I${rowNumber}>=7,${fullDayRate},I${rowNumber}*${hrRate})`
              : '',
          ],
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

export const getSheetValues = async (range) => {
  try {
    const googleSheetsAPI = await axiosAuth(SHEET_ID);

    const response = await googleSheetsAPI.get(`${SHEET_ID}/values/${range}`);

    if (global.config.debuggingMode === 'TRUE') {
      console.log('Response getSheetValues', range, response.data.values[0]);
    }

    return response.data.values[0];
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
