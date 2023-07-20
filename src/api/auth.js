import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const authenticate = async (sheetID) => {
  const serviceAccountAuth = new JWT({
    email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(sheetID, serviceAccountAuth);

  return doc;
};

// export const docOnly = async () => {
//   return doc;
// };

let tokenClient;
export let tokenInitd = false;

export const gsiInit = async () => {
  tokenClient = await window.google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope:
      'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
    callback: async (tokenResponse) => {
      await tokenResponse.access_token;
    },
  });
};

export const gapiStart = async () => {
  try {
    const response = await window.gapi.client.init({});
    await window.gapi.client.load('sheets', 'v4');
    await window.gapi.client.load('drive', 'v3');
    console.log('Discovery Document Loaded');
    return response;
  } catch (err) {
    console.log('Error: ' + err.result.error.message);
  }
};

export const gapiLoad = async () => {
  await window.gapi.load('client', gapiStart);
};

export const loadAuth = async () => {
  try {
    await gsiInit();
    await gapiLoad();
  } catch (error) {
    console.error(error);
  }
};

export const getToken = async () => {
  try {
    await tokenClient.requestAccessToken({ prompt: '' });
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      } else {
        tokenInitd = true;
      }
    };
  } catch (error) {
    console.error(error);
  }
};
