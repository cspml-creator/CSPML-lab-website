/* =============================================================
   indent-bot.js — Guided chatbot for Indent Form 1A
   All processing is client-side. No data leaves the browser.
   ============================================================= */
(function () {
  'use strict';

  /* ── Collected data ── */
  const data = {
    date: '', name: '', employee_id: '', department: '', designation: '',
    indent_type: '', budget_type: '', budget_other: '', purchase_mode: '',
    items: [],          // [{sl, desc, qty, unit, cost, remarks}]
    building: '', room_number: '', site_comments: '',
    usage_type: '', purpose: '', nature: ''
  };

  /* ── State ── */
  let phase = 'idle';
  let draft = {};       // accumulates current item fields

  /* ── Progress phases (for progress bar) ── */
  const PROGRESS_PHASES = [
    'date','name','employee_id','department','designation',
    'indent_type','budget_type','purchase_mode',
    'building','room_number','site_comments','usage_type','purpose','nature','done'
  ];

  /* ── DOM refs ── */
  let panel, overlay, msgArea, inputArea, textInput, sendBtn;

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    panel     = document.getElementById('indent-chat-panel');
    overlay   = document.getElementById('chat-overlay');
    msgArea   = document.getElementById('chat-messages');
    inputArea = document.getElementById('chat-input-area');
    textInput = document.getElementById('chat-text-input');
    sendBtn   = document.getElementById('chat-send-btn');

    if (!panel) return;

    /* Set today's date as default */
    const now = new Date();
    data.date = [
      String(now.getDate()).padStart(2,'0'),
      String(now.getMonth()+1).padStart(2,'0'),
      now.getFullYear()
    ].join('/');

    document.getElementById('open-indent-btn')
      ?.addEventListener('click', openChat);
    document.getElementById('close-chat-btn')
      ?.addEventListener('click', closeChat);
    document.getElementById('reset-chat-btn')
      ?.addEventListener('click', resetChat);
    overlay?.addEventListener('click', closeChat);

    sendBtn?.addEventListener('click', handleSend);
    textInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
  }

  /* ─────────────────────────────────────────
     OPEN / CLOSE / RESET
  ───────────────────────────────────────── */
  function openChat() {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (msgArea.children.length === 0) startChat();
  }

  function closeChat() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetChat() {
    msgArea.innerHTML = '';
    inputArea.style.display = 'none';
    Object.keys(data).forEach(k => { data[k] = k === 'items' ? [] : ''; });
    const now = new Date();
    data.date = [
      String(now.getDate()).padStart(2,'0'),
      String(now.getMonth()+1).padStart(2,'0'),
      now.getFullYear()
    ].join('/');
    draft = {};
    phase = 'idle';
    setProgress(0);
    startChat();
  }

  /* ─────────────────────────────────────────
     CHAT FLOW
  ───────────────────────────────────────── */
  function startChat() {
    botMsg("Welcome! 👋 I'm your <strong>CSPML Indent Assistant</strong>.");
    botDelay("I'll guide you through <strong>IIT Dharwad Indent Form 1A</strong> (purchases up to ₹50,000). At the end you'll get the original form pre-filled as a <strong>.docx</strong> file.", 900);
    setTimeout(() => go('date'), 1800);
  }

  function go(nextPhase) {
    phase = nextPhase;
    setProgress(PROGRESS_PHASES.indexOf(nextPhase));
    setTimeout(() => ask(), 350);
  }

  function ask() {
    switch (phase) {

      /* ── Basic info ── */
      case 'date':
        botMsg("What is today's date?");
        showText('DD/MM/YYYY', data.date); break;

      case 'name':
        botMsg("Your full name as <strong>Indentor</strong>?");
        showText('e.g. Dr. Ravi Kumar'); break;

      case 'employee_id':
        botMsg("Employee ID?");
        showText('e.g. EE12345'); break;

      case 'department':
        botMsg("Department / Division?");
        showText('e.g. EECE', 'EECE'); break;

      case 'designation':
        botMsg("Designation?");
        showText('e.g. Assistant Professor'); break;

      /* ── Indent type ── */
      case 'indent_type':
        botMsg("Type of Indent?");
        showOpts(['Equipment / Asset', 'Consumable', 'Services', 'Others']); break;

      /* ── Budget ── */
      case 'budget_type':
        botMsg("Budget Type?");
        showOpts(['Institute', 'Departmental', 'Other']); break;

      case 'budget_other':
        botMsg("Please specify the budget source:");
        showText('Budget name / project code'); break;

      /* ── Purchase mode ── */
      case 'purchase_mode':
        botMsg("Purchase Mode?");
        showOpts(['GeM', 'Other']); break;

      /* ── Items ── */
      case 'item_start':
        botMsg("Now let's add the <strong>items</strong> for this indent.");
        setTimeout(() => go('item_desc'), 700); break;

      case 'item_desc':
        botMsg(`📦 <strong>Item ${data.items.length + 1}</strong> — Description?`);
        showText('e.g. Oscilloscope 100 MHz with probes'); break;

      case 'item_qty':
        botMsg("Quantity?");
        showText('e.g. 1'); break;

      case 'item_unit':
        botMsg("Unit? (Nos., kg, set, litre…)");
        showText('e.g. Nos.'); break;

      case 'item_cost':
        botMsg("Estimated cost with taxes (₹)?");
        showText('e.g. 45000'); break;

      case 'item_remarks':
        botMsg("Any remarks for this item?");
        showText('Optional', '', true); break;

      case 'item_more':
        /* Push completed item */
        data.items.push({
          sl:      data.items.length + 1,
          desc:    draft.desc    || '',
          qty:     draft.qty     || '',
          unit:    draft.unit    || '',
          cost:    draft.cost    || '',
          remarks: draft.remarks || ''
        });
        draft = {};
        botMsg(`✅ Item ${data.items.length} added!`);
        botDelay("Would you like to add another item?", 500);
        setTimeout(() => showOpts(['Yes, add another item', 'No, done with items']), 900);
        break;

      /* ── Location ── */
      case 'building':
        botMsg("Installation / Usage Location — <strong>Building name</strong>?");
        showText('e.g. Academic Block-I'); break;

      case 'room_number':
        botMsg("Room Number?");
        showText('e.g. 305'); break;

      case 'site_comments':
        botMsg("Any comments on site readiness or expected completion date?");
        showText('Optional', '', true); break;

      /* ── Usage / purpose / nature ── */
      case 'usage_type':
        botMsg("The equipment / asset is currently used for?");
        showOpts(['Instructional', 'SCIF', 'DCIF', 'R&D Lab', 'Office']); break;

      case 'purpose':
        botMsg("Purpose of requirement & expected delivery details?");
        showText('e.g. Required for 5G channel estimation research; delivery expected in 4 weeks'); break;

      case 'nature':
        botMsg("Nature of the service / item?");
        showOpts(['Indigenous', 'Import', 'Proprietary']); break;

      /* ── Done ── */
      case 'done':
        botMsg("🎉 All details collected! Your <strong>Indent Form 1A</strong> is ready.");
        showDownload(); break;
    }
  }

  /* ─────────────────────────────────────────
     ANSWER HANDLER (text inputs)
  ───────────────────────────────────────── */
  function handleSend() {
    const val = textInput.value.trim();
    const skippable = ['item_remarks', 'site_comments'].includes(phase);
    if (!val && !skippable) return;
    hideInput();
    userMsg(val || '(skipped)');
    store(val);
  }

  function store(val) {
    switch (phase) {
      case 'date':         data.date        = val || data.date; go('name'); break;
      case 'name':         data.name        = val; go('employee_id'); break;
      case 'employee_id':  data.employee_id = val; go('department'); break;
      case 'department':   data.department  = val; go('designation'); break;
      case 'designation':  data.designation = val; go('indent_type'); break;
      case 'budget_other': data.budget_other= val; go('purchase_mode'); break;
      case 'item_desc':    draft.desc       = val; go('item_qty'); break;
      case 'item_qty':     draft.qty        = val; go('item_unit'); break;
      case 'item_unit':    draft.unit       = val; go('item_cost'); break;
      case 'item_cost':    draft.cost       = val; go('item_remarks'); break;
      case 'item_remarks': draft.remarks    = val; go('item_more'); break;
      case 'building':     data.building    = val; go('room_number'); break;
      case 'room_number':  data.room_number = val; go('site_comments'); break;
      case 'site_comments':data.site_comments = val; go('usage_type'); break;
      case 'purpose':      data.purpose     = val; go('nature'); break;
    }
  }

  /* ─────────────────────────────────────────
     OPTION HANDLER (button choices)
  ───────────────────────────────────────── */
  function pick(val) {
    switch (phase) {
      case 'indent_type':  data.indent_type  = val; go('budget_type'); break;
      case 'budget_type':
        data.budget_type = val;
        go(val === 'Other' ? 'budget_other' : 'purchase_mode'); break;
      case 'purchase_mode':data.purchase_mode= val; go('item_start'); break;
      case 'item_more':
        val.startsWith('Yes') ? go('item_desc') : go('building'); break;
      case 'usage_type':   data.usage_type   = val; go('purpose'); break;
      case 'nature':       data.nature       = val; go('done'); break;
    }
  }

  /* ─────────────────────────────────────────
     UI HELPERS
  ───────────────────────────────────────── */
  function botMsg(html) {
    const d = document.createElement('div');
    d.className = 'cm cm-bot';
    d.innerHTML = `<div class="cb">${html}</div>`;
    msgArea.appendChild(d);
    scrollDown();
  }

  function botDelay(html, ms) {
    setTimeout(() => botMsg(html), ms);
  }

  function userMsg(text) {
    const d = document.createElement('div');
    d.className = 'cm cm-user';
    d.innerHTML = `<div class="cb">${esc(text)}</div>`;
    msgArea.appendChild(d);
    scrollDown();
  }

  function showText(placeholder, prefill, skippable) {
    inputArea.style.display = 'flex';
    textInput.placeholder = placeholder || 'Type here…';
    textInput.value = prefill || '';
    textInput.focus();
    const old = inputArea.querySelector('.chat-skip');
    if (old) old.remove();
    if (skippable) {
      const b = document.createElement('button');
      b.className = 'chat-skip';
      b.textContent = 'Skip';
      b.onclick = () => { hideInput(); userMsg('(skipped)'); store(''); };
      inputArea.appendChild(b);
    }
  }

  function showOpts(options) {
    hideInput();
    const wrap = document.createElement('div');
    wrap.className = 'chat-opts';
    options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'chat-opt-btn';
      b.textContent = opt;
      b.onclick = () => { wrap.remove(); userMsg(opt); pick(opt); };
      wrap.appendChild(b);
    });
    msgArea.appendChild(wrap);
    scrollDown();
  }

  function showDownload() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-dl-wrap';
    const btn = document.createElement('button');
    btn.className = 'chat-dl-btn';
    btn.innerHTML = '⬇&nbsp; Download Indent Form (.docx)';
    btn.onclick = generateDOCX;
    wrap.appendChild(btn);
    msgArea.appendChild(wrap);
    scrollDown();
  }

  function hideInput() {
    inputArea.style.display = 'none';
    textInput.value = '';
    const s = inputArea.querySelector('.chat-skip');
    if (s) s.remove();
  }

  function scrollDown() {
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function setProgress(idx) {
    const total = PROGRESS_PHASES.length - 1;
    const pct   = idx < 0 ? 0 : Math.min(100, Math.round((idx / total) * 100));
    document.getElementById('chat-prog-bar').style.width  = pct + '%';
    document.getElementById('chat-prog-pct').textContent  = pct + '%';
  }

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  /* ─────────────────────────────────────────
     DOCX GENERATION  (docxtemplater + PizZip)
  ───────────────────────────────────────── */
  async function generateDOCX() {
    const btn = msgArea.querySelector('.chat-dl-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳&nbsp; Generating…'; }

    try {
      const resp = await fetch('indent-template.docx');
      if (!resp.ok) throw new Error('Template not found');
      const buf  = await resp.arrayBuffer();

      const zip = new PizZip(buf);
      const Doc = window.docxtemplater;
      const doc = new Doc(zip, { paragraphLoop: true, linebreaks: true });

      /* ── Selection line helpers ── */
      function sel(opts, chosen) {
        const letters = 'abcdefgh';
        return opts.map((o, i) => {
          const mark = o === chosen ? '[✓]' : '[ ]';
          return `(${letters[i]}) ${mark} ${o}`;
        }).join('   ');
      }

      /* ── Item data (up to 5 slots) ── */
      const items = data.items;
      const total = items.reduce((s, it) => {
        return s + (parseFloat(String(it.cost).replace(/[^0-9.]/g, '')) || 0);
      }, 0);

      const tplData = {
        date:        data.date,
        name:        data.name,
        employee_id: data.employee_id,
        department:  data.department,
        designation: data.designation,

        indent_type_line:  sel(['Equipment/Asset', 'Consumable', 'Services', 'Others'], data.indent_type),
        budget_type_line:  sel(
          ['Institute', 'Departmental',
           'Other' + (data.budget_other ? ': ' + data.budget_other : '')],
          data.budget_type === 'Other' ? 'Other' + (data.budget_other ? ': ' + data.budget_other : '') : data.budget_type
        ),
        purchase_mode_line: sel(['GeM', 'Other@'], data.purchase_mode),

        building:      data.building,
        room_number:   data.room_number,
        site_comments: data.site_comments || '',

        usage_type_line: ['Instructional', 'SCIF', 'DCIF', 'R&D Lab', 'Office']
          .map(o => o === data.usage_type ? `[${o}]` : o).join(' / '),

        purpose:     data.purpose,
        nature_line: sel(['Indigenous', 'Import#', 'Proprietary$'], data.nature),

        total: '₹' + total.toLocaleString('en-IN'),
      };

      for (let i = 1; i <= 5; i++) {
        const it = items[i - 1];
        tplData[`i${i}sl`] = it ? String(i)          : '';
        tplData[`i${i}d`]  = it ? (it.desc || '')    : '';
        tplData[`i${i}q`]  = it ? (it.qty  || '')    : '';
        tplData[`i${i}u`]  = it ? (it.unit || '')    : '';
        tplData[`i${i}c`]  = it ? (it.cost || '')    : '';
        tplData[`i${i}r`]  = it ? (it.remarks || '') : '';
      }

      doc.render(tplData);

      const blob = doc.getZip().generate({ type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `IndentForm1A_${(data.name || 'CSPML').replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      botMsg('✅ <strong>IndentForm1A.docx</strong> downloaded! Open in Word or LibreOffice, add your signature, and submit.');
    } catch (err) {
      console.error('DOCX error:', err);
      botMsg('❌ Could not generate the form. Please refresh and try again.');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '⬇&nbsp; Download Indent Form (.docx)'; }
    }
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', init);
})();
