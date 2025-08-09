// Theme handling
(function () {
  const storageKey = "theme-preference";
  const getPreference = () => localStorage.getItem(storageKey) || "auto";
  const applyTheme = (value) => {
    document.documentElement.setAttribute("data-theme", value === "auto" ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value);
  };
  applyTheme(getPreference());
  const btn = document.getElementById("themeToggle");
  const brand = document.querySelector('.brand');
  function cycleTheme() {
    const current = getPreference();
    const next = current === "dark" ? "light" : current === "light" ? "dark" : "light";
    localStorage.setItem(storageKey, next);
    applyTheme(next);
    if (btn) btn.title = `Theme: ${next}`;
  }
  if (btn) btn.addEventListener("click", cycleTheme);
  // Also toggle theme when clicking the brand (logo)
  if (brand) brand.addEventListener('click', (e) => {
    // If user intended to navigate to #home, we still allow but toggle theme too
    cycleTheme();
  });
  // Respect system changes if in auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getPreference() === 'auto') applyTheme('auto');
  });
})();

// Mobile nav toggle
document.getElementById('navToggle')?.addEventListener('click', () => {
  const menu = document.getElementById('navMenu');
  const btn = document.getElementById('navToggle');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  const expanded = menu.classList.contains('open');
  btn.setAttribute('aria-expanded', String(expanded));
  document.body.classList.toggle('menu-open', expanded);
});

// Smooth anchor close on mobile
document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => {
  document.getElementById('navMenu')?.classList.remove('open');
  document.getElementById('navToggle')?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

// Header shrink on scroll
const header = document.getElementById('siteHeader');
if (header) {
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle('shrink', y > 24);
    lastY = y;
  });
}

// Reveal on scroll
const revealables = document.querySelectorAll('.reveal');
if (revealables.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const delay = Number(el.getAttribute('data-reveal-delay') || 0);
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('revealed'), delay);
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  revealables.forEach((el) => io.observe(el));
}

// Scrollspy for nav links
const sections = Array.from(document.querySelectorAll('main section[id]'));
const links = Array.from(document.querySelectorAll('.nav__menu a[href^="#"]'));
if (sections.length && links.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.getAttribute('id');
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    });
  }, { root: null, threshold: 0.5 });
  sections.forEach(s => spy.observe(s));
}

// Progress bar
const progress = document.getElementById('progressbar');
if (progress) {
  const update = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = `${percent}%`;
  };
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Save as PDF
document.getElementById('btnSavePdf')?.addEventListener('click', () => { window.print(); });
// No separate download button; hero shows resume info


