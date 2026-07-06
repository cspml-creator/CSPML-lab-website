# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for the CSPML Lab (Communication, Signal Processing & Machine Learning) at IIT Dharwad. No build step — plain HTML/CSS/JS served directly. Deployed on Netlify from the `v3` branch of `github.com/cspml-creator/CSPML-lab-website`.

## Common Commands

```bash
# Sync all data from Google Sheets into data/*.json
node sync-sheets.js

# After syncing or any local change, push to trigger Netlify redeploy
git add data/
git commit -m "sync data from Google Sheets"
git push
```

The site must be served via a local web server (not `file://`) because `renderer.js` uses `fetch()`. Use VS Code Live Server or `python3 -m http.server`.

## Architecture

### Data flow
Google Sheets → `sync-sheets.js` → `data/*.json` → `js/renderer.js` → DOM

`renderer.js` loads all four JSON files in parallel on `DOMContentLoaded` and injects HTML cards into pre-existing grid containers (`#faculty-grid`, `#staff-grid`, `#phd-grid`, etc. and `#publications-container`).

### JSON file structure (important)
All `data/*.json` files are **wrapped objects**, not bare arrays. This was required for Decap CMS compatibility:

```json
// data/faculty.json    → { "faculty": [...] }
// data/staff.json      → { "staff": [...] }
// data/publications.json → { "publications": [...] }
// data/students.json   → { "phd": [...], "ms": [...], "mtech": [...], "project": [...] }
```

`renderer.js` unwraps with `.then(d => d.faculty || d)` etc. — the `|| d` fallback handles the legacy flat-array format if needed.

### Scroll reveal
`index.html` inline script creates `const revealObserver` and exposes it as `window._revealObserver`. `renderer.js` calls `window._revealObserver.observe(el)` on dynamically injected `.reveal` elements after rendering. If `_revealObserver` is undefined, dynamically rendered sections stay invisible.

### Hero animation
`js/shader-background.js` — self-contained IIFE. Targets `<canvas id="hero-canvas">`. Vanilla JS port of a WebGL plasma shader. Gracefully no-ops if WebGL is unavailable.

## CMS (Decap CMS via Netlify)

Access at `https://<site>.netlify.app/admin`. Uses Netlify Identity (invite-only) + Git Gateway. Editorial workflow is enabled — changes go Draft → In Review → Ready → Publish before triggering a deploy.

Config at `admin/config.yml`. Backend branch is `v3`. Collections map directly to the four `data/*.json` files.

## Google Sheets Sync

Sheet URLs are hardcoded in `sync-sheets.js` under `SHEET_URLS`. The sheet is published as CSV (File → Share → Publish to web, per-tab). `parseCSV()` uses `'title'` as the key field for publications (all other collections use `'name'`). CRLF line endings from Google Sheets are normalised before parsing.
