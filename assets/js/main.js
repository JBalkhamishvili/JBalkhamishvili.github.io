// Theme toggle, burger, icon-first grid, starfield, year/back-to-top
const toggle = document.getElementById('themeToggle');
const root = document.body;
const key = 'pj-theme';

function setTheme(name){
  root.classList.remove('clean','pixel');
  root.classList.add(name);
  // Only touch the toggle UI if it exists on the page
  if(toggle){
    toggle.setAttribute('aria-pressed', name==='pixel' ? 'true' : 'false');
    toggle.title = name==='pixel' ? 'Switch to Clean Mode' : 'Switch to Pixel Mode';
    const label = toggle.querySelector('.label'); if(label) label.textContent = name==='pixel' ? 'Clean' : 'Pixel';
  }
  try{ localStorage.setItem(key, name); }catch(e){ /* ignore storage errors */ }
}

// Apply stored theme; default to 'clean'
setTheme(localStorage.getItem(key) || 'clean');
if(toggle) toggle.addEventListener('click', ()=> setTheme(root.classList.contains('pixel') ? 'clean' : 'pixel'));

// Burger (guarded)
const burger = document.querySelector('.burger');
const menu = document.getElementById('navmenu');
if(burger && menu){
  burger.addEventListener('click', ()=>{ const open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); });
}

// Year & back-to-top
document.getElementById('y') && (document.getElementById('y').textContent = new Date().getFullYear());
document.getElementById('toTop')?.addEventListener('click', e=>{ e.preventDefault(); scrollTo({top:0,behavior:'smooth'}); });

// Placeholder SVG (data URI, pixel grid + invader)
const placeholderSVG = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#1a1f35'/><stop offset='1' stop-color='#0f1322'/>
    </linearGradient>
  </defs>
  <rect width='128' height='128' rx='16' fill='url(#g)'/>
  <g fill='#1f2a48'>
    ${Array.from({length: 16}).map((_,i)=> `<rect x='${(i%8)*16+4}' y='${Math.floor(i/8)*16+4}' width='8' height='8'/>`).join('')}
  </g>
  <g transform='translate(40,36)' fill='#00e6ff'>
    <rect x='8' y='0' width='8' height='8'/><rect x='32' y='0' width='8' height='8'/>
    <rect x='0' y='8' width='16' height='8'/><rect x='32' y='8' width='16' height='8'/>
    <rect x='-8' y='16' width='80' height='8'/>
    <rect x='0' y='24' width='8' height='8'/><rect x='24' y='24' width='16' height='8'/><rect x='48' y='24' width='8' height='8'/>
    <rect x='0' y='32' width='8' height='8'/><rect x='48' y='32' width='8' height='8'/>
    <rect x='24' y='40' width='16' height='8'/>
  </g>
