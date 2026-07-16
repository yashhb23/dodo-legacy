import React, { useEffect, useRef } from "react";
import { X, Share2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * MilestoneModal — the full-detail "dopamine" view for a single milestone.
 *
 * Opened by clicking a card in the stack. It springs in (scale + rise), reveals
 * the full photograph, the big year, the title and the complete description, and
 * lets the visitor step through the timeline with arrows or the keyboard. A Share
 * button hands off to the existing ShareDialog.
 *
 * Focus handling mirrors ShareDialog's fixed pattern on purpose: the effect
 * depends ONLY on `open`, and reads onClose/onPrev/onNext through refs, so it
 * never re-runs every render. That is what prevents the focus-restore ->
 * card.onFocus -> setState infinite loop that previously crashed the page.
 */
export default function MilestoneModal({
  milestone,
  total,
  index,
  onClose,
  onShare,
  onPrev,
  onNext,
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const prevFocusRef = useRef(null);

  // Latest callbacks held in refs so the effect below can depend on `open` only.
  const cbRef = useRef({ onClose, onPrev, onNext });
  cbRef.current = { onClose, onPrev, onNext };

  const open = !!milestone;

  useEffect(() => {
    if (!open) return undefined;
    prevFocusRef.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") cbRef.current.onClose?.();
      else if (e.key === "ArrowLeft") cbRef.current.onPrev?.();
      else if (e.key === "ArrowRight") cbRef.current.onNext?.();
      else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      const prev = prevFocusRef.current;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open]);

  if (!open) return null;

  const year = milestone.date;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`${milestone.title}, ${year}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 bg-[#0c0710] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 flex flex-col md:flex-row"
      >
        {/* Photograph: springs up with a gentle scale settle. key forces the
            reveal to replay each time the milestone changes. */}
        <div className="relative md:w-1/2 h-56 sm:h-72 md:h-auto md:min-h-[460px] shrink-0 overflow-hidden">
          <img
            key={milestone.id}
            src={milestone.image}
            alt={milestone.title}
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700 ease-out select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0710] via-transparent to-transparent md:bg-gradient-to-l" />
          <span className="absolute bottom-3 left-4 text-sm font-bold tracking-widest text-white/90 drop-shadow">
            {year}
          </span>
        </div>

        {/* Info side. The whole column scrolls (overflow-y-auto + min-h-0) so on
            short phones the year, title, full description AND the share button
            stay reachable inside the 90vh cap. Extra mobile bottom padding keeps
            the share button clear of the bottom prev/next steppers. */}
        <div className="md:w-1/2 p-6 pb-20 md:p-8 flex flex-col min-h-0 overflow-y-auto">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-2">
            Milestone {index + 1} of {total}
          </p>
          <p className="text-5xl md:text-7xl font-serif font-black text-white/90 leading-none mb-3">
            {year}
          </p>
          <h2
            key={milestone.id}
            className="text-2xl md:text-3xl font-serif italic text-white mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {milestone.title}
          </h2>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
            {milestone.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share this moment
            </button>
          </div>
        </div>

        {/* Prev / next. On mobile these sit at the vertical centre of the photo
            (top band) rather than at the modal's bottom edge, where they used to
            collide with the phone browser's own bottom toolbar. On desktop they
            stay centred on the tall side image. */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous milestone"
          className="absolute left-2 top-28 sm:top-36 md:top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur-sm text-white hover:bg-black/80 shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next milestone"
          className="absolute right-2 top-28 sm:top-36 md:top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur-sm text-white hover:bg-black/80 shadow-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-11 w-11 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
