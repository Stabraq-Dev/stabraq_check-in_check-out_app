/**
 * Google Apps Script - Stabraq Search API
 *
 * SETUP:
 * 1. Open main spreadsheet > Extensions > Apps Script
 * 2. Paste this code
 * 3. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL
 * 5. Add to .env.local as VITE_APPS_SCRIPT_SEARCH_URL
 *
 * ENDPOINTS:
 * Lookup user:      ?action=lookup&q=01002485001&by=mobile
 * Lookup by name:   ?action=lookup&q=Mohamed&by=name
 * Search user:      ?action=searchUser&q=01002485001
 * Search history:   ?action=search&q=01002485001&by=mobile
 * Search by name:   ?action=search&q=Mohamed&by=name
 */

var MAIN_SHEET_ID = '1SJQfVbVQr2d4cyIm3D-BicxU1LfbsVZN95TQH8V3L5w';

function doGet(e) {
  var action = e.parameter.action || 'search';
  var searchValue = e.parameter.q || '';
  var searchBy = e.parameter.by || 'mobile';

  if (!searchValue) {
    return jsonResponse({ error: 'Missing search value' });
  }

  var result;
  if (action === 'lookup') {
    result = lookupUser(searchValue, searchBy);
  } else if (action === 'searchUser') {
    result = searchUserViaFunc(searchValue);
  } else {
    result = searchAllWorkbooks(searchValue, searchBy);
  }

  return jsonResponse(result);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Lookup user in the Clients sheet of the main spreadsheet
 * Returns user profile if found
 */
function lookupUser(searchValue, searchBy) {
  try {
    var ss = SpreadsheetApp.openById(MAIN_SHEET_ID);
    var clientsSheet = ss.getSheetByName('Clients');
    if (!clientsSheet) {
      return { found: false, error: 'Clients sheet not found' };
    }

    var lastRow = clientsSheet.getLastRow();
    if (lastRow < 3) {
      return { found: false, user: null };
    }

    // Clients!A3:N = mobile, name, email, membership, expiryDate, remainDays,
    //                hoursPackages, registrationDateTime, remainingHours,
    //                remainingOfTenDays, invitations, rating, gender, offers
    var data = clientsSheet.getRange('A3:N' + lastRow).getValues();
    var matches = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var match = false;

      if (searchBy === 'name') {
        match =
          row[1] &&
          row[1]
            .toString()
            .toLowerCase()
            .indexOf(searchValue.toLowerCase()) !== -1;
      } else {
        var mobile = row[0] ? row[0].toString().replace(/^'/, '') : '';
        match = mobile === searchValue;
      }

      if (match) {
        matches.push({
          mobile: row[0] ? row[0].toString().replace(/^'/, '') : '',
          name: row[1] || '',
          email: row[2] || '',
          membership: row[3] || '',
          expiryDate: row[4] || '',
          remainDays: row[5] || '',
          hoursPackages: row[6] || '',
          registrationDateTime: row[7] || '',
          remainingHours: row[8] || '',
          remainingOfTenDays: row[9] || '',
          invitations: row[10] || '',
          rating: row[11] || '',
          gender: row[12] || '',
          offers: row[13] || '',
          row: i + 3,
        });
      }
    }

    if (matches.length > 0) {
      return { found: true, user: matches[0], matches: matches, total: matches.length };
    }

    return { found: false, user: null, total: 0 };
  } catch (e) {
    return { found: false, error: e.toString() };
  }
}

/**
 * Search all monthly workbooks for user history
 */
function searchAllWorkbooks(searchValue, searchBy) {
  var files = DriveApp.getFiles();
  var workbooks = [];

  while (files.hasNext()) {
    var file = files.next();
    if (
      file.getName().indexOf('20') !== -1 &&
      file.getMimeType() === 'application/vnd.google-apps.spreadsheet'
    ) {
      workbooks.push({ id: file.getId(), name: file.getName() });
    }
  }

  workbooks.sort(function (a, b) {
    return b.name.localeCompare(a.name);
  });

  var allResults = [];

  for (var w = 0; w < workbooks.length; w++) {
    try {
      var ss = SpreadsheetApp.openById(workbooks[w].id);
      var sheets = ss.getSheets();

      for (var s = 0; s < sheets.length; s++) {
        var sheetName = sheets[s].getName();
        if (sheetName.indexOf('20') === -1) continue;

        var lastRow = sheets[s].getLastRow();
        if (lastRow < 4) continue;

        var data = sheets[s].getRange('A4:O' + lastRow).getValues();

        for (var r = 0; r < data.length; r++) {
          var row = data[r];
          var match = false;

          if (searchBy === 'name') {
            match =
              row[0] &&
              row[0]
                .toString()
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1;
          } else {
            var mobile = row[1] ? row[1].toString().replace(/^'/, '') : '';
            match = mobile === searchValue;
          }

          if (match) {
            allResults.push({
              month: workbooks[w].name,
              day: sheetName,
              record: row,
            });
          }
        }
      }
    } catch (e) {
      // Skip workbooks that can't be accessed
    }
  }

  return { results: allResults, total: allResults.length };
}

/**
 * Search user via Func sheet formulas (write mobile, flush, read results, clear)
 * Replaces the frontend's executeValuesUpdate + getSheetValues + getSheetValuesBatchGet cycle
 * Returns: { exists, valuesMatched (C2:O2 + A4:I4 combined), numberExists }
 */
function searchUserViaFunc(mobile) {
  try {
    var ss = SpreadsheetApp.openById(MAIN_SHEET_ID);
    var funcSheet = ss.getSheetByName('Func');
    if (!funcSheet) {
      return { exists: false, error: 'Func sheet not found' };
    }

    // Write mobile to A2 (triggers formulas)
    funcSheet.getRange('A2').setValue("'" + mobile);
    SpreadsheetApp.flush();

    // Read B2 (EXISTS / NOT_EXISTS)
    var numberExists = funcSheet.getRange('B2').getValue();

    var result = {
      numberExists: numberExists,
      exists: numberExists === 'EXISTS',
      valuesMatched: null,
    };

    if (result.exists) {
      // Read C2:O2 (user profile data) - 13 values
      var profileData = funcSheet.getRange('C2:O2').getValues()[0];
      // Read A4:I4 (check-in status data) - 9 values
      var statusData = funcSheet.getRange('A4:I4').getValues()[0];
      // Combine into single array (same format as getSheetValuesBatchGet)
      result.valuesMatched = profileData.concat(statusData);
    }

    // Clear A2
    funcSheet.getRange('A2').setValue('');
    SpreadsheetApp.flush();

    return result;
  } catch (e) {
    // Clear A2 on error
    try {
      var ss2 = SpreadsheetApp.openById(MAIN_SHEET_ID);
      ss2.getSheetByName('Func').getRange('A2').setValue('');
    } catch (e2) {}
    return { exists: false, error: e.toString() };
  }
}
