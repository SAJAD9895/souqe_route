# Google Sheets Integration Setup

To connect your "Get In Touch" form to your Google Sheet, follow these steps:

## 1. Prepare the Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1pcFg0rZKR556CPF0tf3poEbfseWWbKgqiZgKjIgHoTk/edit
2. Ensure the first row (Header) has these named columns (order matters for the script below):
   - **Column A**: Timestamp
   - **Column B**: Name
   - **Column C**: Email
   - **Column D**: Company
   - **Column E**: Phone
   - **Column F**: Role
   - **Column G**: Category
   - **Column H**: Message

## 2. Add the Script
1. In the Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in `Code.gs` and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parse the data sent from the website
  // We use text/plain to avoid CORS preflight issues
  var data = JSON.parse(e.postData.contents);
  
  var timestamp = new Date();
  
  // Append the row
  sheet.appendRow([
    timestamp,
    data.name,
    data.email,
    data.company,
    data.phone,
    data.role,
    data.category,
    data.message
  ]);
  
  // Return success result
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Service is running");
}
```

3. Click the **Save** icon (disk).

## 3. Deploy as Web App
1. Click the **Deploy** button (blue, top right) > **New deployment**.
2. Click the specific **Select type** (gear icon) -> **Web app**.
3. Fill in:
   - **Description**: Contact Form
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (This is critical!)
4. Click **Deploy**.
5. You may be asked to **Authorize access**. Click **Review permissions**, choose your account. 
   - *Note: If you see "Google hasn't verified this app", click "Advanced" > "Go to (Project Name) (unsafe)"*. This is safe because it's your own script.
6. Copy the **Web App URL** provided at the end (it starts with `https://script.google.com/macros/s/...`).

## 4. Connect to Website
1. Open `src/pages/Home.jsx` in your code editor.
2. Find the line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE'` with the URL you just copied.
4. Save the file.

Your form is now connected!

## Troubleshooting

### "Sign In" Screen or Script Not Working
If the form doesn't update the sheet, or if visiting the Script URL asks you to "Sign In":
1. You likely set **Who has access** to "Only me" or "Anyone with Google Account".
2. It **MUST** be set to **Anyone**.
3. To fix:
   - Go to your Apps Script.
   - Click **Deploy** > **New deployment**.
   - Set **Who has access** to **Anyone**.
   - Click **Deploy**.
   - **Important**: This will give you a **NEW URL**. You must copy this new URL and update `Home.jsx`.

