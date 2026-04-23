# CSPML Website — Communication, Signal Processing & Machine Learning Lab
## IIT Dharwad · EECE Department

---

## 📁 Folder Structure

```
cspml-website/
│
├── index.html               ← Main website (open this in a browser)
│
├── css/
│   ├── style.css            ← All layout, colors, typography
│   ├── components.css       ← Cards, buttons, nav, footer
│   └── animations.css       ← Scroll reveals, hover effects, ticker
│
├── js/
│   └── main.js              ← Scroll animations, ticker, form handler
│
├── images/
│   ├── hero/                ← Hero section images
│   │   └── README.md        ← Instructions for hero images
│   ├── people/              ← Faculty and student profile photos
│   │   └── README.md        ← Instructions for profile photos
│   ├── infrastructure/      ← Lab equipment photos
│   │   └── README.md        ← Instructions for equipment photos
│   ├── news/                ← News article images
│   │   └── README.md        ← Instructions for news images
│   └── placeholder/         ← Default placeholder images (SVG)
│       ├── person.svg        ← Default profile photo
│       ├── equipment.svg     ← Default equipment photo
│       └── news.svg          ← Default news image
│
├── content/
│   ├── people.md            ← Add/edit team members here
│   ├── publications.md      ← Add/edit publications here
│   ├── news.md              ← Add/edit news items here
│   ├── courses.md           ← Add/edit courses here
│   ├── research.md          ← Add/edit research areas here
│   └── infrastructure.md    ← Add/edit equipment list here
│
└── README.md                ← This file
```

---

## 🚀 How to Use This Website

### Step 1 — Open the website
Just double-click `index.html` to open it in your browser.  
No server, no installation needed.

### Step 2 — Add your images

Each `images/` subfolder has its own `README.md` explaining exactly what size and format to use. The short version:

| Folder | What goes here | Recommended size |
|---|---|---|
| `images/hero/` | Lab photo, campus photo, antenna photo | 1200 × 600 px |
| `images/people/` | Profile photos | 400 × 400 px (square) |
| `images/infrastructure/` | Equipment photos | 800 × 600 px |
| `images/news/` | News article images | 1000 × 500 px |

**To replace a placeholder:**
1. Copy your photo into the correct folder (e.g. `images/people/`)
2. Name it to match the person (e.g. `prof-mks.jpg`)
3. Open `index.html` in a text editor (Notepad, VS Code, etc.)
4. Search for the placeholder tag — e.g. `data-name="prof-mks"`
5. Change `src="images/placeholder/person.svg"` to `src="images/people/prof-mks.jpg"`

### Step 3 — Edit content

All content (names, publications, news, courses) is clearly marked in `index.html` with `<!-- EDIT: ... -->` comments. You can also read the `.md` files in `content/` as a reference for what to update.

---

## ✏️ Common Edits

### Add a news item
Open `index.html`, find the `<!-- NEWS SECTION -->` comment, copy one `<div class="news-item">` block, and paste + edit.

### Add a publication
Find `<!-- PUBLICATIONS SECTION -->`, copy one `<div class="pub-item">` block, paste + edit.

### Add a team member
Find `<!-- PEOPLE SECTION -->`, copy one `<div class="person-card">` block, paste and update the name, role, and photo path.

### Change lab contact details
Search for `<!-- EDIT: CONTACT -->` in `index.html`.

---

## 🌐 Publishing Online (Free Options)

| Platform | Steps |
|---|---|
| **GitHub Pages** | Upload this entire folder to a GitHub repo → Settings → Pages → Deploy from main branch |
| **Netlify** | Go to netlify.com → "Add new site" → drag and drop this entire folder |
| **IIT Dharwad Server** | Contact your institute's IT cell and upload the folder via SFTP |

---

## 🎨 Changing Colors / Fonts

Open `css/style.css` and look at the `:root { }` block at the top:

```css
:root {
  --navy: #0a1628;       /* Main dark background */
  --accent: #00c2ff;     /* Highlight / link color */
  --gold: #f5c842;       /* Course code color */
  ...
}
```

Change any of those values to retheme the entire site instantly.

---

## 📞 Need Help?

Contact the web maintainer or refer back to Claude.ai for further edits.
