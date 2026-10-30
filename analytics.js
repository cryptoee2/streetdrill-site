/*
 * streetdrill.app, every page (loaded with defer, before site.js): Google Analytics 4, set up the way the
 * Lytics dashboard expects (its README, "Website setup"): a random visitor id sent as the user property
 * visitor_id, and generate_lead when someone taps a tester-access or "my city" email link.
 * The pages' Content-Security-Policy allows Google's tag from www.googletagmanager.com and its collection
 * endpoints, nothing else. Nothing is sent from local previews, or while MEASUREMENT_ID is empty.
 */

{ // a block, so nothing here becomes a page-wide global
  // GA › Admin › Data collection and modification › Data streams › streetdrill.app › Measurement ID
  const MEASUREMENT_ID = 'G-VT2T1JTXQP';

  // Email links that count as leads, by subject: "Request tester access" and "Tell us where you work".
  const LEAD_SUBJECTS = {
    'StreetDrill tester access': 'tester_access',
    'StreetDrill for my city': 'city_request',
  };

  if (MEASUREMENT_ID && /(^|\.)streetdrill\.app$/.test(location.hostname)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); }; // gtag.js reads the arguments object itself

    // Random, pseudonymous visitor id (no personal data), kept as lytics_vid; 36 chars, GA4's limit.
    const visitorId = (() => {
      const KEY = 'lytics_vid';
      const RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      let id = null;
      try { id = localStorage.getItem(KEY); } catch (e) { /* storage blocked: a new id per page */ }
      if (!id || !RE.test(id)) {
        id = typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
              return (c === 'x' ? r : (r & 3) | 8).toString(16);
            });
        try { localStorage.setItem(KEY, id); } catch (e) { /* see above */ }
      }
      return id;
    })();

    gtag('js', new Date());
    gtag('set', 'user_properties', { visitor_id: visitorId }); // before config, so the page_view carries it
    gtag('config', MEASUREMENT_ID);

    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="mailto:"]');
      if (!link) return;
      const source = LEAD_SUBJECTS[new URL(link.href).searchParams.get('subject')];
      if (source) gtag('event', 'generate_lead', { lead_source: source, currency: 'USD', value: 0 });
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(tag);
  }
}
