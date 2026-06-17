import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getNextFestival } from '@/data/community';

/**
 * FestivalNotice — a small, dismissible "next festival" pill.
 *
 * Purpose: keep the site feeling alive and current by always pointing to the
 * island's next celebration (name, date, year), reinforcing the pluralism
 * theme. It is fixed bottom-left so it sits opposite the DiscoveryWidget
 * (bottom-right) and never blocks scrolling or content.
 *
 * Behaviour:
 *   - Computes the next festival once on mount from the real clock.
 *   - Appears ONLY once the visitor has scrolled near the end of the page
 *     (the last ~22%), so it never shows at the top or mid-scroll. Always in
 *     the same fixed bottom-left spot.
 *   - Dismissible; the choice is remembered for the session (sessionStorage)
 *     so it does not nag on every route change.
 */
const DISMISS_KEY = 'dodo_festival_notice_dismissed';

export default function FestivalNotice() {
  const [festival, setFestival] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let isDismissed = false;
    try {
      isDismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      // ignore storage access errors
    }
    if (isDismissed) {
      setDismissed(true);
      return undefined;
    }

    // new Date() is fine in the browser; only Workflow scripts forbid it.
    setFestival(getNextFestival(new Date()));

    // Reveal only when the visitor reaches the end of the page. rAF-batched,
    // passive listener, never drives layout.
    let raf = null;
    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const reached =
          window.innerHeight + window.scrollY >
          document.documentElement.scrollHeight * 0.78;
        setVisible(reached);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!festival || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-40 max-w-[300px] transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative flex items-start gap-3 rounded-xl border border-primary/20 bg-[#0c0710]/95 backdrop-blur-sm p-3 pr-9 shadow-2xl">
        <span className="text-2xl leading-none mt-0.5" aria-hidden="true">
          {festival.icon}
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-0.5">
            Next festival
          </p>
          <p className="text-sm font-semibold text-white leading-tight">
            {festival.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {festival.period}, {festival.year}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss festival notice"
          className="absolute top-1.5 right-1.5 h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
