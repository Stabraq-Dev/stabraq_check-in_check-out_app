import { axiosAuth } from '../api/googleSheetsAPI';
import '../config';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export const executeValuesUpdate = async (val) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

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

    if (global.config.debuggingMode) {
      console.log('Response executeValuesUpdate', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
    return err;
  }
};

export const executeValuesUpdateAdminAuth = async (
  inputUserName,
  inputPassword
) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

    const range = 'Auth!H2';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
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

    if (global.config.debuggingMode) {
      console.log('Response executeValuesUpdate', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeBatchUpdateAddSheet = async (sheetDate) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetDate,
              rightToLeft: true,
            },
          },
        },
      ],
    });

    if (global.config.debuggingMode) {
      console.log(
        'Response executeBatchUpdateAddSheet',
        response.data.replies[0].addSheet.properties.sheetId
      );
    }

    return response.data.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error('Execute error', err.data.error.message);
    return false;
  }
};

export const executeBatchUpdateCutPaste = async (destSheetId) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          cutPaste: {
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

    if (global.config.debuggingMode) {
      console.log('Response executeBatchUpdateCutPaste', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendAddSheet = async () => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

    const range = 'Data!A1';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          ['Name'],
          ['Mobile No.'],
          ['E-Mail'],
          ['Membership'],
          ['Check In'],
          ['CheckIn Time'],
          ['CheckOut Time'],
          ['Duration'],
          ['Approx. Duration'],
          ['Cost'],
          ['Check Out'],
          [new Date().toLocaleDateString()],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode) {
      console.log('Response executeValuesAppendAddSheet', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendNewUserData = async (formValues) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

    const range = 'Clients!A3';
    const valueInputOption = 'RAW';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          // [new Date().toLocaleString()],
          [formValues.mobile],
          [formValues.username],
          [formValues.email],
          [formValues.membership],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode) {
      console.log('Response executeValuesAppendNewUserData', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
    return err;
  }
};

export const executeValuesAppendCheckIn = async (
  checkInOutStatus,
  mobileNumber,
  userName,
  eMailAddress,
  membership
) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

    const range = 'Data!A2';
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
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode) {
      console.log('Response executeValuesAppendCheckIn', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendCheckOut = async (rowNumber, membership) => {
  try {
    await axiosAuth();
    const googleSheetsAPI = await axiosAuth();

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
            `=IF(H${rowNumber}*24<1,1,IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24))`,
          ],
          membership === 'NOT_MEMBER'
            ? [`=IF(I${rowNumber}>=6,60,I${rowNumber}*10)`]
            : [''],
          ['CHECKED_OUT'],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    if (global.config.debuggingMode) {
      console.log('Response executeValuesAppendCheckOut', response);
    }

    return response;
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const getSheetValues = async (range) => {
  try {
    const googleSheetsAPI = await axiosAuth();

    const response = await googleSheetsAPI.get(`${SHEET_ID}/values/${range}`);

    if (global.config.debuggingMode) {
      console.log('Response getSheetValues', range, response.data.values[0]);
    }

    return response.data.values[0];
  } catch (err) {
    console.error('Execute error', err);
  }
};
