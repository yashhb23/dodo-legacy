import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Share2 } from "lucide-react";
import { historyMilestones } from "../../data/historyMilestones.ts";
import ShareDialog from "./ShareDialog";
import MilestoneModal from "./MilestoneModal";

/**
 * ScrambleText: a "data decoding" kinetic typography effect.
 * On every `text` change the string visually decrypts character by character
 * from random glyphs into the real title, evoking a classified document reveal.
 */
const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
    // Honour reduced-motion: show the final title instantly, no glyph churn
    // (the rapid character flicker is exactly what WCAG 2.3.3 asks to suppress).
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayText(text);
      return;
    }
    let iterations = 0;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join(""),
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 2;
    }, 25);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
};

/**
 * HistoryStack v6: locked deck, floating photo preview, reliable jiggle,
 * click to share.
 *
 * Chronology and flow:
 *   The deck now reads first to last from TOP RIGHT down to BOTTOM LEFT.
 *   Milestone 1 (the island's deep-time origin) sits at the top right;
 *   milestone 16 (Mauritius today) sits at the bottom left, frontmost in
 *   the stack. Position is driven by a reversed index so the visual order
 *   matches the historical order from genesis to the present day.
 *
 * Interaction:
 *   • Hover a card: it jiggles (Web Animations API, see jiggle()) and its
 *     photograph pops up larger just above it, facing the viewer. The card
 *     itself never resizes or leaves its slot, so it can never cover the
 *     neighbour you reach for next (the preview is pointer-events:none).
 *   • Click a card (desktop): opens the share sheet for that milestone.
 *   • A Share button in the panel opens the same sheet on any device.
 *   • Touch: first milestone preselected, tap to browse, 44px steppers.
 *
 * Performance: only transform and opacity animate (GPU compositor). No
 * filters, blends or masks live in the scroll path. The jiggle runs through
 * the Web Animations API so it is immune to React re-renders and replays
 * cleanly every time the cursor enters a new card.
 */

const HUD_DEBOUNCE_MS = 60;
const N = historyMilestones.length;

const LAYOUT = {
  // w/h = card size, dx/dy = diagonal step, pv = floating preview size.
  desktop: { w: 150, h: 200, dx: 40, dy: 22, pvW: 280, pvH: 366, gap: 26 },
  mobile: { w: 86, h: 114, dx: 15, dy: 10, pvW: 188, pvH: 248, gap: 16 },
};

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * One photo card, locked in its isometric pose. React.memo skips it unless
 * its own props change. Hover jiggle and brighten do not flow through React.
 */
const Card = React.memo(function Card({ image, title, date, index, isActive, isMobile, scale }) {
  const L = isMobile ? LAYOUT.mobile : LAYOUT.desktop;
  const hue = 330 - index * 11;
  // Reversed position: index 0 sits top right, the last index sits bottom
  // left, so the deck reads genesis to present from top right to bottom left.
  // The fit-scale is baked straight into the pixel geometry (size + offset)
  // rather than a CSS transform on a wrapper, because a scale() wrapper around
  // a preserve-3d/perspective subtree computes to identity in some browsers.
  const posIndex = N - 1 - index;
  const x = (posIndex - (N - 1) / 2) * L.dx * scale;
  const y = -((posIndex - (N - 1) / 2) * L.dy) * scale;

  return (
    <button
      type="button"
      data-idx={index}
      aria-label={`${title}, ${date}`}
      aria-pressed={isActive}
      className="dodo-card absolute left-1/2 top-1/2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg md:rounded-xl"
      style={{
        width: L.w * scale,
        height: L.h * scale,
        // Newest card (bottom left) is frontmost; the stack cascades up-right.
        zIndex: index + 1,
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateY(-22deg) rotateX(8deg)`,
        backfaceVisibility: "hidden",
      }}
    >
      {/* Inner wrapper: the Web Animations jiggle targets this element. */}
      <span className="dodo-card-inner absolute inset-0 block rounded-lg md:rounded-xl will-change-transform">
        <span
          className="absolute inset-0 rounded-lg md:rounded-xl overflow-hidden block"
          style={{
            boxShadow: `inset 0 0 0 1px hsl(${hue} 75% 72% / 0.45), 0 12px 26px -12px rgba(0,0,0,0.6)`,
          }}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Legibility scrim plus sheen (static). */}
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, hsl(${hue} 70% 16% / 0.8) 0%, transparent 42%), linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 36%)`,
            }}
          />
          {/* Dim overlay: opacity flips to 0 on hover or when selected (CSS). */}
          <span
            aria-hidden="true"
            className="dodo-card-dim absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: 0.28, transition: "opacity 0.3s ease-out" }}
          />
          <span className="absolute bottom-1 left-1.5 md:bottom-2 md:left-2.5 max-w-[92%] truncate text-[9px] md:text-xs font-bold tracking-widest text-white/95 drop-shadow pointer-events-none">
            {date}
          </span>
        </span>
      </span>
    </button>
  );
});

