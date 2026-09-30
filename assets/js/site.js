(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  document.documentElement.classList.add('js-ready');

  /* ── Language (EN default, CZ from i18n.js) ─────────────────────────── */
  const CS = window.I18N_CS || {};
  const EN_JS = {
    'js.copied': 'E-mail copied',
    'js.cl.ready': 'Loaded 6 files from S3. Run a check.',
    'js.cl.ok': 'ok',
    'js.cl.dup': 'duplicate IDs',
    'js.cl.miss': '"price" missing',
    'js.cl.fixed': 'fixed',
    'js.cl.dupLog': 'Checking duplicate IDs…\n',
    'js.cl.colLog': 'Checking column "price"…\n',
    'js.cl.found': 'found',
    'js.cl.fixLog': 'Fixing…\n',
    'js.cl.drop': 'dropped duplicate rows',
    'js.cl.rename': 'renamed column',
    'js.cl.zip': 'ZIP ready — 6 files, all clean ✓',
    'js.cl.allOk': 'all clean',
    'js.cx.scan': 'scanning…',
    'js.cx.chart': 'chart',
    'js.cx.text': 'text',
    'js.cx.done': 'Done — 2 charts found, values saved to CSV.',
    'js.cx.webDone': 'Done — 2 charts saved from iframes (title, data, source).',
    'js.cx.cap': 'New homes per year (sample)',
    'js.cx.pdfSrc': 'reports/market-q3.pdf',
    'js.cx.webSrc': 'https://example-research.com/housing-2023',
    'cx.empty': 'Press Run',
  };
  let lang = 'en';
  const t = (k) => (lang === 'cs' && CS[k] != null ? CS[k] : EN_JS[k] ?? k);
  const original = new WeakMap();
  const langListeners = [];

  const applyLang = (next) => {
    lang = next === 'cs' ? 'cs' : 'en';
    for (const el of $$('[data-i18n]')) {
      if (!original.has(el)) original.set(el, el.innerHTML);
      const cs = CS[el.dataset.i18n];
      el.innerHTML = lang === 'cs' && cs != null ? cs : original.get(el);
    }
    document.documentElement.lang = lang;
    $$('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('.lang-switch').forEach((sw) => { sw.dataset.active = lang; });
    try { localStorage.setItem('lang', lang); } catch (e) {}
    langListeners.forEach((fn) => fn());
  };
  $$('.lang-switch button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  const fromUrl = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  const initialLang = fromUrl || saved || 'en';

  /* ── Theme ──────────────────────────────────────────────────────────── */
  $('#theme-toggle')?.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ── Header, reveal, nav highlight ─────────────────────────────────── */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  const links = new Map($$('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.remove('active'));
      links.get(e.target.id)?.classList.add('active');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ── Media ──────────────────────────────────────────────────────────── */
  // Trailer: swap the poster for the video only when asked (saves ~3 MB on load).
  $$('.play[data-video]').forEach((btn) => btn.addEventListener('click', () => {
    const wrap = btn.parentElement;
    const v = document.createElement('video');
    v.src = btn.dataset.video;
    v.controls = true; v.autoplay = true; v.playsInline = true;
    v.poster = $('img', wrap)?.src || '';
    // Only one trailer plays at a time.
    v.addEventListener('play', () => $$('.video-wrap video').forEach((o) => { if (o !== v) o.pause(); }));
    $$('.video-wrap video').forEach((o) => o.pause());
    wrap.replaceChildren(v);
    v.play().catch(() => {});
  }));

  // Muted looping clips play only while on screen.
  const clipIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting && !reduceMotion) { v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    }
  }, { threshold: .35 });
  $$('video[loop][muted]').forEach((v) => clipIO.observe(v));

  // Lightbox for screenshot galleries and the reference letter.
  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  let list = [], idx = 0, lastFocus = null;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    lbImg.src = list[idx].dataset.full || list[idx].src;
    lbImg.alt = list[idx].alt;
    $$('.lb-nav', lb).forEach((b) => { b.hidden = list.length < 2; });
  };
  const open = (imgs, i, doc = false) => { list = imgs; lastFocus = document.activeElement; lb.classList.toggle('doc', doc); show(i); lb.scrollTop = 0; lb.classList.add('open'); $('[data-lb="close"]', lb).focus(); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lastFocus?.focus(); };
  $$('[data-gallery]').forEach((g) => {
    const imgs = $$('img', g);
    const doc = g.dataset.gallery === 'letter';
    $$('button', g).forEach((b, i) => b.addEventListener('click', () => open(imgs, i, doc)));
  });
  lb.addEventListener('click', (e) => {
    const act = e.target.closest('[data-lb]')?.dataset.lb;
    if (act === 'close' || e.target === lb) close();
    if (act === 'prev') show(idx - 1);
    if (act === 'next') show(idx + 1);
  });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // "Browser window" screen switchers (Portfolio Tracker, ZručnáPráce).
  $$('[data-shots]').forEach((win) => {
    const img = $('[data-shot-img]', win);
    const url = $('[data-url]', win);
    const tabs = $$('.tabs-strip button', win);
    tabs.forEach((b) => b.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      img.src = b.dataset.src;
      if (url) url.textContent = b.dataset.label;
    }));
  });

  // Click-to-copy e-mail (a normal click still opens the mail app).
  const toast = $('#toast');
  const say = (msg) => { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1600); };
  $$('[data-copy]').forEach((a) => a.addEventListener('click', async (e) => {
    if (!e.target.closest('.copy')) return;
    e.preventDefault();
    try { await navigator.clipboard.writeText(a.dataset.copy); say(t('js.copied')); } catch { say(a.dataset.copy); }
  }));

  /* ── Scraping Cleaner re-creation ──────────────────────────────────── */
  const cleaner = $('#sim-cleaner');
  if (cleaner) {
    const FILES = [
      { name: 'developer_a.csv', rows: 412, dups: 2 },
      { name: 'developer_b.csv', rows: 188 },
      { name: 'developer_c.csv', rows: 97, alt: 'cena' },
      { name: 'developer_d.csv', rows: 356, dups: 1 },
      { name: 'developer_e.csv', rows: 240 },
      { name: 'developer_f.csv', rows: 131, alt: 'Price' },
    ];
    const tbody = $('[data-files]', cleaner);
    const log = $('[data-log]', cleaner);
    const btn = (a) => $(`[data-act="${a}"]`, cleaner);
    let st, busy = false;

    const chip = (cls, txt) => `<span class="st ${cls}">${txt}</span>`;
    const render = () => {
      tbody.innerHTML = st.files.map((f) => {
        let s;
        if (f.fixed) s = chip('fix', t('js.cl.fixed'));
        else if (f.status.length) s = f.status.map((x) => chip('warn', x === 'dup' ? `${f.dups} × ${t('js.cl.dup')}` : t('js.cl.miss'))).join(' ');
        else if (st.dup || st.col) s = chip('ok', t('js.cl.ok'));
        else s = '<span class="st">—</span>';
        return `<tr><td>${f.name}</td><td class="num">${f.rows}</td><td>${s}</td></tr>`;
      }).join('');
    };
    const reset = () => {
      st = { files: FILES.map((f) => ({ ...f, status: [], fixed: false })), dup: false, col: false };
      log.innerHTML = t('js.cl.ready');
      btn('dup').disabled = false; btn('col').disabled = false; btn('fix').disabled = true;
      render();
    };
    const write = async (html) => { log.innerHTML += html; await wait(260); };

    const run = async (kind) => {
      if (busy) return; busy = true;
      if (kind === 'dup' || kind === 'col') {
        log.innerHTML = t(kind === 'dup' ? 'js.cl.dupLog' : 'js.cl.colLog');
        let hits = 0;
        for (const f of st.files) {
          const bad = kind === 'dup' ? f.dups : f.alt;
          if (bad && !f.fixed) {
            if (!f.status.includes(kind)) f.status.push(kind);
            hits++;
            await write(`<span class="r">✗</span> ${f.name} — ${kind === 'dup' ? `${f.dups} × ${t('js.cl.dup')}` : `${t('js.cl.miss')} (“${f.alt}”)`}\n`);
          } else await write(`<span class="g">✓</span> ${f.name}\n`);
          render();
        }
        await write(`<b>${hits} ${t('js.cl.found')}</b>`);
        st[kind] = true; btn(kind).disabled = true;
        btn('fix').disabled = !(st.dup && st.col);
      }
      if (kind === 'fix') {
        log.innerHTML = t('js.cl.fixLog');
        for (const f of st.files) {
          if (!f.status.length) continue;
          if (f.dups) { f.rows -= f.dups; await write(`<span class="g">✓</span> ${f.name} — ${t('js.cl.drop')} (${f.dups})\n`); }
          if (f.alt) await write(`<span class="g">✓</span> ${f.name} — ${t('js.cl.rename')} “${f.alt}” → “price”\n`);
          f.status = []; f.fixed = true; render();
        }
        await write(`<b>${t('js.cl.zip')}</b>`);
        btn('fix').disabled = true;
      }
      busy = false;
    };
    btn('dup').addEventListener('click', () => run('dup'));
    btn('col').addEventListener('click', () => run('col'));
    btn('fix').addEventListener('click', () => run('fix'));
    btn('reset').addEventListener('click', () => { if (!busy) reset(); });
    reset();
    langListeners.push(() => { if (!busy) reset(); });
  }

  /* ── Chart extractor re-creation ───────────────────────────────────── */
  const cx = $('#sim-charts');
  if (cx) {
    const pagesEl = $('[data-pages]', cx);
    const srcEl = $('[data-src]', cx);
    const svg = $('[data-chart]', cx);
    const cap = $('[data-cap]', cx);
    const valuesEl = $('[data-values]', cx);
    const runBtn = $('[data-run]', cx);
    const statusEl = $('[data-status]', cx);
    const CHART_PAGES = [2, 4];
    const DATA = [[2018, 5.2], [2019, 6.1], [2020, 5.8], [2021, 7.4], [2022, 8.0], [2023, 7.1]];
    const miniChart = '<svg viewBox="0 0 40 24" aria-hidden="true"><path d="M2 21 H38 M2 2 V21" stroke="currentColor" stroke-opacity=".35" fill="none"/><path d="M4 17 L11 13 L17 15 L24 8 L31 5 L37 9" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    let mode = 'pdf', busy = false;

    const lines = (n) => Array.from({ length: n }, () => '<i></i>').join('');
    const idle = () => { valuesEl.innerHTML = `<tr><td colspan="2">${t('cx.empty')}</td></tr>`; statusEl.innerHTML = ''; };
    const buildPages = () => {
      pagesEl.innerHTML = Array.from({ length: 6 }, (_, i) => {
        const body = CHART_PAGES.includes(i) ? lines(2) + miniChart + lines(2) : lines(7);
        return `<div class="cx-page" data-i="${i}">${body}<span class="score"></span></div>`;
      }).join('');
      srcEl.textContent = t(mode === 'pdf' ? 'js.cx.pdfSrc' : 'js.cx.webSrc');
      cap.textContent = '—';
      svg.innerHTML = '';
    };
    const drawChart = async () => {
      const W = 240, H = 120, p = 18;
      const xs = (i) => p + (i * (W - 2 * p)) / (DATA.length - 1);
      const ys = (v) => H - p - ((v - 4) / 5) * (H - 2 * p);
      const d = DATA.map(([, v], i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
      svg.innerHTML = `<path class="ax" d="M${p} ${H - p} H${W - p} M${p} ${p} V${H - p}"/>` +
        `<path class="ln" d="${d}"/>` + DATA.map(([, v], i) => `<circle class="pt" cx="${xs(i)}" cy="${ys(v)}" r="3"/>`).join('');
      const path = $('.ln', svg);
      if (!reduceMotion) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset .9s ease';
        path.style.strokeDashoffset = 0;
      }
      cap.textContent = t('js.cx.cap');
      valuesEl.innerHTML = '';
      for (const [y, v] of DATA) { valuesEl.insertAdjacentHTML('beforeend', `<tr><td>${y}</td><td class="num">${v.toFixed(1)}k</td></tr>`); await wait(120); }
    };
    const run = async () => {
      if (busy) return; busy = true; runBtn.disabled = true;
      buildPages();
      valuesEl.innerHTML = `<tr><td colspan="2">${t('js.cx.scan')}</td></tr>`;
      statusEl.innerHTML = '';
      for (const pg of $$('.cx-page', pagesEl)) {
        pg.classList.add('scan');
        await wait(320);
        const hit = CHART_PAGES.includes(+pg.dataset.i);
        const score = hit ? 0.94 + Math.random() * 0.05 : 0.01 + Math.random() * 0.06;
        $('.score', pg).textContent = `${t(hit ? 'js.cx.chart' : 'js.cx.text')} ${score.toFixed(2)}`;
        pg.classList.remove('scan'); pg.classList.add('done');
        if (hit) pg.classList.add('hit');
      }
      await drawChart();
      statusEl.innerHTML = `<span class="st ok">${t(mode === 'pdf' ? 'js.cx.done' : 'js.cx.webDone')}</span>`;
      busy = false; runBtn.disabled = false;
    };
    $$('.cx-modes button', cx).forEach((b) => b.addEventListener('click', () => {
      if (busy) return;
      mode = b.dataset.mode;
      $$('.cx-modes button', cx).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      buildPages(); idle();
    }));
    runBtn.addEventListener('click', run);
    buildPages();
    langListeners.push(() => { if (!busy) { buildPages(); idle(); } });
  }

  applyLang(initialLang);
})();
