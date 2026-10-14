// bower waitlist: receives signups from bowerco.app and adds them to this sheet.
// Setup: in the "bower waitlist" sheet, Extensions > Apps Script, paste this file,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).

const SHEET_NAME = 'Signups';
const HEADERS = ['Signed up', 'Email', 'Source', 'Consent'];
const CONSENT = "You'll get emails from bower about early access. Unsubscribe anytime.";

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Bots fill the hidden "company" field; pretend it worked and drop it.
  if (p.company) return json({ result: 'success' });

  const email = String(p.email || '').trim().toLowerCase();
  const valid = email.length <= 254 &&
    /^[^\s@=+\-][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) return json({ result: 'invalid' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    const last = sheet.getLastRow();
    if (last > 1) {
      const found = sheet.getRange(2, 2, last - 1, 1)
        .createTextFinder(email).matchEntireCell(true).findNext();
      if (found) return json({ result: 'exists' });
    }
    sheet.appendRow([new Date(), email, 'bowerco.app', CONSENT]);
    return json({ result: 'success' });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
