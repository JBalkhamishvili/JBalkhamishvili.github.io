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
    blurb: 'Backend work (2023–2025)',
    href: 'pages/company-tipalti.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/tipalti_logo_white.webp',
    projects: [
      { title: 'Tipalti (website)', href: 'https://tipalti.com/' }
    ]
  },
  {
    slug: 'flatrock',
    name: 'Flatrock Technology',
    blurb: 'Projects 2021–2023 (Laravel, WordPress)',
    href: 'pages/company-flatrock.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/flatrock-logo.webp',
    projects: [
      { title: 'Marshal', href: 'https://marshalhr.com/' , logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/flatrock-logo.webp', },
      { title: 'Brompton Bikes', href: 'https://www.brompton.com/', logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/Brompton_Logo_Triptych_Stacked_White_Screen.webp' },
      { title: 'Inventory Tool (Laravel/Orchid)', href: '#', logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/inventory.webp' },
      { title: 'Purify Digital', href: 'https://www.purifydigital.com/', logo: 'purify' },
    { title: 'Flat rock Outsourcing', href: 'https://flatrockoutsourcing.com/', logo: 'flatsourcing' },
    { title: 'Maison Chase', href: 'https://maisonchase.co.uk/', logo: '<i class="fa-brands fa-wordpress"></i>' },
      { title: 'GPT Tips', href: 'https://gpt-tips.ai/' },
      { title: 'App Tipps', href: 'https://app-tipps.com/' }
    ]
  },
  {
    slug: 'subtel',
    name: 'subtel',
    blurb: 'OXID eShop work (2019–2020)',
    href: 'pages/company-subtel.html',
    logo: 'https://pixeltcg.net/wp-content/uploads/2025/11/subtel-logo.webp',
    projects: [
      { title: 'subtel.de', href: 'https://www.subtel.de/' }
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
    <article class="card">
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
      const cta = p.cta ? p.cta : (external ? 'Visit site' : 'Details');
  return `\n        <article class="card">\n          <div class="logo-slot">${logoInner}</div>\n          <h3>${p.title}</h3>\n          ${blurb}\n          <div class="actions"><a class="btn" href="${href}"${target}>${cta}</a></div>\n        </article>\n      `;
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
