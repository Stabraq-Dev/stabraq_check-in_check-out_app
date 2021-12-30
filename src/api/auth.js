import { GoogleSpreadsheet } from 'google-spreadsheet';

export const authenticate = async (sheetID) => {
  const doc = new GoogleSpreadsheet(sheetID);
  await doc.useServiceAccountAuth({
    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
      /\\n/gm,
      '\n'
    ),
    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });

  return doc;
};

// export const docOnly = async () => {
//   return doc;
// };

export const loadAuth = async () => {
  try {
    await window.gapi.load('client:auth2', async () => {
      const auth = await window.gapi.auth2.init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      });
      return auth;
    });
  } catch (error) {
    console.error(error);
  }
};

export const authInstance = async () => {
  try {
    const response = await window.gapi.auth2.getAuthInstance().signIn({
      scope: 'https://www.googleapis.com/auth/spreadsheets',
    });
    console.log('Sign-in successful');
    return response;
  } catch (err) {
    console.error('Error signing in', err);
  }
};

export const loadClient = async () => {
  try {
    await window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
    await window.gapi.client.load(
      'https://sheets.googleapis.com/$discovery/rest?version=v4'
    );
    console.log('GAPI client loaded for API');
  } catch (err) {
    console.error('Error loading GAPI client for API', err);
  }
};
