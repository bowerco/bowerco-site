# bowerco-site

The bowerco.app landing page. One static page, built from the rules in
`bowerco/brand-bower` (colors, fonts, wordmark, voice).

- `index.html`: the page.
- `assets/`: wordmark and bird mark, copied from the brand book.
- `apps-script/Code.gs`: the Google Apps Script that adds waitlist signups to
  the "bower waitlist" Google Sheet. It is deployed from that sheet
  (Extensions > Apps Script); its web app URL is in the form's `data-endpoint`.
- `CNAME`: points GitHub Pages at bowerco.app.

To change the script: edit it in Apps Script, then Deploy > Manage deployments >
edit > Version: New version > Deploy. This keeps the same URL.
