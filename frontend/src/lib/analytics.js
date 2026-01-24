/**
 * Optional client-side analytics initializers.
 *
 * - PostHog is currently injected via `public/index.html` (and may be blocked by ad blockers).
 * - Microsoft Clarity can be enabled by setting `REACT_APP_CLARITY_ID` in Vercel.
 */

export function initMicrosoftClarity() {
  const clarityId = (process.env.REACT_APP_CLARITY_ID || '').trim();
  if (!clarityId) return;

  // Avoid double-initialization.
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') return;

  // Official Clarity snippet, adapted to be environment-variable driven.
  /* eslint-disable */
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', clarityId);
  /* eslint-enable */
}

