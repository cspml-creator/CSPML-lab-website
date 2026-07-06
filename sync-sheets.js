/* =============================================================
   sync-sheets.js — Pull data from Google Sheets into data/*.json

   HOW TO USE:
     1. Set up your Google Sheet (see README-SHEETS.md)
     2. Paste your Sheet URLs into the CONFIG section below
     3. Run:  node sync-sheets.js
     4. Refresh the website — done!
   ============================================================= */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

/* ══════════════════════════════════════════════════════════════
   CONFIG — paste your Google Sheets CSV URLs here

   How to get the URL for each tab:
     1. Open your Google Sheet
     2. Click File → Share → Publish to web
     3. Choose the tab name (e.g. "Faculty")
     4. Choose "Comma-separated values (.csv)"
     5. Click Publish and copy the URL
   ══════════════════════════════════════════════════════════════ */
const SHEET_URLS = {
  faculty:          'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=910680007&single=true&output=csv',
  staff:            'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=88331592&single=true&output=csv',
  students_phd:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=733033271&single=true&output=csv',
  students_ms:      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=1769008689&single=true&output=csv',
  students_mtech:   'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=1865956931&single=true&output=csv',
  students_project: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=1573723552&single=true&output=csv',
  publications:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pub?gid=2080729237&single=true&output=csv',
  infrastructure:   'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD6LuDnk2ycQCvTDa9ygwiYG1H5WXBknkOF0x8PuusNex8aicCZ10HL4RaMkh463TCAdy0hfN3CdZa/pubhtml?gid=460085960&single=true',
};

/* ══════════════════════════════════════════════════════════════
   GOOGLE SHEET COLUMN HEADERS (must match exactly)

   Faculty tab columns:
     name | role | initials | photo | profile_url | research_areas

   Staff tab columns:
     name | role | initials | photo | bio

   PhD / MS / MTech / Project tab columns:
     name | initials | photo | status | supervisor | bio
     (status = "pursuing" or "graduated")

   Publications tab columns:
     year | type | title | authors | venue | recent
     (type = "journal" or "conference", recent = "true" or "false")

   Infrastructure tab columns:
     name | photo | description | link
   ══════════════════════════════════════════════════════════════ */

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('PASTE_')) {
      reject(new Error('URL not configured: ' + url));
      return;
    }
    https.get(url, (res) => {
      /* Follow redirects (Google Sheets uses 307) */
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        https.get(res.headers.location, (res2) => {
          let data = '';
          res2.on('data', chunk => data += chunk);
          res2.on('end', () => resolve(data));
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSV(text, keyField = 'name') {
  const lines = text.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    /* Simple CSV parser — handles quoted fields with commas inside */
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; continue; }
      if (line[i] === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += line[i];
    }
    values.push(current.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || '');
    return obj;
  }).filter(row => row[keyField] && row[keyField].trim() !== '');
}

function boolField(val) {
  return val === 'true' || val === 'TRUE' || val === 'yes' || val === 'YES' || val === '1';
}

async function sync() {
  console.log('Syncing from Google Sheets...\n');
  let errors = 0;

  /* ── Faculty ── */
  try {
    const csv = await fetchCSV(SHEET_URLS.faculty);
    const data = parseCSV(csv);
    fs.writeFileSync(path.join('data', 'faculty.json'), JSON.stringify({ faculty: data }, null, 2));
    console.log('✓ Faculty:', data.length, 'records');
  } catch (e) { console.error('✗ Faculty:', e.message); errors++; }

  /* ── Staff ── */
  try {
    const csv = await fetchCSV(SHEET_URLS.staff);
    const data = parseCSV(csv);
    fs.writeFileSync(path.join('data', 'staff.json'), JSON.stringify({ staff: data }, null, 2));
    console.log('✓ Staff:', data.length, 'records');
  } catch (e) { console.error('✗ Staff:', e.message); errors++; }

  /* ── Students ── */
  const students = { phd: [], ms: [], mtech: [], project: [] };
  for (const key of ['phd', 'ms', 'mtech', 'project']) {
    try {
      const csv = await fetchCSV(SHEET_URLS['students_' + key]);
      students[key] = parseCSV(csv);
      console.log(`✓ Students (${key.toUpperCase()}):`, students[key].length, 'records');
    } catch (e) { console.error(`✗ Students (${key}):`, e.message); errors++; }
  }
  fs.writeFileSync(path.join('data', 'students.json'), JSON.stringify(students, null, 2));

  /* ── Publications ── */
  try {
    const csv = await fetchCSV(SHEET_URLS.publications);
    const raw = parseCSV(csv, 'title');
    const data = raw.map(p => ({
      year:    parseInt(p.year) || 2024,
      type:    p.type || 'journal',
      title:   p.title,
      authors: p.authors,
      venue:   p.venue,
      recent:  boolField(p.recent),
    }));
    fs.writeFileSync(path.join('data', 'publications.json'), JSON.stringify({ publications: data }, null, 2));
    console.log('✓ Publications:', data.length, 'records');
  } catch (e) { console.error('✗ Publications:', e.message); errors++; }

  /* ── Infrastructure ── */
  try {
    const csv = await fetchCSV(SHEET_URLS.infrastructure);
    const data = parseCSV(csv);
    fs.writeFileSync(path.join('data', 'infrastructure.json'), JSON.stringify({ infrastructure: data }, null, 2));
    console.log('✓ Infrastructure:', data.length, 'records');
  } catch (e) { console.error('✗ Infrastructure:', e.message); errors++; }

  console.log('\n' + (errors === 0 ? '✓ All done! Refresh your browser.' : `Done with ${errors} error(s). Check URLs above.`));
}

sync();
