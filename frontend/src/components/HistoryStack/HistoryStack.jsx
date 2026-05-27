import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { historyMilestones } from "../../data/historyMilestones.ts";

/**
 * ScrambleText — "data decoding" kinetic typography effect.
 * On every `text` change the string visually decrypts character-by-character
 * from random glyphs into the real title, evoking a classified-document reveal.
 * Runs entirely on a 25ms setInterval — no external motion libraries needed.
 */
const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  useEffect(() => {
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
 * HistoryStack — Cinematic 3D Timeline (Next-Gen Interactive build).
 *
 * Layout      : split-pane WebGL (left) + data HUD (right).
 * Lighting    : two organic plasma orbs (red + indigo) instead of a rigid
 *               background colour, so the section blends into the global page.
 * Interaction :
 *   • Spotlight Reveal — a radial mask on the Quadricolour overlay reveals
 *     the Mauritian flag colours only beneath the cursor, like a flashlight.
 *   • Micro-Parallax  — the Rive stack tilts up to ±5° toward the cursor on
 *     a 1000px perspective, so the artifact feels physical.
 *   • Spring-back     — `mouseleave` recentres both the spotlight and tilt.
 *
 * Performance contract (important):
 *   We DO NOT drive mouse position through React state. Re-rendering the
 *   tree on every mousemove would trash the Rive WASM canvas and burn CPU.
 *   Instead, the pointer position lives in a ref, and a single
 *   requestAnimationFrame mutates the wrapper transform + overlay
 *   maskImage directly. Zero React re-renders per mousemove.
 *
 * Active milestone is still resolved by the existing 10fps rAF poller that
 * reads Rive State Machine inputs — completely independent loop.
 */
export const HistoryStack = () => {
  const [activeMilestone, setActiveMilestone] = useState(null);

  // DOM refs for direct, render-free mutation under rAF.
  const sceneRef = useRef(null); // mouse-tracking surface (left pane)
  const riveWrapperRef = useRef(null); // carries perspective + tilt + scale
  const overlayRef = useRef(null); // Quadricolour overlay carrying mask
  const tooltipRef = useRef(null); // anchored image tooltip (CSS-positioned)
  const pointerRef = useRef({ x: 50, y: 50 }); // percentages, default centre
  const rafRef = useRef(null);

  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/history_stack.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    // Fit.Cover scales the artwork to fully fill the canvas while preserving
    // aspect ratio — visually enlarges the card stack without resorting to
    // CSS scale() (which would re-rasterise and reintroduce blur).
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    onLoad: () => console.log("RIVE FIRE: Successfully loaded!"),
    onLoadError: (e) => console.error("RIVE FATAL ERROR:", e),
  });

  /* -------- Rive State Machine polling (unchanged) -------- */
  useEffect(() => {
    if (!rive) return;

    const smName = rive.stateMachineNames.includes("State Machine 1")
      ? "State Machine 1"
      : rive.stateMachineNames[0];

    if (!smName) {
      console.error("No State Machine found in this Rive file!");
      return;
    }

    try {
      const inputs = historyMilestones.map((m) => ({
        milestone: m,
        input: rive
          .stateMachineInputs(smName)
          ?.find((i) => i.name === m.riveInput),
      }));

      let lastTime = 0;
      let animationFrameId;

      // Poll at 10fps to keep mobile CPU/battery cost negligible.
      // When cursor leaves a card and no input is active, immediately
      // null out the milestone so the tooltip retracts into the stack.
      const checkHoverState = (time) => {
        if (time - lastTime > 100) {
          const activeInput = inputs.find(
            (item) => item?.input?.value === true,
          );
          if (activeInput) {
            if (activeInput.milestone.id !== activeMilestone?.id) {
              setActiveMilestone(activeInput.milestone);
            }
          } else if (activeMilestone !== null) {
            setActiveMilestone(null);
          }
          lastTime = time;
        }
        animationFrameId = requestAnimationFrame(checkHoverState);
      };

      checkHoverState(performance.now());
      return () => cancelAnimationFrame(animationFrameId);
    } catch (err) {
      console.warn("State Machine mapping failed.", err);
    }
    // activeMilestone is intentionally omitted: re-binding inputs on every
    // milestone change would tear down the rAF loop mid-poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

  /* -------- Pointer-driven parallax + spotlight (rAF batched) -------- */

  // Single rAF tick: read pointerRef and mutate DOM — never schedules React.
  const paintFrame = useCallback(() => {
    rafRef.current = null;
    const { x, y } = pointerRef.current;

    // Map cursor offset (0..100%) → tilt range (-5°..+5°).
    // rotateY follows horizontal cursor, rotateX follows vertical.
    const tiltX = ((x - 50) / 50) * 5;
    const tiltY = ((y - 50) / 50) * 5;

    if (riveWrapperRef.current) {
      // No CSS scale(): we now grow the *layout* size of the container
      // (md:w-3/4 + md:h-[900px]) so Rive renders at native pixel
      // resolution. CSS scale upsamples a rasterised canvas → blur.
      riveWrapperRef.current.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    }

    if (overlayRef.current) {
      const mask = `radial-gradient(circle 350px at ${x}% ${y}%, black 0%, transparent 100%)`;
      overlayRef.current.style.maskImage = mask;
      overlayRef.current.style.WebkitMaskImage = mask;
    }

    // Tooltip is now CSS-anchored (top-center of the scene container).
    // No per-frame position updates needed.
  }, []);

  const scheduleFrame = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(paintFrame);
    }
  }, [paintFrame]);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      scheduleFrame();
    },
    [scheduleFrame],
  );

  const handleMouseLeave = useCallback(() => {
    pointerRef.current = { x: 50, y: 50 };
    scheduleFrame();
  }, [scheduleFrame]);

  // Cancel any pending frame on unmount to avoid orphan paints.
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row items-center w-full min-h-[100svh] md:min-h-[800px] bg-transparent relative"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* BASEMENT — 4-Corner Ambient Quadrant Orbs (Mauritian flag colours).
          TL: Red | TR: Blue | BL: Yellow | BR: Green — maps the national flag
          directly onto the scene's four corners. Each orb is pushed 30% beyond
          its corner so only the soft glow halo bleeds into the canvas.
          overflow-hidden on the wrapper clips the hard circle edge; the
          blur-[120px] corona is what remains visible.
          mix-blend-screen prevents darkening — pure additive light on the void.
          Staggered animate-pulse via delay-* gives a slow, breathing ambience. */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* TL — Red */}
        <div className="absolute -top-[30%] -left-[30%] w-[600px] h-[600px] bg-red-600/15 rounded-[100%] blur-[120px] animate-pulse mix-blend-screen" />
        {/* TR — Blue */}
        <div className="absolute -top-[30%] -right-[30%] w-[600px] h-[600px] bg-blue-600/15 rounded-[100%] blur-[120px] animate-pulse mix-blend-screen delay-75" />
        {/* BL — Yellow */}
        <div className="absolute -bottom-[30%] -left-[30%] w-[600px] h-[600px] bg-yellow-500/15 rounded-[100%] blur-[120px] animate-pulse mix-blend-screen delay-150" />
        {/* BR — Green */}
        <div className="absolute -bottom-[30%] -right-[30%] w-[600px] h-[600px] bg-green-600/15 rounded-[100%] blur-[120px] animate-pulse mix-blend-screen delay-300" />
      </div>

      {/* LEFT — WebGL Scene (mouse-tracking surface) */}
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full flex justify-center items-center md:w-[65%] md:-translate-x-12 h-[700px] md:h-[1000px] relative z-10"
        style={{
          touchAction: "pan-y",
          // Kill the visible rectangular stage with a *4-edge* feather built
          // from two crossed linear gradients composited together. A single
          // radial-gradient leaves visible flat sides on a 3:4 rectangle —
          // the intersect of two perpendicular linear masks dissolves every
          // edge identically, regardless of aspect ratio.
          maskImage:
            "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        {/* Tilting wrapper — every visual layer of the scene lives inside it
            so they tilt together as a single 3D plane. Critically, the
            wrapper carries an opaque page-matched backdrop (first child
            below) so the canvas's screen blend has something opaque to
            blend against — that's what makes the "dark square" boundary
            mathematically vanish, since the backdrop colour matches the
            page on both sides of the rectangle's edge. */}
        <div
          ref={riveWrapperRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Page-matched backdrop. Identical colour to LandingPage's
              `bg-background`, so the wrapper rectangle is invisible
              against the page. The 4-edge mask above feathers the very
              edges as defence-in-depth in case the theme token shifts. */}
          <div className="absolute inset-0 bg-background" />

          {/* Rive canvas. mix-blend-mode: screen now blends against the
              opaque backdrop + orbs combined, so:
                • black artboard pixels  → backdrop colour (invisible)
                • coloured card pixels   → lit additively over orbs
              Saturation pushed up to keep colours punchy after screen. */}
          <RiveComponent
            style={{
              width: "100%",
              height: "100%",
              mixBlendMode: "screen",
              filter: "brightness(1.2)",
            }}
          />

          {/* GPU-Accelerated Quadrant Color Map.
              A blurred 2×2 CSS Grid replaces the old flat linear-gradient.
              The stack now absorbs whichever flag colour the cursor is nearest
              to — pure GPU compositing, zero JS color math per frame.
              scale-150 + transform-gpu promotes to its own compositor layer
              so the blur never triggers a CPU rasterisation pass.
              The maskImage on overlayRef is still live-written by paintFrame
              to produce the radial flashlight spotlight effect. */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-10 mix-blend-color opacity-90 pointer-events-none overflow-hidden"
          >
            {/* 4 exact 50/50 absolute quadrants — grid layout was pushing
                the green cell off-screen under scale-150. Absolute positioning
                is mathematically guaranteed to fill each corner. */}
            <div className="w-full h-full blur-[80px] scale-150 transform-gpu relative">
              {/* TL — Red    */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-600" />
              {/* TR — Blue   */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600" />
              {/* BL — Yellow */}
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-yellow-400" />
              {/* BR — Green  */}
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-600" />
            </div>
          </div>
        </div>

        {/* ANCHORED EXTRACTION TOOLTIP — locked dead-centre at the top of
            the canvas container. No mouse tracking; position is pure CSS.
            The inner images still spring from scale-[0.2] + translate-y-[100px]
            up to their resting position, creating the "rise from the stack"
            effect without any chaotic cursor-chasing. */}
        <div
          ref={tooltipRef}
          className={`absolute top-8 left-1/2 -translate-x-1/2 w-[85%] md:w-[65%] h-[250px] md:h-[400px] z-50 pointer-events-none transition-opacity duration-300 ease-out ${
            activeMilestone ? "opacity-100" : "opacity-0"
          }`}
        >
          {historyMilestones.map((milestone) => (
            <img
              key={milestone.id}
              src={milestone.image}
              alt={milestone.title}
              loading="eager"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-contain will-change-[transform,opacity] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                activeMilestone?.id === milestone.id
                  ? "opacity-100 scale-100 translate-y-0 shadow-2xl"
                  : "opacity-0 scale-[0.2] translate-y-12 pointer-events-none"
              }`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — Text-only HUD.
          Image is now a floating tooltip over the canvas (see above).
          This panel only carries Title, Year watermark, and Description. */}
      <div className="w-full md:w-1/3 h-full flex flex-col justify-center gap-6 p-8 md:p-12 py-12 md:py-0 z-30 relative bg-gradient-to-l from-[#0a050a] via-[#0a050a]/80 to-transparent">
        {/* Year watermark — structurally OUTSIDE the animated wrapper.
            No key prop means React updates the text content in-place;
            the DOM node never unmounts, so the outer panel gradient
            never repaints. This is what eliminates the background shake.
            z-0 keeps it layered behind the title + description text. */}
        {activeMilestone && (
          <div className="text-[12rem] md:text-[18rem] font-serif font-black absolute top-0 right-0 md:-right-8 pointer-events-none text-zinc-500/40 select-none z-0 leading-none">
            {activeMilestone.date.split("-")[0]}
          </div>
        )}

        {/* Dynamic text — key + animate-in are scoped EXCLUSIVELY here.
            Only the title and description remount on milestone change.
            The outer panel, gradient, scrubber, and year are untouched. */}
        {activeMilestone && (
          <div
            key={activeMilestone.id}
            className="animate-in fade-in zoom-in-[0.98] duration-300 fill-mode-both relative z-10 min-h-[250px] md:min-h-[350px] flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4 drop-shadow-lg">
              <ScrambleText text={activeMilestone.title} />
            </h2>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 fill-mode-both">
              {activeMilestone.description}
            </p>
          </div>
        )}

        {/* Progression Scrubber — vertical track with glowing dot.
            Dot position maps milestone ID (1-10) linearly down the track.
            The 15px white box-shadow gives it a neon "active waypoint" look. */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-white/5 rounded-full">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
            style={{
              top: `${activeMilestone ? ((activeMilestone.id - 1) / 15) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryStack;
