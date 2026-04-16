import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const authenticate = async (sheetID) => {
  const serviceAccountAuth = new JWT({
    email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const doc = new GoogleSpreadsheet(sheetID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
};
