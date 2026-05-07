# How to Update the Website via Google Sheets

## One-time Setup (do this once)

### Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it: **CSPML Website Data**
3. Create these tabs (click the + button at the bottom):
   - `Faculty`
   - `Staff`
   - `PhD`
   - `MS`
   - `MTech`
   - `Project`
   - `Publications`

---

### Step 2 — Set up column headers (copy exactly)

**Faculty tab — Row 1 headers:**
```
name | role | initials | photo | profile_url | research_areas
```

**Staff tab — Row 1 headers:**
```
name | role | initials | photo | bio
```

**PhD / MS / MTech / Project tabs — Row 1 headers:**
```
name | initials | photo | status | supervisor | bio
```
- `status` must be either: `pursuing` or `graduated`

**Publications tab — Row 1 headers:**
```
year | type | title | authors | venue | recent
```
- `type` must be either: `journal` or `conference`
- `recent` must be either: `true` or `false`

---

### Step 3 — Fill in your data

Copy the existing data from `data/*.json` files into the sheet.
Each row = one person or one publication.

**Photo column:** just the filename path, e.g.
`images/people/student_photos/Shruti_M.jpeg`

---

### Step 4 — Publish each tab as CSV

For **each tab** (Faculty, Staff, PhD, MS, MTech, Project, Publications):

1. Click **File → Share → Publish to web**
2. Under "Link", select the tab name (e.g. "Faculty")
3. Change format from "Web page" to **Comma-separated values (.csv)**
4. Click **Publish** → copy the URL
5. Paste it into `sync-sheets.js` in the `SHEET_URLS` section

---

### Step 5 — Install Node.js (one time only)

Download from: https://nodejs.org (choose the LTS version)

---

## Day-to-day Usage

### To add a new student:
1. Open the Google Sheet
2. Go to the correct tab (PhD / MS / MTech / Project)
3. Add a new row with the student's details
4. Open a terminal in the website folder
5. Run: `node sync-sheets.js`
6. Refresh the browser — done!

### To add a new publication:
1. Open the Google Sheet → Publications tab
2. Add a new row
3. Run: `node sync-sheets.js`

### To change a student's status (e.g. graduated):
1. Open the sheet → find the student's row
2. Change `status` from `pursuing` to `graduated`
3. Run: `node sync-sheets.js`

---

## File Structure

```
data/
  faculty.json        ← updated by sync-sheets.js
  staff.json          ← updated by sync-sheets.js
  students.json       ← updated by sync-sheets.js
  publications.json   ← updated by sync-sheets.js

js/
  renderer.js         ← reads JSON files, builds the page (don't edit)
  main.js             ← handles navigation, animations (don't edit)

sync-sheets.js        ← run this after updating the Google Sheet
```

## If you don't have Google Sheets set up yet

You can directly edit the JSON files in the `data/` folder.
They are plain text — just follow the existing format.
No need to run any command — just save the file and refresh the browser.