</svg>`);

function resolveLogo(src){
  if(!src) return null;
  // already absolute (http(s))
  if(/^https?:\/\//i.test(src)) return src;

  // Helper: when viewing files via file:// we need a relative path from
  // the current document to the project root (assets live at the repo root).
  // For simple project layout this handles pages in `/pages/` by prefixing
  // one `../` when opened locally. When served over HTTP(S) we keep
  // root-relative paths (leading slash) so GitHub Pages and similar hosts work.
  function assetsPath(path){
    if(location.protocol === 'file:'){
      const rel = location.pathname.includes('/pages/') ? '../' : '';
      return rel + path.replace(/^\//, '');
    }
    return path;
  }

  // root-relative input (explicit) -> convert to assets-aware path
  if(src.startsWith('/')) return assetsPath(src);

  // short name without extension -> use .svg in logos folder
  if(!src.includes('.')) return assetsPath(`/assets/img/logos/${src}.svg`);

  // filename with extension but not root-relative -> prefix logos folder
  return assetsPath(`/assets/img/logos/${src}`);
}

// Detect when a logo value is raw HTML (for example an <i> icon or inline SVG)
function isHtmlLogo(value){
  return typeof value === 'string' && value.trim().startsWith('<');
}

// Return an HTML fragment to place inside the .logo-slot. If the provided
// value is raw HTML we return it directly (useful for <i class="fa-...">).
// Otherwise resolveLogo() is used to obtain an image src and an <img> tag
// is returned. The `alt` argument is used for accessible <img> alternatives.
function renderLogoFragment(logoValue, alt){
  if(isHtmlLogo(logoValue)){
    // When injecting raw HTML we mark it as presentational; the surrounding
    // element can still provide accessible text if needed.
    return `${logoValue}`;
  }
  const resolved = resolveLogo(logoValue);
  const logoSrc = resolved ? resolved : `data:image/svg+xml,${placeholderSVG}`;
  const logoAlt = alt ? alt : '';
  return `<img alt="${logoAlt}" src="${logoSrc}">`;
}

// Companies + projects mapping (taken from the older index layout).
const companies = [
  {
    slug: 'freelancer',
    name: 'Freelance & Personal Projects',
    blurb: 'Freelance & Personal Projects since Nov 2020',
    href: 'pages/company-freelancer.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/freelancer_logo.webp',
    projects: [
      { title: 'PixelTCG — Pokémon TCG Store', href: 'pages/case-pixeltcg.html'},
      { title: 'Eka Peradze Art', href: 'pages/project-eka.html' },
      { title: 'Eka Peradze Art — Second Shop', href: 'pages/project-eka2.html' },
      { title: 'Burkhart', href: 'pages/project-burkhart.html' },
      { title: 'Novo Peak', href: 'pages/project-novo.html' },
      { title: 'Handchirurgie Abel', href: 'pages/project-abel.html' },
      { title: 'Hoffmann', href: 'pages/project-hoffmann.html' },
      { title: 'Valuniq', href: 'pages/project-valuniq.html' }
    ]
  },
  {
    slug: 'monobunt',
    name: 'MONOBUNT Digitalagentur',
    blurb: 'Agency work — WordPress & Freshworks apps (2023–present)',
    href: 'pages/company-monobunt.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/monobunt-logo.webp',
    projects: [
      { title: 'Hagan Ski', href: 'pages/project-hagan.html' },
      { title: 'Vereinsmeister', href: 'https://www.vereinsmeister.com/' },
      { title: 'Apofit', href: 'https://www.apofit.at/' },
      { title: 'Test', href: 'jaba.test' }
    ]
  },
  {
    slug: 'tipalti',
    name: 'Tipalti',
    blurb: 'Full-Stack Web Developer (2023 – 2025).',
    href: 'pages/company-tipalti.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/tipalti_logo_white.webp',
    projects: [
      {
        title: 'Tipalti (Website)',
        href: 'https://tipalti.com/',
        blurb:
            'Core contributor on the v4→v5 redesign of tipalti.com. Built custom Gutenberg blocks, plugins and shortcodes, implemented Canada/Germany localizations, and occasionally drove releases. Focus areas: performance, accessibility, and maintainable WordPress architecture.',
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/tipalti_logo_white.webp'
      },
      {
        title: 'MATRIX — Headless WordPress',
        href: 'https://tipalti.com/',
        blurb:
            'Designed and built a headless WordPress platform for content teams (Marketing Tools, Resources & Intelligent Extensions). Centralized creation of comparison tables, carousels and client logos, and exposed them via API to the main site. Added a site-wide indexed search to quickly locate pages/posts by content, reducing duplicate work.',
        logo: '<i class="fa-brands fa-wordpress"></i>',
        showCta: false
      },
      {
        title: 'QA & Release Workflow — Playwright',
        blurb:
            'Introduced an automated QA workflow with Playwright to support weekly releases. Set up stable E2E/regression suites plus a lightweight manual checklist for edge cases. Integrated into CI to flag regressions early and reduce rollback risk.',
        showCta: false,
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/playwright-1.webp'
      }
    ]

  },
  {
    slug: 'flatrock',
    name: 'Flatrock Technology',
    blurb: 'Working on several Projects over the years as a Backend Developer  2021–2023 (Laravel, WordPress)',
    href: 'pages/company-flatrock.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/flatrock-logo.webp',
    projects: [
      {
        title: 'Marshal (Laravel + Vue)',
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/laravel_vue.webp',
        blurb:
            'HR web platform (LinkedIn-style) built with Laravel and Vue. Implemented reusable UI components, REST endpoints, and robust form validation. Collaborated on auth, profiles, and content workflows.',
        showCta: false
      },
      {
        title: 'Brompton Bikes (Magento)',
        href: 'https://www.brompton.com/',
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/Brompton_Logo_Triptych_Stacked_White_Screen.webp',
        blurb:
            'Part of the Magento backend team. Contributed to catalog and order flows, third-party integrations, and performance/stability fixes for production releases.'
      },
      {
        title: 'Inventory Tool (Laravel/Orchid)',
        showCta: false,
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/Laravel.svg_-1.webp',
        blurb:
            'Internal asset management system built on Laravel + Orchid. Served as Tech Lead: domain modeling, RBAC, dashboards, and CRUD workflows for company hardware/software tracking.'
      },
      {
        title: 'Purify Digital (WordPress)',
        href: 'https://www.purifydigital.com/',
        // REPLACE with a real logo URL hosted on your server:
        logo: 'purify',
        blurb:
            'Tech Lead for a WordPress marketing site. Delivered a custom theme with block-based templates, performance tuning, and clean editorial workflows.'
      },
      {
        title: 'Flat Rock Outsourcing (WordPress)',
        href: 'https://flatrockoutsourcing.com/',
        // REPLACE with a real logo URL hosted on your server:
        logo: 'flatsourcing',
        blurb:
            'Led WordPress development for the corporate site. Built Gutenberg components, streamlined page building, and improved lighthouse/performance scores.'
      },
      {
        title: 'Maison Chase (WordPress)',
        href: 'https://maisonchase.co.uk/',
        // REPLACE with a real logo URL; avoid <i> tags:
        logo: '<i class="fa-brands fa-wordpress"></i>',
        blurb:
            'Backend development on a custom WordPress build (theme + plugins). Implemented content types and admin tooling; the project was later discontinued by the client.',
        showCta: false
      },
      {
        title: 'GPT Tips (WordPress)',
        href: 'https://gpt-tips.ai/',
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/gpt-tips.webp',
        blurb:
            'Backend work for a content site. Added custom post types, metadata/SEO structures, and publisher-friendly editor features.'
      },
      {
        title: 'App Tipps (WordPress)',
        href: 'https://app-tipps.com/',
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/app-tipps-logo-domain.webp',
        blurb:
            'WordPress backend development for an app-review site. Delivered data models, editorial flows, and structured data to support search visibility.'
      }
    ]
  },
  {
    slug: 'subtel',
    name: 'Subtel GmbH',
    blurb: 'Working on the subtel Online Shop based on OXID eShop - (2019–2020)',
    href: 'pages/company-subtel.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/subtel-logo.webp',
    projects: [
      {
        title: 'subtel.de (OXID eShop)',
        href: 'https://www.subtel.de/',
        // Replace with your hosted logo or remove this line
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/subtel-logo.png',
        blurb:
            'E-commerce platform for batteries & accessories. Worked on OXID eShop (PHP/MySQL) backend & frontend—catalog/checkout features, marketplace integrations (Amazon/eBay/Google), and performance/stability fixes.'
      },
      {
        title: 'Internal Product Tool (JavaScript)',
        blurb:
            'Internal tool for product management and data processing built in JavaScript. Automated imports/cleaning, bulk updates, and CSV/JSON exports—reducing manual work and errors.',
        showCta: false,
        // Optional placeholder; swap for your own or remove
        logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/JavaScript-logo.webp'
      }
    ]
  }
];

// Render company cards into `companyGrid`.
const companyGrid = document.getElementById('companyGrid');
if(companyGrid){
  companyGrid.innerHTML = companies.map(c=>{
    const logoAlt = c.logo ? `${c.name} logo` : '';
    const logoInner = renderLogoFragment(c.logo, logoAlt);
    return `
    <article class="card" data-href="${c.href}" tabindex="0">
      <div class="logo-slot">${logoInner}</div>
      <h3>${c.name}</h3>
      <p>${c.blurb}</p>
      <div class="actions"><a class="btn" href="${c.href}">Learn More</a></div>
    </article>
    `;
  }).join('');
}

// Render project cards on company pages and support per-project logos (resolved via resolveLogo)
(function renderCompanyProjects(){
  try{
    const m = location.pathname.match(/company-([a-z0-9-]+)\.html$/i);
    if(!m) return;
    const slug = m[1];
    const company = companies.find(c => c.slug === slug);
    if(!company) return;
    const grid = document.querySelector('main .section .grid') || document.querySelector('.grid');
    if(!grid) return;
    grid.innerHTML = company.projects.map(p => {
      const logoAlt = p.logo ? `${p.title} logo` : '';
      const logoInner = renderLogoFragment(p.logo, logoAlt);
      const href = p.href || '#';
      const external = /^https?:\/\//i.test(href);
      const target = external ? ' target="_blank" rel="noopener"' : '';
    const blurb = p.blurb ? `<p>${p.blurb}</p>` : '';
    // showCta: optional boolean flag on project entries. Default true.
    const showCta = p.showCta === undefined ? true : Boolean(p.showCta);
    const cta = p.cta ? p.cta : (external ? 'Visit site' : 'Details');
    const actions = showCta ? `<div class="actions"><a class="btn" href="${href}"${target}>${cta}</a></div>` : '';
  return `\n        <article class="card" data-href="${href}" tabindex="0">\n          <div class="logo-slot">${logoInner}</div>\n          <h3>${p.title}</h3>\n          ${blurb}\n          ${actions}\n        </article>\n      `;
    }).join('');
  }catch(e){ /* don't break the page if rendering fails */ }
})();

// Starfield (Pixel mode only) — only initialise when the canvas exists
const canvas = document.getElementById('stars');
let ctx = null;
if(canvas){
  ctx = canvas.getContext('2d');
  function size(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  function loop(){
    if(!document.body.classList.contains('pixel')){ ctx.clearRect(0,0,canvas.width,canvas.height); requestAnimationFrame(loop); return; }
    const w = canvas.width, h = canvas.height; ctx.clearRect(0,0,w,h);
    for(let i=0;i<Math.min(220, Math.floor(w/8)); i++){
      const x=(Math.random()*w)|0, y=(Math.random()*h)|0, r=Math.random()*1.5+.2, a=Math.random()*.7+.2;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = `rgba(180,220,255,${a})`; ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(0,230,255,.6)'; ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  addEventListener('resize', size); size(); loop();
}

// Make whole cards clickable: delegated handlers that navigate when a user
// clicks or presses Enter/Space on a focused card. Inner links/buttons are
// ignored so their default behaviour is preserved.
document.addEventListener('click', function(e){
  // only left-click
  if(e.button && e.button !== 0) return;
  const card = e.target.closest('.card');
  if(!card) return;
  // if user clicked a real control inside the card, don't hijack it
  if(e.target.closest('a, button, input, textarea, select')) return;
  const href = card.dataset.href;
  if(!href || href === '#') return;
  // respect modifier keys to open in new tab/window
  if(e.metaKey || e.ctrlKey){ window.open(href, '_blank', 'noopener'); return; }
  // external URLs open in new tab, internal navigate in same tab
  if(/^https?:\/\//i.test(href)) window.open(href, '_blank', 'noopener'); else location.href = href;
});

document.addEventListener('keydown', function(e){
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const active = document.activeElement;
  if(!active || !active.classList.contains('card')) return;
  // space should not scroll the page when used to activate the card
  if(e.key === ' ') e.preventDefault();
  const href = active.dataset.href;
  if(!href || href === '#') return;
  if(/^https?:\/\//i.test(href)) window.open(href, '_blank', 'noopener'); else location.href = href;
});
