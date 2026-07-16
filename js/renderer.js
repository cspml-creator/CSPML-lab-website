/* =============================================================
   renderer.js — Reads data/*.json and builds page sections
   To update the website: edit the JSON files, NOT this file.
   ============================================================= */

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Could not load ' + path);
  return res.json();
}

function facultyCardHTML(f) {
  const img = f.photo
    ? `<img src="${f.photo}" alt="${f.name}" onload="this.classList.add('loaded')">`
    : '';
  const link = f.profile_url
    ? `<a href="${f.profile_url}" target="_blank" class="pcard-link">Faculty Profile →</a>`
    : '';
  return `
    <div class="pcard faculty">
      <div class="pcard-photo">
        <div class="pcard-initials">${f.initials}</div>${img}
      </div>
      <div class="pcard-badge">${f.role}</div>
      <div class="pcard-name">${f.name}</div>
      <p class="pcard-bio">${f.research_areas}</p>
      ${link}
    </div>`;
}

function staffCardHTML(s) {
  const img = s.photo
    ? `<img src="${s.photo}" alt="${s.name}" onload="this.classList.add('loaded')">`
    : '';
  return `
    <div class="pcard">
      <div class="pcard-photo">
        <div class="pcard-initials">${s.initials}</div>${img}
      </div>
      <div class="pcard-badge">Technical Staff</div>
      <div class="pcard-name">${s.name}</div>
      <p class="pcard-bio">${s.bio}</p>
    </div>`;
}

function studentCardHTML(s, badgeLabel) {
  const img = s.photo
    ? `<img src="${s.photo}" alt="${s.name}" onload="this.classList.add('loaded')">`
    : '';
  const graduated = s.status === 'graduated' ? ' graduated' : '';
  const bio = s.bio ? `<p class="pcard-bio">${s.bio}</p>` : '';
  const supervisor = s.supervisor
    ? `<div class="pcard-supervisor">${s.supervisor}</div>`
    : '';
  return `
    <div class="pcard student${graduated}">
      <div class="pcard-photo">
        <div class="pcard-initials">${s.initials}</div>${img}
      </div>
      <div class="pcard-badge">${badgeLabel}</div>
      <div class="pcard-name">${s.name}</div>
      ${bio}
      ${supervisor}
    </div>`;
}

function publicationCardHTML(p) {
  const recentBadge = p.recent ? '<span class="pub-new-badge">New</span>' : '';
  const recentClass = p.recent ? ' recent' : '';
  return `
    <div class="pub-card ${p.type}${recentClass}">
      <div class="pub-badges">
        <span class="pub-type-badge ${p.type}">${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</span>
        ${recentBadge}
      </div>
      <h3 class="pub-title">${p.title}</h3>
      <div class="pub-authors">${p.authors}</div>
      <div class="pub-venue">${p.venue}</div>
    </div>`;
}

function infraCardHTML(item) {
  const img = item.photo
    ? `<img class="infra-photo" src="${item.photo}" alt="${item.name}" onerror="this.src='images/placeholder/equipment.svg'">`
    : `<img class="infra-photo" src="images/placeholder/equipment.svg" alt="${item.name}">`;
  const link = item.link
    ? `<a href="${item.link}" target="_blank" class="btn-sm">Read more →</a>`
    : '';
  return `
    <div class="infra-card">
      ${img}
      <div class="infra-body">
        <div class="infra-name">${item.name}</div>
        <div class="infra-desc">${item.description}</div>
        ${link}
      </div>
    </div>`;
}

