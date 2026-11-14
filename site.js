/*
 * streetdrill.app, every page (loaded with defer). The pages' Content-Security-Policy allows scripts from this
 * site only, so page code lives in files like this one, never inline. Every page works without it: the menu,
 * the app tour's tabs and the game filters are plain HTML and CSS.
 */

// Footer year: the pages say 2026; show the current year without editing every page each January.
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// iPhone and iPad (an iPad says it's a Mac, with a touch screen): styles.css reads data-os to offer the
// get-notified email in the bottom bar instead of Google Play.
if (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
  document.documentElement.dataset.os = 'ios';
}

// Phone menu (<details class="menu"> in the top bar, shown under 900px): close it after a link is chosen,
// on a tap outside it, or on Escape.
document.querySelectorAll('details.menu').forEach(menu => {
  menu.addEventListener('click', e => { if (e.target.closest('a')) menu.open = false; });
  document.addEventListener('click', e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
});

// The bar at the bottom of a phone's screen (.dock, under 900px): there whenever none of the page's own
// store buttons (data-cta) is on screen, so the way to get the app is always one tap away, never two at once.
// It starts inert, and stays that way while it's off screen, so the keyboard can't reach a hidden link.
const dock = document.querySelector('.dock');
if (dock && 'IntersectionObserver' in window) {
  const onScreen = new Set();
  const watcher = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) onScreen.add(entry.target); else onScreen.delete(entry.target); });
    const show = onScreen.size === 0;
    dock.classList.toggle('on', show);
    dock.inert = !show;
  });
  document.querySelectorAll('[data-cta]').forEach(el => watcher.observe(el));
}