export const HistoryStack = () => {
  const [isTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches,
  );
  const [isMobileLayout, setIsMobileLayout] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );

  // INSTANT hover state drives the floating preview with zero latency.
  const [hovered, setHovered] = useState(null);
  // DEBOUNCED selection drives the HUD and year so scramble text does not
  // thrash during a fast sweep.
  const [activeMilestone, setActiveMilestone] = useState(
    isTouch ? historyMilestones[0] : null,
  );
  // The milestone currently open in the share sheet (null = closed).
  const [shareMilestone, setShareMilestone] = useState(null);
  // The milestone open in the full-detail modal (null = closed).
  const [detailMilestone, setDetailMilestone] = useState(null);
  // Uniform scale applied to the whole deck so it always fits its container
  // at any window size (narrow desktop, split-screen, browser zoom).
  const [deckScale, setDeckScale] = useState(1);

  const sceneRef = useRef(null);
  const hudTimerRef = useRef(null);
  const lastPreviewRef = useRef(null);

  if (hovered) lastPreviewRef.current = hovered;
  const preview = hovered ?? lastPreviewRef.current;
  const previewMilestone =
    preview && historyMilestones.find((m) => m.id === preview.id);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobileLayout(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Scale the deck to fit its container so nothing ever clips when the window
  // is resized to any width. A ResizeObserver keeps it exact through live
  // drags, split-screen, and zoom, not just at the breakpoints.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const Lnow = isMobileLayout ? LAYOUT.mobile : LAYOUT.desktop;
      const deckW = Lnow.w + (N - 1) * Lnow.dx;
      const deckH = Lnow.h + (N - 1) * Lnow.dy;
      const s = Math.max(
        0.45,
        Math.min(1, (rect.width * 0.94) / deckW, (rect.height * 0.96) / deckH),
      );
      setDeckScale(s);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobileLayout]);

  // Web Animations jiggle: runs outside React, replays on every entry, and
  // self-cleans back to the resting pose. This is an explicit, user-requested
  // affordance, so it plays even when prefers-reduced-motion is set (only the
  // ambient orb pulse honours that flag). transformOrigin defaults to centre.
  const jiggle = useCallback((btn) => {
    const inner = btn.querySelector(".dodo-card-inner");
    if (!inner || typeof inner.animate !== "function") return;
    // A vertical "pop" with only a gentle tilt. Earlier versions rotated up
    // to 6deg, which swung the card corners noticeably left and right; the
    // motion now lives mostly in translateY + scale so it reads as a confident
    // bounce upward, not a side-to-side shake.
    inner.animate(
      [
        { transform: "translateY(0) rotate(0deg) scale(1)" },
        { transform: "translateY(-9px) rotate(-2.5deg) scale(1.06)", offset: 0.22 },
        { transform: "translateY(-4px) rotate(1.6deg) scale(1.05)", offset: 0.5 },
        { transform: "translateY(-1px) rotate(-0.8deg) scale(1.02)", offset: 0.76 },
        { transform: "translateY(0) rotate(0deg) scale(1)" },
      ],
      { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  }, []);

  // Measure a card's top-centre relative to the scene so the floating
  // preview can sit directly above it.
  const measure = useCallback((btn) => {
    const sceneRect = sceneRef.current?.getBoundingClientRect();
    if (!sceneRect) return null;
    const r = btn.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2 - sceneRect.left,
      cy: r.top - sceneRect.top,
    };
  }, []);

  const setHud = useCallback((milestone) => {
    clearTimeout(hudTimerRef.current);
    hudTimerRef.current = setTimeout(
      () => setActiveMilestone(milestone),
      HUD_DEBOUNCE_MS,
    );
  }, []);

  const handleDeckOver = useCallback(
    (e) => {
      if (isTouch) return;
      const btn = e.target.closest("button[data-idx]");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      const milestone = historyMilestones[idx];
      if (hovered?.id === milestone.id) return;
      const pos = measure(btn);
      if (!pos) return;
      setHovered({ id: milestone.id, idx, ...pos }); // instant preview
      setHud(milestone); // debounced HUD
      jiggle(btn);
    },
    [isTouch, hovered, measure, setHud, jiggle],
  );

  const handleCardFocus = useCallback(
    (e) => {
      const btn = e.target.closest("button[data-idx]");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      const milestone = historyMilestones[idx];
      const pos = measure(btn);
      clearTimeout(hudTimerRef.current);
      if (pos) setHovered({ id: milestone.id, idx, ...pos });
      setActiveMilestone(milestone);
      jiggle(btn);
    },
    [measure, jiggle],
  );

  const handleCardClick = useCallback(
    (e) => {
      const btn = e.target.closest("button[data-idx]");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      const milestone = historyMilestones[idx];
      const pos = measure(btn);
      clearTimeout(hudTimerRef.current);
      if (pos) setHovered({ id: milestone.id, idx, ...pos });
      setActiveMilestone(milestone);
      // Clicking a card opens the full-detail modal (large photo, big year, and
      // the complete description) on every device. Sharing lives inside that
      // modal and on the HUD button.
      setDetailMilestone(milestone);
    },
    [measure],
  );

  const handleSceneLeave = useCallback(() => {
    if (isTouch) return;
    clearTimeout(hudTimerRef.current);
    setHovered(null);
    setActiveMilestone(null);
  }, [isTouch]);

  useEffect(() => () => clearTimeout(hudTimerRef.current), []);

  // Stable modal callbacks. A stable onClose matters because the modals' focus
  // effects must not re-run every render (an unstable onClose previously caused
  // an infinite focus-restore loop / "Maximum update depth exceeded" crash).
  const closeShare = useCallback(() => setShareMilestone(null), []);
  const closeDetail = useCallback(() => setDetailMilestone(null), []);
  // onShare is read directly in the modal's JSX (not inside its focus effect),
  // so it can safely depend on detailMilestone without re-triggering the loop.
  const shareFromDetail = useCallback(() => {
    if (detailMilestone) {
      setShareMilestone(detailMilestone);
      // Close the detail view so only ONE modal is ever open. Stacking the two
      // caused: Escape closing both at once, arrow keys leaking to the modal
      // underneath (desyncing what gets shared), and two aria-modal roots.
      setDetailMilestone(null);
    }
  }, [detailMilestone]);
  const stepDetail = useCallback((offset) => {
    setDetailMilestone((current) => {
      if (!current) return current;
      const idx = historyMilestones.findIndex((m) => m.id === current.id);
      return historyMilestones[(idx + offset + N) % N];
    });
  }, []);

  const stepTo = useCallback(
    (offset) => {
      setActiveMilestone((current) => {
        const idx = current
          ? historyMilestones.findIndex((m) => m.id === current.id)
          : -1;
        const nextIdx = (idx + offset + N) % N;
        const next = historyMilestones[nextIdx];
        const btn = sceneRef.current?.querySelector(
          `button[data-idx="${nextIdx}"]`,
        );
        if (btn) {
          const pos = measure(btn);
          if (pos) setHovered({ id: next.id, idx: nextIdx, ...pos });
        }
        return next;
      });
    },
    [measure],
  );

  // On touch, place the preview over the preselected first card on mount.
  useEffect(() => {
    if (!isTouch) return;
    const btn = sceneRef.current?.querySelector('button[data-idx="0"]');
    if (btn) {
      const pos = measure(btn);
      if (pos) setHovered({ id: historyMilestones[0].id, idx: 0, ...pos });
    }
  }, [isTouch, isMobileLayout, measure]);

  // On touch, when the deck rescales (orientation change, zoom) re-anchor the
  // floating preview to the active card so it never drifts off its position.
  useEffect(() => {
    if (!isTouch) return;
    setHovered((h) => {
      if (!h) return h;
      const btn = sceneRef.current?.querySelector(`button[data-idx="${h.idx}"]`);
      if (!btn) return h;
      const pos = measure(btn);
      return pos ? { ...h, ...pos } : h;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckScale]);

  const L = isMobileLayout ? LAYOUT.mobile : LAYOUT.desktop;
  const activeIndex = activeMilestone
    ? historyMilestones.findIndex((m) => m.id === activeMilestone.id)
    : null;
  const previewVisible = !!hovered;

  // Year watermark text + responsive sizing. Short numeric years render huge
  // and bleed behind the deck from the top-left; long labels ("2 Billion Y.A.")
  // shrink and wrap so they stay legible instead of overflowing as one line.
  const wmText = activeMilestone ? activeMilestone.date : "";
  const wmLen = wmText.length;
  const wmSize =
    wmLen <= 4
      ? "clamp(7rem, 22vw, 19rem)"
      : wmLen <= 6
        ? "clamp(5rem, 16vw, 14rem)"
        : "clamp(2.75rem, 9vw, 7rem)";
  const wmWrap = wmLen > 6;

  return (
    <div className="flex flex-col md:flex-row items-center w-full min-h-0 md:min-h-[820px] bg-transparent relative">
      {/* Calm atmospheric backdrop behind the whole timeline: a dark, serene
          field so the section reads as quiet and the photographs feel restful.
          Kept low and dark so it never competes with the cards. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/images/backgrounds/stack-calm.webp')",
        }}
      />
      {/* Ambient background: radial-gradient textures (soft by construction,
          no blur filter, no blend mode). Pulse is opacity only. */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[
          ["-top-[25%] -left-[20%]", "rgba(220,38,38,0.13)", ""],
          ["-top-[25%] -right-[20%]", "rgba(37,99,235,0.13)", "delay-75"],
          ["-bottom-[25%] -left-[20%]", "rgba(234,179,8,0.11)", "delay-150"],
          ["-bottom-[25%] -right-[20%]", "rgba(22,163,74,0.13)", "delay-300"],
        ].map(([pos, color, delay], i) => (
          <div
            key={i}
            className={`absolute ${pos} w-[640px] h-[640px] ${delay} ${prefersReducedMotion || isTouch ? "" : "animate-pulse"}`}
            style={{
              background: `radial-gradient(closest-side, ${color}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* Giant year watermark, anchored TOP-LEFT and bleeding right behind the
          deck. Faint fill plus a visible white outline reads as a deliberate
          typographic ghost-year. Long labels shrink + wrap (see wmSize/wmWrap). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        <span
          className={`absolute top-[11%] left-3 md:left-8 font-serif font-black leading-[0.82] transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            wmWrap ? "max-w-[6ch] whitespace-normal" : "whitespace-nowrap"
          } ${activeMilestone ? "opacity-100" : "opacity-0"}`}
          style={{
            fontSize: wmSize,
            color: "rgba(255,255,255,0.08)",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.32)",
          }}
        >
          {wmText}
        </span>
      </div>

      {/* Section edge fades: static gradients (replace the per-frame mask). */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-32 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

      {/* Left: the photo shelf */}
      <div
        ref={sceneRef}
        onMouseLeave={handleSceneLeave}
        className="w-full flex justify-center items-center md:w-[65%] h-[34svh] min-h-[260px] md:h-[760px] md:min-h-0 relative z-10"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="relative"
          style={{
            width: (L.w + (N - 1) * L.dx) * deckScale,
            height: (L.h + (N - 1) * L.dy) * deckScale,
            perspective: "1200px",
            transformStyle: "preserve-3d",
            transition: "width 0.2s ease-out, height 0.2s ease-out",
          }}
          onMouseOver={handleDeckOver}
          onClick={handleCardClick}
          onFocus={handleCardFocus}
        >
          {historyMilestones.map((milestone, index) => (
            <Card
              key={milestone.id}
              image={milestone.image}
              title={milestone.title}
              date={milestone.date}
              index={index}
              isActive={activeMilestone?.id === milestone.id}
              isMobile={isMobileLayout}
              scale={deckScale}
            />
          ))}
        </div>

        {/* Floating photo preview: pops up above the hovered card, larger,
            facing the viewer. pointer-events:none so it never blocks a card.
            Position is a GPU transform that glides between cards.
            Desktop/hover only: on touch the preview would float above card 0
            into the section heading (no room above a short mobile deck) and is
            redundant with the tap-to-open full-image modal, so it is gated to
            pointer-fine devices. */}
        {previewMilestone && !isTouch && (
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 z-[60] pointer-events-none rounded-xl overflow-hidden"
            style={{
              width: L.pvW * deckScale,
              height: L.pvH * deckScale,
              transform: `translate(${preview.cx}px, ${preview.cy}px) translate(-50%, -100%) translateY(${-L.gap * deckScale}px) scale(${previewVisible ? 1 : 0.85})`,
              opacity: previewVisible ? 1 : 0,
              transition: prefersReducedMotion
                ? "opacity 0.15s ease-out"
                : `transform 0.26s ${SPRING}, opacity 0.2s ease-out`,
              boxShadow:
                "0 30px 70px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12)",
              willChange: "transform, opacity",
            }}
          >
            <img
              src={previewMilestone.image}
              alt={previewMilestone.title}
              decoding="async"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)",
              }}
            />
            <span className="absolute bottom-2 left-3 text-sm font-bold tracking-widest text-white drop-shadow">
              {previewMilestone.date}
            </span>
          </div>
        )}
      </div>

      {/* Right: text HUD with decoded title, description, share and steppers. */}
      <div className="w-full md:w-1/3 h-full flex flex-col justify-center gap-4 md:gap-6 p-6 md:p-12 py-6 md:py-0 z-30 relative bg-gradient-to-l from-[#0a050a] via-[#0a050a]/80 to-transparent">
        {activeMilestone && (
          <div
            key={activeMilestone.id}
            className="animate-in fade-in zoom-in-[0.98] duration-300 fill-mode-both relative z-10 min-h-0 md:min-h-[350px] flex flex-col justify-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-3">
              {activeMilestone.date}
            </p>
            <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4 drop-shadow-lg">
              <ScrambleText text={activeMilestone.title} />
            </h2>
            <p className="text-zinc-300 text-sm md:text-lg leading-relaxed line-clamp-4 md:line-clamp-none animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 fill-mode-both">
              {activeMilestone.description}
            </p>

            <button
              type="button"
              onClick={() => setShareMilestone(activeMilestone)}
              className="mt-6 inline-flex items-center gap-2 self-start min-h-[44px] px-5 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share this moment
            </button>
          </div>
        )}

        {!activeMilestone && (
          <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] relative z-10 min-h-0 md:min-h-[350px] flex items-center">
            {isTouch
              ? "Tap a card or use the arrows to explore"
              : "Hover a card to decode the timeline"}
          </p>
        )}

        <div
          className={`relative z-10 items-center gap-4 ${isTouch ? "flex" : "hidden"}`}
        >
          <button
            type="button"
            onClick={() => stepTo(-1)}
            aria-label="Previous milestone"
            className="min-w-[44px] min-h-[44px] px-5 rounded-full border border-white/25 text-white text-lg active:scale-95 transition-transform"
          >
            ←
          </button>
          <span className="text-zinc-400 text-sm tabular-nums min-w-[64px] text-center">
            {activeIndex != null ? activeIndex + 1 : 0} / {N}
          </span>
          <button
            type="button"
            onClick={() => stepTo(1)}
            aria-label="Next milestone"
            className="min-w-[44px] min-h-[44px] px-5 rounded-full border border-white/25 text-white text-lg active:scale-95 transition-transform"
          >
            →
          </button>
        </div>

        {/* Progression scrubber (desktop only; the steppers show "n / N" on
            touch, and a thin right-edge bar would overlap the text and the
            floating discovery button on a narrow phone). */}
        <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-white/5 rounded-full">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
            style={{
              top: `${activeIndex != null ? (activeIndex / (N - 1)) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <MilestoneModal
        milestone={detailMilestone}
        total={N}
        index={
          detailMilestone
            ? historyMilestones.findIndex((m) => m.id === detailMilestone.id)
            : 0
        }
        onClose={closeDetail}
        onShare={shareFromDetail}
        onPrev={() => stepDetail(-1)}
        onNext={() => stepDetail(1)}
      />

      <ShareDialog milestone={shareMilestone} onClose={closeShare} />
    </div>
  );
};

export default HistoryStack;