async function renderAll() {
  try {
    const [faculty, staff, students, publications, infrastructure] = await Promise.all([
      loadJSON('data/faculty.json').then(d => d.faculty || d),
      loadJSON('data/staff.json').then(d => d.staff || d),
      loadJSON('data/students.json'),
      loadJSON('data/publications.json').then(d => d.publications || d),
      loadJSON('data/infrastructure.json').then(d => d.infrastructure || d),
    ]);

    /* ── Faculty ── */
    const facultyGrid = document.getElementById('faculty-grid');
    if (facultyGrid) {
      facultyGrid.innerHTML = faculty.map(facultyCardHTML).join('');
      updateTabCount('faculty', faculty.length);
    }

    /* ── Staff ── */
    const staffGrid = document.getElementById('staff-grid');
    if (staffGrid) {
      staffGrid.innerHTML = staff.map(staffCardHTML).join('');
      updateTabCount('staff', staff.length);
    }

    /* ── Students ── */
    const phd    = students.phd     || [];
    const ms     = students.ms      || [];
    const mtech  = students.mtech   || [];
    const project = students.project || [];

    const phdGrid = document.getElementById('phd-grid');
    if (phdGrid) phdGrid.innerHTML = phd.filter(s => s.status !== 'graduated')
      .map(s => studentCardHTML(s, 'PhD · Pursuing')).join('');

    const msGrid = document.getElementById('ms-grid');
    if (msGrid) msGrid.innerHTML = ms.filter(s => s.status !== 'graduated')
      .map(s => studentCardHTML(s, 'MS · Pursuing')).join('');

    const mtechGrid = document.getElementById('mtech-grid');
    if (mtechGrid) mtechGrid.innerHTML = mtech.filter(s => s.status !== 'graduated')
      .map(s => studentCardHTML(s, 'MTech · Pursuing')).join('');

    const projectGrid = document.getElementById('project-grid');
    if (projectGrid) projectGrid.innerHTML = project.map(s =>
      studentCardHTML(s, 'Project Associate')
    ).join('');

    const graduatedGrid = document.getElementById('graduated-grid');
    if (graduatedGrid) {
      const graduated = [
        ...phd.filter(s => s.status === 'graduated').map(s => ({ ...s, _degree: 'PhD' })),
        ...ms.filter(s => s.status === 'graduated').map(s => ({ ...s, _degree: 'MS' })),
        ...mtech.filter(s => s.status === 'graduated').map(s => ({ ...s, _degree: 'MTech' })),
      ];
      graduatedGrid.innerHTML = graduated.map(s => studentCardHTML(s, s._degree + ' · Graduated')).join('');
    }

    const totalStudents = phd.length + ms.length + mtech.length + project.length;
    updateTabCount('students', totalStudents);

    /* ── Hero stats ── */
    const pursuingStudents = [...phd, ...ms, ...mtech, ...project]
      .filter(s => s.status !== 'graduated').length;
    updateHeroStat('Publications', publications.length);
    updateHeroStat('Students',     pursuingStudents);
    updateHeroStat('Faculty',      faculty.length);

    /* ── Publications ── */
    const pubContainer = document.getElementById('publications-container');
    if (pubContainer) {
      const filteredPubs = publications.filter(p => p.year >= 2025);
      const years = [...new Set(filteredPubs.map(p => p.year))].sort((a, b) => b - a);
      pubContainer.innerHTML = years.map(year => {
        const yearPubs = filteredPubs.filter(p => p.year === year);
        return `
          <div class="pub-year-group reveal">
            <div class="pub-year-marker"><span>${year}</span></div>
            <div class="pub-entries">
              ${yearPubs.map(publicationCardHTML).join('')}
            </div>
          </div>`;
      }).join('');

      /* Re-observe new reveal elements */
      document.querySelectorAll('#publications-container .reveal').forEach(el => {
        if (window._revealObserver) window._revealObserver.observe(el);
      });
    }

    /* ── Infrastructure ── */
    const infraGrid = document.getElementById('infra-grid');
    if (infraGrid) {
      infraGrid.innerHTML = infrastructure.map(infraCardHTML).join('');
    }

    /* Re-observe student grids for scroll reveal */
    document.querySelectorAll('.student-grid.reveal, .faculty-grid.reveal').forEach(el => {
      if (window._revealObserver) window._revealObserver.observe(el);
    });

  } catch (err) {
    console.error('Renderer error:', err);
  }
}

function updateTabCount(tab, count) {
  const btn = document.querySelector(`.ppl-tab[data-tab="${tab}"] .ppl-tab-count`);
  if (btn) btn.textContent = count;
}

function updateHeroStat(label, count) {
  document.querySelectorAll('.stat').forEach(stat => {
    const lbl = stat.querySelector('.stat-label');
    const num = stat.querySelector('.stat-num');
    if (lbl && num && lbl.textContent.trim() === label) {
      num.textContent = count;
    }
  });
}

document.addEventListener('DOMContentLoaded', renderAll);
